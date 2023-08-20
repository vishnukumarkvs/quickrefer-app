import Profile from "@/components/Profile";
import ProfilePlane from "@/components/ProfilePlain";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
// import { useSession } from "next-auth/react";

const Page = async ({ params }) => {
  //   const { data: session, status } = useSession();
  const session = await getServerSession(authOptions);
  let realUser;
  try {
    const user = await authOptions.adapter.getUser(session.user.id);
    realUser = user;

    if (params.username === realUser.jtusername) {
      return (
        <div>
          <Profile username={realUser.jtusername} />
        </div>
      );
    } else {
      return (
        <div>
          <ProfilePlane username={params.username} userId={realUser.id} />
        </div>
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default Page;
