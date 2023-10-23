"use client";

import { ResponsiveTable } from "responsive-table-react";
import Link from "next/link";
import AddFriendButton from "../chat/AddFriendButton";
import EmptyComponent from "../emptystates/EmptyComponent";

const UserList = ({ users, url }) => {
  const columns = [
    { id: "fullname", text: "Fullname" },
    { id: "profile", text: "Profile" },
    { id: "experience", text: "Experience" },
    { id: "send", text: "Send" },
  ];

  const data = (users ? users : []).map((user) => ({
    fullname: user.fullname,
    profile: (
      <Link
        href={`/user/${user.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        {user.username}
      </Link>
    ),
    experience: `${user.experience} yrs`,
    send: <AddFriendButton id={user.userId} url={url} />,
  }));

  return users?.length > 0 ? (
    <div className="my-5">
      <ResponsiveTable columns={columns} data={data} />
    </div>
  ) : (
    users && users.length === 0 && (
      <EmptyComponent title="We are onboarding referers from 150+ companies very soon, please wait or try for different company." />
    )
  );
};

export default UserList;
