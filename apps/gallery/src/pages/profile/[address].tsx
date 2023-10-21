"use client";
import { getUserInfo } from "@/app/api/user/[address]/info/getUserInfo";
import { TraitGallery } from "@/components/TraitGallery";
import { UserInfo } from "@/types/user";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<
  { userInfo: UserInfo },
  {
    address: `0x{string}`;
  }
> = async ({ params }) => {
  if (!params?.address) {
    return {
      notFound: true,
    };
  }

  const userInfo = await getUserInfo(params.address);
  return { props: { userInfo } };
};

const Profile: NextPage<{ userInfo: UserInfo }> = ({ userInfo }) => {
  const {
    query: { address },
  } = useRouter();

  console.log(userInfo);

  return (
    <>
      <div className="container flex flex-col px-8 self-center my-12 mx-auto gap-16">
        <div className="flex flex-col gap-4 items-start text-xl ">
          <div className="flex flex-col gap-2">
            <img
              src={userInfo.profilePic}
              className="w-24 h-24 border-8 box-content border-content1 shrink-0 bg-warm"
            />
            <h1 className="text-xl  xs:text-3xl font-Inter mt-0">
              {userInfo.userName.toLowerCase()}
            </h1>
          </div>
          <p className="text-sm xs:text-medium max-w-2xl w-full whitespace-pre-line">
            {userInfo.about}
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-default-400">User traits</h2>
          <TraitGallery account={address as `0x${string}`} />
        </div>
      </div>
    </>
  );
};

export default Profile;
