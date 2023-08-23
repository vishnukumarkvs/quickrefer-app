"use client";

import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UnseenChatToast from "./UnseenChatToast";
import { toast } from "react-hot-toast";
import { getUnseenCount, updateSeenStatus } from "@/helperClient/firebase";
import { Building } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { Text } from "@chakra-ui/react";
import Link from "next/link";

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
          const unseenCount = await getUnseenCount(chatId, sessionId);
          return {
            ...friend,
            unseenCount,
          };
        })
      );

      setUpdatedFriends(friendsWithUnseenCounts);
    };
    fetchUnseenCounts();
  }, [sessionId, initialFriends]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      const chatId = pathname.split("/").pop();
      const chatSenderUserId = chatId.replace(sessionId, "");

      // Since `updateSeenStatus` is asynchronous, wrap it in an async function
      const updateStatusAndFriends = async () => {
        await updateSeenStatus(chatId, sessionId); // Update seen status for the current chat

        // Update the `updatedFriends` state
        setUpdatedFriends((prevFriends) => {
          return prevFriends.map((friend) =>
            friend.userId === chatSenderUserId
              ? { ...friend, unseenCount: 0 }
              : friend
          );
        });
      };

      // Invoke the function
      updateStatusAndFriends();
    }
  }, [pathname, sessionId]);

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
