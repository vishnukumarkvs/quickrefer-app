"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { UserPlus, Check, X } = require("lucide-react");

const FriendRequests = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    const friendRequestHandler = async ({ senderId }) => {
      try {
        const { data } = await axios.get(`/api/user/${senderId}`);
        setFriendRequests((prev) => [...prev, { senderId, ...data }]);
      } catch (error) {
        console.error(error);
      }
    };
    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId, jobURL) => {
    await axios.post("/api/friends/accept", { id: senderId, url: jobURL });

    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  const denyFriend = async (senderId, jobUrl) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((friendRequest) => (
          <div key={friendRequest.senderId} className="flex items-center gap-4">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{friendRequest.companyName}</p>
            {/* Display the additional details */}
            <p>Fullname: {friendRequest.fullname}</p>
            <p>Experience: {friendRequest.experience}</p>
            <p>Email: {friendRequest.email}</p>
            <p>Username: {friendRequest.username}</p>
            <p>Job URL: {friendRequest.jobURL}</p>

            <button
              onClick={() =>
                acceptFriend(friendRequest.senderId, friendRequest.jobURL)
              }
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md "
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => denyFriend(friendRequest.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md "
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
