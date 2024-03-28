import { getTrait } from "@/app/actions/getTrait";
import { getUserInfo } from "@/app/actions/getUserInfo";
import { notFound } from "next/navigation";
import { TraitSection } from "../Trait";

const TraitPage = async ({ params: { id } }: { params: { id: string } }) => {
  const trait = await getTrait(id);
  if (!trait) {
    return notFound();
  }
  const author = await getUserInfo(trait.address);

  return <TraitSection trait={trait} author={author} />;
};

export default TraitPage;
