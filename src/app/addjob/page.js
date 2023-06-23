import AddJob from "@/components/AddJob";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ddbClient from "@/lib/ddbclient";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

const Page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  const params = {
    TableName: "HumanResource",
    Key: {
      id: { S: session.user.id }, // S means string type
    },
    ProjectionExpression: "company", // Specify the attribute to get
  };

  // TODO: lots of calls on page reload, need to fix
  const response = await ddbClient.send(new GetItemCommand(params));
  const company = response["Item"]["company"]["S"];
  // console.log(response["Item"]["company"]["S"]);

  return (
    <div className="w-[90%] mx-auto">
      <div className=" flex flex-col items-center justify-center">
        <AddJob company={company} userid={session.user.id} />
      </div>
    </div>
  );
};

export default Page;
