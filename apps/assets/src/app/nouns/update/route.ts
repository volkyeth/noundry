import { revalidateAll } from "@/actions/revalidateAll";
import { publicClient } from "@/publicClient";
import * as crypto from "crypto";
import { NextResponse } from "next/server";
import { fetchOnchainNounsArtData, nounsTraitNames, toImageData, TraitNames } from "noggles";
import { Octokit } from "octokit";

// You'll need to add these environment variables to your deployment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

interface UpdateWebhookBody {
    webhookId: string;
    id: string;
    createdAt: string;
    type: string;
    event: {
        data: {
            block: {
                hash: string;
                number: number;
                timestamp: number;
                logs: {
                    transaction: {
                        hash: string;
                    };
                }[];
            };
        };
    };
}

interface ProposalDetails {
    data: {
        proposals: [
            {
                description: string,
                id: string
            }
        ]
    }
}

export async function POST(request: Request) {
    if (!process.env.UPDATE_WEBHOOK_ALCHEMY_SIGNING_KEY) {
        return NextResponse.json({ error: "Missing UPDATE_WEBHOOK_ALCHEMY_SIGNING_KEY" }, { status: 500 });
    }

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
        return NextResponse.json(
            { error: "Missing GitHub configuration" },
            { status: 500 }
        );
    }

    const rawBody = await request.text();

    if (!isValidSignatureForStringBody(
        await rawBody,
        request.headers.get("x-alchemy-signature") || "",
        process.env.UPDATE_WEBHOOK_ALCHEMY_SIGNING_KEY)
    ) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    revalidateAll();

    const body = JSON.parse(rawBody) as UpdateWebhookBody;

    const propTransactionHash = body.event.data.block.logs[0].transaction.hash;

    const propDetails = await (fetch("https://www.nouns.camp/subgraphs/nouns", {

        body: JSON.stringify({
            query: `query MyQuery {\n  proposals(\n    where: {executedTransactionHash: "${propTransactionHash}"}\n  ) {\n    description\n    id\n  }\n}`,
            operationName: "MyQuery"
        }),
        method: "POST"
    }).then(res => res.json())) as ProposalDetails;

    const result = propDetails.data.proposals[0].description.match(/^Contribution name: (.+) ([\S]+)$/m)!;

    const traitName = result?.[1];
    const traitType = result?.[2]

    let traitNames = nounsTraitNames;

    if (traitType) traitNames[getTraitCategory(traitType)].push(traitName);

    try {
        // Initialize Octokit
        const octokit = new Octokit({
            auth: GITHUB_TOKEN,
        }).rest;

        const [{ data: currentPackageJson }] = await Promise.all([
            octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: "packages/nouns-assets/package.json",
            }),
        ]);

        if (!("content" in currentPackageJson)) {
            throw new Error("Could not get file information");
        }

        // Fetch and prepare the new image data
        const imageData = toImageData(
            await fetchOnchainNounsArtData(publicClient),
            traitNames
        );

        // Prepare the updated package.json
        const packageJson = JSON.parse(
            Buffer.from(currentPackageJson.content, "base64").toString()
        );
        const [major, minor, patch] = packageJson.version.split(".").map(Number);
        packageJson.version = `${major}.${minor + 1}.${patch}`;

        // Create a tree with all file changes
        const { data: tree } = await octokit.git.createTree({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            base_tree: (await octokit.git.getRef({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                ref: 'heads/main'
            })).data.object.sha,
            tree: [
                {
                    path: "packages/nouns-assets/src/image-data.json",
                    mode: "100644",
                    type: "blob",
                    content: JSON.stringify(imageData, null, 2)
                },
                {
                    path: "packages/nouns-assets/package.json",
                    mode: "100644",
                    type: "blob",
                    content: JSON.stringify(packageJson, null, 2)
                },
                {
                    path: "packages/noggles/src/nouns/traitNames.json",
                    mode: "100644",
                    type: "blob",
                    content: JSON.stringify(traitNames, null, 2)
                }
            ]
        });

        // Create a commit with the new tree
        const { data: commit } = await octokit.git.createCommit({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            message: `Add ${traitName ? `${traitName} ${traitType}` : "new trait"}`,
            tree: tree.sha,
            parents: [(await octokit.git.getRef({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                ref: 'heads/main'
            })).data.object.sha]
        });

        // Update the reference
        await octokit.git.updateRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: 'heads/main',
            sha: commit.sha
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating files:", error);
        return NextResponse.json(
            { error: "Failed to update files" },
            { status: 500 }
        );
    }
}

function isValidSignatureForStringBody(
    body: string, // must be raw string body, not json transformed version of the body
    signature: string, // your "X-Alchemy-Signature" from header
    signingKey: string, // taken from dashboard for specific webhook
): boolean {
    const hmac = crypto.createHmac("sha256", signingKey); // Create a HMAC SHA256 hash using the signing key
    hmac.update(body, "utf8"); // Update the token hash with the request body using utf8
    const digest = hmac.digest("hex");
    return signature === digest;
}

function getTraitCategory(traitType: string): keyof TraitNames {
    switch (traitType) {
        case "noggles":
            return "glasses";
        case "body":
            return "bodies";
        case "accessory":
            return "accessories";
        case "head":
            return "heads";
    }

    throw new Error(`Unknown trait type: ${traitType}`);
}
