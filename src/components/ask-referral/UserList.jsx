"use client";

import { ResponsiveTable } from "responsive-table-react";
import AddFriendButton from "../chat/AddFriendButton";
import EmptyComponent from "../emptystates/EmptyComponent";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Text,
  IconButton,
  ButtonGroup,
  Button,
  Box,
  Heading,
  Link,
} from "@chakra-ui/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import ShareButton from "../ShareButton";

const isMobile = () => {
  try {
    return window.innerWidth < 768;
  } catch {
    return false;
  }
};

const UserList = ({ users, url, company }) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <></>;

  return users?.length > 0 ? (
    isMobile() ? (
      <div className="flex flex-col gap-3 my-5 items-start">
        {users.map((user, index) => (
          <Card w="full" key={index}>
            <CardHeader pb="1">
              <Flex spacing="4">
                <Flex flex="1" gap="2" alignItems="center" flexWrap="wrap">
                  <Box>
                    <Heading size="sm" pb="1">
                      {user.username}
                    </Heading>
                    <Text>{user.experience}&nbsp;yrs exp</Text>
                  </Box>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody py="0">
              <Text>{`Works as a ${
                user.currentJobRole || "Software Engineer"
              }`}</Text>
            </CardBody>

            <CardFooter pt="2">
              <ButtonGroup spacing="2">
                {session?.user?.id ? (
                  <AddFriendButton id={user.userId} url={url} />
                ) : (
                  <Button
                    size="xs"
                    colorScheme="yellow"
                    onClick={() => {
                      localStorage.setItem("joburl", url);
                      localStorage.setItem("company", company);
                      signIn("google");
                    }}
                  >
                    Request
                  </Button>
                )}
                {/* <Link href={`/user/${user.username}`} passHref>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue text-xs"
                  >
                    View Profile
                  </a>
                </Link> */}
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
        {/* <ShareButton /> */}
      </div>
    ) : (
      <div className="my-5">
        <Table>
          {/* <TableCaption>A list of potential referrers.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              {/* <TableHead>Profile</TableHead> */}
              <TableHead>Experience</TableHead>
              <TableHead className="text-right">Send</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>
                  {user.currentJobRole || "Software Engineer"}
                </TableCell>
                {/* <TableCell>
                  <Link
                    href={`/user/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {user.username}
                  </Link>
                </TableCell> */}
                <TableCell>{user.experience} yrs</TableCell>
                <TableCell className="text-right">
                  {session?.user?.id ? (
                    <AddFriendButton id={user.userId} url={url} />
                  ) : (
                    <Button
                      size="xs"
                      colorScheme="yellow"
                      onClick={() => {
                        localStorage.setItem("joburl", url);
                        localStorage.setItem("company", company);
                        signIn("google");
                      }}
                    >
                      Request
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <ShareButton /> */}
      </div>
    )
  ) : (
    users && users.length === 0 && (
      <EmptyComponent title="We are onboarding referers from 150+ companies very soon, please wait or try for different company." />
    )
  );
};

export default UserList;
