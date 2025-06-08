import { getTrait } from "@/app/actions/getTrait";
import { getUserInfo } from "@/app/actions/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { formatSubmissionType } from "@/utils/traits/format";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TraitSection } from "../TraitSection";

export async function generateMetadata({ params }): Promise<Metadata> {
  const trait = await getTrait(params.id);
  if (!trait) {
    return {};
  }
  const author = await getUserInfo(trait.address);

  return {
    title: `${trait.name} ${formatSubmissionType(trait.type)}`,
    description: `${trait.remixedFrom ? "Remixed" : "Created"} by: ${
      author.userName
    }`,
    openGraph: {
      title: `${trait.name} ${formatSubmissionType(trait.type)}${
        trait.remixedFrom ? ` v${trait.version}` : ""
      }`,
      description: `${trait.remixedFrom ? "Remixed" : "Created"} by: ${
        author.userName
      }`,
      images: [
        {
          url: `${SITE_URI}/api/trait/${trait.id}/og`,
        },
      ],
    },
    other: {
      "twitter:image": `${SITE_URI}/api/trait/${trait.id}/og`,
    },
  };
}

const TraitPage = async ({ params: { id } }: { params: { id: string } }) => {
  const trait = await getTrait(id);
  if (!trait) {
    return notFound();
  }

  const remixedFrom = trait.remixedFrom
    ? await getTrait(trait.remixedFrom)
    : null;

  const author = await getUserInfo(trait.address);

  return (
    <TraitSection trait={trait} remixedFrom={remixedFrom} author={author} />
  );
};

export default TraitPage;
