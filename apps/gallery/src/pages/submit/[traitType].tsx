import { GetStaticPaths, GetStaticProps } from "next";
import { IMAGE_TRAIT_TYPES } from "noggles";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: IMAGE_TRAIT_TYPES.map((traitType) => `/submit/${traitType}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (props) => {
  return {
    props: {},
  };
};
const Submit = () => {
  return (
    <div className="container w-full max-w-4xl mx-auto px-4 gap-20 lg:gap-32 items-center flex flex-col py-4 pt-8">
      <h1 className="font-Pix text-lg xl:text-4xl sm:text-lg lg:text-2xl">
        Submit
      </h1>
    </div>
  );
};

export default Submit;
