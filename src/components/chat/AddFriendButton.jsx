"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const AddFriendButton = ({ id }) => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const addFriend = async () => {
    try {
      await axios.post("/api/friends/add", { id });
      setShowSuccessState(true);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error("Something went wrong! Axios issue");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <Button variant="default" onClick={addFriend}>
      {showSuccessState ? "Sent!" : "ADD"}
    </Button>
  );
};

export default AddFriendButton;
