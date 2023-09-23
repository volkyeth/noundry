import Link from "next/link";

const Button = ({ text, url }) => {
  return (
    <>
      <Link href={url}>
        <button className="bg-[#D9D9D9] p-2 px-3 border-1 border-[#4A5568] rounded-lg text-black text-sm">
          {text}
        </button>
      </Link>
    </>
  );
};

export default Button;
