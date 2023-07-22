import AddReferralJob from "@/components/AddReferralJob";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = await authOptions.adapter.getUser(session.user.id);

  console.log("get user", user);
  // console.log(user.jtusername);
  if (user && user.userRole !== "HR" && user.userRole !== "Referrer") {
    return (
      <p className="font-semibold text-center p-5">
        Only Job Posters can access this page. If you want to be a job poster,
        select either "Referrer" or "HR" role in your profile.
      </p>
    );
  }

  return (
    <div className="w-[90%] mx-auto">
      <div className=" flex flex-col items-center justify-center">
        <AddReferralJob
          company={user.company}
          userid={session.user.id}
          userRole={user.userRole}
        />
      </div>
    </div>
  );
};

export default Page;
