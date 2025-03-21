import { getTrait } from "@/app/actions/getTrait";
import { getUserInfo } from "@/app/actions/getUserInfo";
import { ProposeUpdate } from "@/app/propose-update/ProposeUpdate";
import { notFound } from "next/navigation";

const ProposeUpdatePage = async ({
  params,
}: {
  params: { traitId: string };
}) => {
  const { traitId } = params;

  // Validate that the traitId is a valid MongoDB ObjectId

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
