const AccountImage = ({ users }) => {
  return (
    <>
      {/* <div className="grid grid-cols-4 gap-3 py-6"> */}
      <div className="py-6 grid grid-cols-2 gap-4 mt-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 2xl:grid-cols-4 sm:grid-cols-1 ">
        {users?.map((data, i) => (
          <div
            key={i}
            className="w-fit flex flex-col justify-center items-center gap-2 mt-7 justify-self-center cursor-pointer"
          >
            <a
              href={`/profile/${data._id}`}
              className="flex flex-col justify-center items-center gap-4 h-full"
            >
              <img
                src={
                  data?.profilePic ? data?.profilePic : "/DefaultProfile.svg"
                }
                className="rounded-full border-1 border-dark dark:border-white object-cover w-full h-full aspect-square"
                alt="Image"
              />
              <p className="font-Pix text-[14px] text-black dark:text-white">
                {data.userName
                  ? data.userName
                  : data?._id?.slice(0, 5) + "..." + data?._id?.slice(38)}
              </p>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default AccountImage;
