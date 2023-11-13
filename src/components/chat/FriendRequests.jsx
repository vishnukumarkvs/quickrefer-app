"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Building2, ExternalLink, UserCircle, UserCog } from "lucide-react";
import analytics from "@/lib/analytics";

const FriendRequests = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.bind("incoming_friend_requests", (data) => {
      setFriendRequests((prevRequests) => [...prevRequests, data]);
    });

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", (data) => {
        setFriendRequests((prevRequests) => [...prevRequests, data]);
      });
    };
  }, [sessionId]);

  useEffect(() => {
    analytics.page();
  }, []);

  const acceptFriend = async (senderId, jobURL) => {
    await axios.post("/api/friends/accept", { id: senderId, url: jobURL });

    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  const denyFriend = async (senderId) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  const filteredFriendRequests = friendRequests.filter((friendRequest) => {
    // Check if the search term matches any of the fields (jobURL, companyName, or fullname)
    return (
      friendRequest.jobURL.includes(searchTerm) ||
      friendRequest.companyName.includes(searchTerm) ||
      friendRequest.fullname.includes(searchTerm)
    );
  });

  const sortedFriendRequests = [...filteredFriendRequests].sort((a, b) => {
    if (sortCriteria === "experience") {
      return b.experience - a.experience;
    }
    // Add more sorting criteria if needed
    return 0;
  });

  return (
    <div className="my-5 space-y-5">
      {sortedFriendRequests.length === 0 ? (
        <div className="m-2 p-5 bg-white shadow-md rounded-md">
          <p> No requests received yet. </p>
        </div>
      ) : (
        sortedFriendRequests.map((friendRequest, index) => (
          <div
            className="lg:flex flex-row bg-white shadow-md rounded-md p-2 m-2 overflow-hidden justify-between"
            key={friendRequest.senderId}
          >
            <div>
              <div className="flex items-center justify-start space-x-2">
                <p className="text-sm font-semibold">
                  {friendRequest.fullname} ({friendRequest.experience} yrs exp)
                </p>
                <a
                  href={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${friendRequest.senderId}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <ExternalLink className="stroke-blue-600 pb-1" />
                </a>
              </div>
              <div className="mt-2 flex flex-wrap items-center space-x-2">
                <div className="flex items-center">
                  <Building2 className="text-blue-400 mr-1 p-1/2" />
                  <span className="text-sm font-semibold">
                    {friendRequest.companyName}
                  </span>
                </div>
                <div className="flex items-center">
                  <UserCog className="text-blue-400 mr-1 p-1/2" />
                  <span className="text-sm font-semibold">
                    {friendRequest.jobRole || "Software Engineer"}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm">
                Requesting referral for{" "}
                <a
                  href={
                    friendRequest.jobURL.startsWith("http://") ||
                    friendRequest.jobURL.startsWith("https://")
                      ? friendRequest.jobURL // Already an absolute URL
                      : `http://${friendRequest.jobURL}` // Prepend "http://" if not
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {friendRequest.jobURL}
                </a>
              </p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() =>
                  acceptFriend(friendRequest.senderId, friendRequest.jobURL)
                }
                className="border-teal-500 text-teal-500 border-2 px-4 py-1 rounded-md flex items-center hover:bg-teal-500 hover:text-white transition"
              >
                <FaCheck className="mr-2" />
                Accept
              </button>
              <button
                onClick={() => denyFriend(friendRequest.senderId)}
                className="border-red-500 text-red-500 border-2 px-4 py-1 rounded-md flex items-center hover:bg-red-500 hover:text-white transition"
              >
                <FaTimes className="mr-2" />
                Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequests;
