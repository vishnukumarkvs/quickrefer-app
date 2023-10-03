"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { linkify } from "@/lib/utils";

const chat_websocket_url = process.env.NEXT_PUBLIC_CHAT_WEBSOCKET_URL;
const get_messages_url = process.env.NEXT_PUBLIC_GET_CHAT_MESSAGES_URL;

if (!chat_websocket_url || !get_messages_url) {
  console.error(
    "API URL is not defined. Please define NEXT_PUBLIC_CHAT_WEBSOCKET_URL and NEXT_PUBLIC_GET_CHAT_MESSAGES_URL in .env"
  );
}

const Messages = ({ userId, friendId, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${get_messages_url}?chatId=${chatId}`);
      if (response.status === 200) {
        const data = response.data.map((msg) => ({
          content: msg.content.S,
          chatId: msg.chatId.S,
          senderId: msg.senderId.S,
          timestamp: msg.timestamp.N,
        }));
        data.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
        // console.log("buhaha", data);
        setMessages(data); // Reverse the array to show recent messages at the bottom
      } else {
        throw new Error(`Error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const ws = new WebSocket(
      `${chat_websocket_url}?userId=${userId}&chatId=${chatId}`
    );
    setWebSocket(ws);

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]); // Add the new message at the end
    };

    return () => {
      ws.close();
    };
  }, [chatId, userId]);

  const handleSend = () => {
    if (input.trim()) {
      setIsLoading(true);
      const payload = {
        action: "sendmessage",
        senderId: userId,
        receiverId: friendId,
        chatId: chatId,
        content: input,
      };
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(payload));
        setInput("");
        textareaRef.current?.focus();
      } else {
        toast.error("Please refresh window and try again.");
      }
      setIsLoading(false);
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        id="messages"
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div />
        {messages &&
          messages.map((message) => {
            const isCurrentUser = message.senderId === userId;
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
                      dangerouslySetInnerHTML={{
                        __html: linkify(message.content),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="border-t border-gray-200 px-4 pt-4 mb-8">
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <TextAreaAutosize
            ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message here`}
            className="block w-full outline-0 pl-2 resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
          />
          <div
            onClick={() => textareaRef.current?.focus()}
            className="py-2"
            aria-hidden="true"
          >
            <div className="py-px">
              <div className="h-9"></div> {/*  big-size of text-area */}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <Button isLoading={isLoading} onClick={handleSend} type="submit">
                SEND
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
