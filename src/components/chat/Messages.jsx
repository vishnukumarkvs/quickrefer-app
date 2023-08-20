"use client";

import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { off, onChildAdded, onValue, ref, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";

// Ref for scrolldown to latest message

function linkify(inputText) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return inputText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

const Messages = ({ sessionId, chatId }) => {
  // direct show to users rather than refresh
  const [messages, setMessages] = useState([]);
  const scrollDownRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    return format(timestamp, "HH:mm");
  };

  // useEffect(() => {
  //   const chatRef = ref(db, `chat/${chatId}/messages`);
  //   const messageHandler = (snapshot) => {
  //     const message = snapshot.val();
  //     setMessages((prevMessages) => [message, ...prevMessages]);
  //   };

  //   onChildAdded(chatRef, messageHandler);

  //   return () => {
  //     off(chatRef, "child_added", messageHandler);
  //   };
  // }, [chatId]);

  useEffect(() => {
    const chatRef = ref(db, `chat/${chatId}/messages`);
    const messageHandler = async (snapshot) => {
      const message = snapshot.val();
      setMessages((prevMessages) => [message, ...prevMessages]);

      // Check if the message sender is not the current user
      // and if the message has not been marked as seen
      if (message.senderId !== sessionId && !message.seen) {
        // Update the message's seen status
        const messageRef = ref(db, `chat/${chatId}/messages/${snapshot.key}`);
        await update(messageRef, { seen: true });
      }
    };

    onChildAdded(chatRef, messageHandler);

    return () => {
      off(chatRef, "child_added", messageHandler);
    };
  }, [chatId, sessionId]);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message) => {
        const isCurrentUser = message.senderId === sessionId;
        const messageKey = `${message.id}-${message.timestamp}`; // Generate a unique key

        return (
          <div className="chat-message" key={messageKey}>
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                {/* <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                </span> */}
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                  })}
                  dangerouslySetInnerHTML={{ __html: linkify(message.text) }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
