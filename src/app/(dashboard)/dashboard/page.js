import EmptyComponent from "@/components/emptystates/EmptyComponent";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <p>Hi Dashboard</p>
      <EmptyComponent title={"No Data found"} />
      {/* interactivity like this shou;d be in client component */}
      {/* <Button onClick={() => signOut()}>Sign Out</Button> */}
    </div>
  );
};

export default Dashboard;
