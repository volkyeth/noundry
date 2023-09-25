"use client";
import { usePathname } from "next/navigation";
import UserDetails from "../../components/UserDetails/UserDetails";

const Profile = () => {
  // const router = useRouter();
  // const params = useParams();
  const x = usePathname();
  // const address = params.address;
  return (
    <>
      <div>
        <UserDetails searchAddress={x.split("/")[2]} />
      </div>
    </>
  );
};

export default Profile;
