"use client";
import { TraitGallery } from "@/components/TraitGallery";
import { useRouter } from "next/router";
import UserDetails from "../../components/UserDetails/UserDetails";

export const getServerSideProps = async () => {
  return { props: {} };
};

const Profile = (props) => {
  const {
    query: { address },
  } = useRouter();

  return (
    <>
      <div className="container  px-2 self-center my-12 mx-auto">
        <UserDetails searchAddress={address} />
        <TraitGallery account={address as `0x${string}`} />
      </div>
    </>
  );
};

export default Profile;
