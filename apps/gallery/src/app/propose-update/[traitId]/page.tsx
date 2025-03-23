import { getTrait } from "@/app/actions/getTrait";
import { getUserInfo } from "@/app/actions/getUserInfo";
import { appConfig } from "@/variants/config";
import { ProposeUpdate } from "@/variants/nouns/components/propose-update/ProposeUpdate";
import { notFound } from "next/navigation";

const ProposeUpdatePage = async ({
  params,
}: {
  params: { traitId: string };
}) => {
  const { traitId } = params;

  if (!appConfig.traitUpdatesEnabled) {
    return notFound();
  }

  if (!traitId) {
    return notFound();
  }

  const trait = await getTrait(traitId);

  if (!trait) {
    return notFound();
  }

  const author = await getUserInfo(trait.address);

  return <ProposeUpdate trait={trait} author={author} />;
};

export default ProposeUpdatePage;
