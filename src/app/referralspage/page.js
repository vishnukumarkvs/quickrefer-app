"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io("http://52.90.147.241:6001");

    socket.on("connect", () => {
      console.log("Connected to the server");

      // Specify your user id here
      const userId = session.user.id;

      socket.emit("register", userId);
    });

    // Listen to message event from the server
    socket.on("message", (message) => {
      console.log("Received message:", message);

      // Update the state with the new message
      // setMessages((prevMessages) => [...prevMessages, message.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  return (
    <div>
      <h1>Messages</h1>
      {messages.map((message, i) => (
        <div>
          <p key={i}>{message.jobUrl}</p>
          <p key={i}>{message.message}</p>
        </div>
      ))}
    </div>
  );
}
