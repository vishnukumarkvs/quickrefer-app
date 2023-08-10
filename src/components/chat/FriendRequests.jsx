"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { UserPlus, Check, X } = require("lucide-react");
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const FriendRequests = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);
  console.log("fffffff", friendRequests);

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
    <div className="my-5">
      <Table>
        <TableCaption>A list of referral requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Job URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friendRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan="8">
                <p className="text-sm text-zinc-500">Nothing to show here...</p>
              </TableCell>
            </TableRow>
          ) : (
            friendRequests.map((friendRequest, index) => (
              <TableRow key={friendRequest.senderId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{friendRequest.companyName}</TableCell>
                <TableCell>{friendRequest.fullname}</TableCell>
                <TableCell>{friendRequest.experience}</TableCell>
                <TableCell>
                  <Link
                    href={`http://localhost:3000/user/${friendRequest.username}`}
                    target="_blank"
                    className="text-blue-500"
                  >
                    {friendRequest.username}
                  </Link>
                </TableCell>
                <TableCell>{friendRequest.jobURL}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        acceptFriend(
                          friendRequest.senderId,
                          friendRequest.jobURL
                        )
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FriendRequests;
