import { getTrait } from "@/app/actions/getTrait";
import { getUserInfo } from "@/app/actions/getUserInfo";
import { SITE_URI } from "@/constants/config";
import { formatTraitType } from "@/utils/traits/format";
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
    title: `${trait.name} ${formatTraitType(trait.type)}`,
    description: `Created by: ${author.userName}`,
    openGraph: {
      title: `${trait.name} ${formatTraitType(trait.type)}`,
      description: `Created by: ${author.userName}`,
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
  const author = await getUserInfo(trait.address);

  return <TraitSection trait={trait} author={author} />;
};

export default TraitPage;
