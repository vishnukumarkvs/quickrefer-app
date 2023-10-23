// dynamic route

import Messages from "@/components/chat/Messages";
import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { Download } from "lucide-react";
// import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const Page = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = params.chatId.split("--");

  if (userId1 !== user.id && userId2 !== user.id) notFound();

  const chatPartnerId = userId1 === user.id ? userId2 : userId1;
  //   const chatPartner = await redis.get(`user:${chatPartnerId}`);
  const chatPartner = await driver
    .session()
    .run(
      `
    MATCH (u:User {userId: $userId})
    MATCH (u)-[:WORKS_AT]->(c:Company)
    RETURN u.userId as userId, u.email as email, u.username as name, c.name as company
    `,
      { userId: chatPartnerId }
    )
    .then((result) => {
      const record = result.records[0];
      if (record) {
        return {
          userId: record.get("userId"),
          email: record.get("email"),
          name: record.get("name"),
          company: record.get("company"),
        };
      } else {
        return null;
      }
    });

  let resumeurl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${chatPartner.userId}.pdf`;
  const downloadResume = (
    <a href={resumeurl} download style={{ display: "inline-block" }}>
      <Download className="pt-1" />
    </a>
  );

  // console.log(chatPartner);

  // console.log("roberto", params.chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full  max-h-[calc(80vh-6rem)] lg:max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative sm:w-12 w-8 h-8 sm:h-12">
              {/* <Image
                fill
                referrePolicy="no-referrer"
                src={chatPartner?.image}
                alt={`${chatPartner?.name} profile image`}
                className="rounded-full"
              /> */}
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span
              className="text-sm text-gray-600"
              style={{ display: "inline-block" }}
            >
              Works At{" "}
              <span className="font-semibold">{chatPartner.company}</span>,
              Resume:<span className="mt-2">{downloadResume}</span>
            </span>
          </div>
        </div>
      </div>
      <Messages
        userId={session.user.id}
        friendId={chatPartnerId}
        chatId={params.chatId}
      />
    </div>
  );
};

export default Page;
