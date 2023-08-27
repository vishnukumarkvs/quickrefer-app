"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// Ref for scrolldown to latest message

function linkify(inputText) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return inputText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

const Messages = ({ sessionId, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const scrollDownRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://1hsde5qkbk.execute-api.us-east-1.amazonaws.com/prod?userId=${sessionId}&chatId=${chatId}`
    );
    setWebSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
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
