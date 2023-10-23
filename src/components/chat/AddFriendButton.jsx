"use client";

import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const AddFriendButton = ({ id, url }) => {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addFriend = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/friends/add", { id, url });
      setShowSuccessState(true);
    } catch (error) {
      console.error(error);

      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error("You cannot send yourself to yourself");
            break;
          case 403:
            toast.error(error.response.data);
            break;
          case 409:
            toast.error(error.response.data);
            break;
          default:
            toast.error("Something went wrong!");
        }
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="xs"
      colorScheme="yellow"
      onClick={addFriend}
      isLoading={isLoading}
    >
      {showSuccessState ? "Sent!" : "Request"}
    </Button>
  );
};

export default AddFriendButton;
