// dynamic route

import ChatInput from "@/components/chat/ChatInput";
import Messages from "@/components/chat/Messages";
import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
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
        RETURN u.email as email, u.username as name
        `,
      { userId: chatPartnerId }
    )
    .then((result) => {
      return result.records.map((record) => record.get("u"));
    });

  console.log(chatPartner);

  console.log(params.chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
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
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages sessionId={session.user.id} chatId={params.chatId} />
      <ChatInput chatId={params.chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default Page;
