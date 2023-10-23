import Messages from "@/components/chat/Messages";
import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { Download } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const Page = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = params.chatId.split("--");

  if (userId1 !== user.id && userId2 !== user.id) notFound();

  const chatPartnerId = userId1 === user.id ? userId2 : userId1;

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
      return record
        ? {
            userId: record.get("userId"),
            email: record.get("email"),
            name: record.get("name"),
            company: record.get("company"),
          }
        : null;
    });

  const resumeurl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${chatPartner.userId}.pdf`;

  async function downloadFile(url, filename) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-full  max-h-[calc(80vh-6rem)] lg:max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          {/* Uncomment the Image component when you have it ready */}
          {/* <Image src={chatPartner?.image} alt={`${chatPartner?.name} profile image`} className="rounded-full" /> */}
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              Works At{" "}
              <span className="font-semibold">{chatPartner.company}</span>,
              Resume:
              <button
                onClick={() =>
                  downloadFile(resumeurl, `${chatPartner.userId}.pdf`)
                }
                style={{ display: "inline-block", marginLeft: "8px" }}
              >
                <Download className="pt-1" />
              </button>
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
