import { getTrait } from "@/app/actions/getTrait";
import { getUserInfo } from "@/app/actions/getUserInfo";
import { Propose } from "@/variants/proxy-components/Propose";
import { notFound } from "next/navigation";

const ProposePage = async ({
  params: { traitId },
}: {
  params: { traitId: string };
}) => {
  const trait = await getTrait(traitId);

  if (!trait) {
    return notFound();
  }

  const author = await getUserInfo(trait.address);

  return <Propose trait={trait} author={author} />;
};

export default ProposePage;
