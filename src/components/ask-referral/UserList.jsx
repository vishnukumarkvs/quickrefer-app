"use client";

import Link from "next/link";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import AddFriendButton from "../chat/AddFriendButton";
import EmptyComponent from "../emptystates/EmptyComponent";

const UserList = ({ users, url }) => {
  return users?.length > 0 ? ( // Check if users is not empty
    <div className="my-5">
      <Table>
        {/* <TableCaption>A list of potential referrers.</TableCaption> */}
        <Thead>
          <Tr>
            {/* <Th>No</Th> */}
            <Th>Fullname</Th>
            <Th>Profile</Th>
            <Th>Experience</Th>
            <Th>Send</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, index) => (
            <Tr key={index}>
              {/* <Td>{index + 1}</Td> */}
              <Td>{user.fullname}</Td>
              <Td>
                <Link
                  href={`/user/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {user.username}
                </Link>
              </Td>
              <Td>{user.experience} yrs</Td>
              <Td>
                <AddFriendButton id={user.userId} url={url} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  ) : (
    users && users.length === 0 && (
      <EmptyComponent title="We are onboarding referers from 150+ companies very soon, please wait or try for different company." />
    )
  );
};
export default UserList;
