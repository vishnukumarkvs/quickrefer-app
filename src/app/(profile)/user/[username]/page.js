import Profile from "@/components/Profile";
import ProfilePlane from "@/components/ProfilePlain";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
// import { useSession } from "next-auth/react";

const Page = async ({ params }) => {
  //   const { data: session, status } = useSession();
  const session = await getServerSession(authOptions);
  try {
    // let realUser = await authOptions.adapter.getUser(session.user.id);

    if (params.username === session.user.jtusername) {
      return (
        <div>
          <Profile username={session.user.jtusername} />
        </div>
      );
    } else {
      return (
        <div>
          <ProfilePlane username={params.username} />
        </div>
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default Page;
