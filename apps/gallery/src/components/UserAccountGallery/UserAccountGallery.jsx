import TraitCard from "../TraitCard";
// import { useRouter } from 'next/router';

const UserAccountGallery = ({
  userFavouriteData,
  setIsModalOpen,
  isModalOpen,
}) => {
  // const router = useRouter();

  return (
    <>
      <div className=" grid grid-cols-2 gap-4 mt-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 sm:grid-cols-1 sm:px-4">
        {userFavouriteData?.map((card, i) => (
          <TraitCard key={i} trait={card} />
        ))}
      </div>
    </>
  );
};

export default UserAccountGallery;
