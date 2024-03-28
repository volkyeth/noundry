import { getUserInfo } from "@/app/actions/getUserInfo";
import Profile from "../Profile";

const ProfilePage = async ({
  params: { address },
}: {
  params: { address: `0x${string}` };
}) => {
  const userInfo = await getUserInfo(address);

  return <Profile userInfo={userInfo} />;
};

export default ProfilePage;
