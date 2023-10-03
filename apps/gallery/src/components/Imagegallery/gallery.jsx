import TraitCard from "../TraitCard";

const Gallery = ({ imageCardData }) => {
  return (
    <div className="container grid grid-cols-2 gap-4 mt-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 sm:grid-cols-1 sm:px-4">
      {imageCardData.map((card, i) => {
        return <TraitCard key={`card-${i}`} trait={card} />;
      })}
    </div>
  );
};

export default Gallery;
