"use client";

import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { Text } from "@chakra-ui/react";
import Link from "next/link";
import axios from "axios";

const SidebarChatList = ({ friends: initialFriends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [updatedFriends, setUpdatedFriends] = useState(initialFriends);

  useEffect(() => {
    // function inside - only on useEffect
    // function outside - runs every rerenders - then you have to use UseCallback
    const fetchUnseenCounts = async () => {
      const friendsWithUnseenCounts = await Promise.all(
        initialFriends.map(async (friend) => {
          const chatId = chatHrefConstructor(sessionId, friend.userId);
          // console.log("chatId", chatId);
          // console.log("sessionId", sessionId);
          const response = await axios.get(
            `https://rr8ykls1lb.execute-api.us-east-1.amazonaws.com/dev/status/getUnseenCountOfChat?chatId=${chatId}&userId=${sessionId}`
          );
          const {
            data: { seenCount },
            status,
          } = response;
          // console.log("unseen count in response", seenCount);

          return {
            ...friend,
            unseenCount: seenCount,
          };
        })
      );

      setUpdatedFriends(friendsWithUnseenCounts);
    };
    fetchUnseenCounts();
  }, [sessionId, initialFriends]);

  // useEffect(async () => {
  //   if (pathname?.includes("chat")) {
  //     const chatId = pathname.split("/").pop();

  //     console.log("chatId@", chatId);
  //     console.log("sessionId@", sessionId);
  //     await axios.post(
  //       "https://rr8ykls1lb.execute-api.us-east-1.amazonaws.com/dev/status/updateUnseenStatus",
  //       {
  //         chatId: chatId,
  //         receiverId: sessionId,
  //       }
  //     );
  //   }
  // }, [pathname, sessionId]);

  const handleChatClick = (clickedUserId) => {
    setUpdatedFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.userId === clickedUserId ? { ...friend, unseenCount: 0 } : friend
      )
    );
  };

  const totalUnseenMessageCount = updatedFriends.reduce(
    (acc, friend) => acc + (friend.unseenCount || 0),
    0
  );

  return (
    <ul
      role="list"
      className="list-none max-h-[25rem] overflow-y-auto mx-2 my-2 space-y-1"
      id="sidebar-chat-list"
    >
      {updatedFriends?.length > 0 ? (
        updatedFriends.sort().map((friend) => {
          const unseenMessageCount = friend.unseenCount || 0;
          return (
            <li key={friend.userId}>
              <div className="flex space-x-1 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Building className="text-gray-500 p-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{friend.company}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link
                  href={`/dashboard/chat/${chatHrefConstructor(
                    sessionId,
                    friend.userId
                  )}`}
                >
                  <div
                    role="button"
                    className="text-gray-700 hover:text-indigo-600 hover-bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    onClick={() => handleChatClick(friend.userId)}
                  >
                    {friend.name}
                    {unseenMessageCount > 0 && (
                      <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                        {unseenMessageCount}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </li>
          );
        })
      ) : (
        <Text fontSize="sm" color={"gray.500"}>
          No chats found
        </Text>
      )}
    </ul>
  );
};

export default SidebarChatList;
