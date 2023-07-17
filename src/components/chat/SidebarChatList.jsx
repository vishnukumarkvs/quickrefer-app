"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UnseenChatToast from "./UnseenChatToast";
import { toast } from "react-hot-toast";
import { updateSeenStatus } from "@/helperClient/firebase";

const SidebarChatList = ({ friends, sessionId }) => {
  console.log("friends in sidebarchatlist", friends);
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState([]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendHandler = () => {
      router.refresh();
    };

    const chatHandler = (message) => {
      console.log("new message", message);
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => (
        // custom componenet
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));
      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", friendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", friendHandler);
    };
  }, [pathname, sessionId, router]);

  // useEffect(() => {
  //   if (pathname?.includes("chat")) {
  //     // change unseen messages to seen
  //     setUnseenMessages((prev) => {
  //       return prev.filter((msg) => !pathname.includes(msg.senderId));
  //     });
  //   }
  // }, [pathname]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      const chatId = pathname.split("/").pop(); // Extract the chatId from the pathname
      updateSeenStatus(chatId, sessionId); // Update the seen status of all messages in this chat
      // filter out the seen messages
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname, sessionId]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto mx-2 space-y-1">
      {friends.sort().map((friend) => {
        //unseen messages
        const unseenMessageCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;
        return (
          <li key={friend.id}>
            {/* hard refresh needed */}
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-indigo-600 hover-bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {unseenMessageCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessageCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
