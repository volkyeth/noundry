"use client";
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
      <div>
        <UserDetails searchAddress={address} />
      </div>
    </>
  );
};

export default Profile;
