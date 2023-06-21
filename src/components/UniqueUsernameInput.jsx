import React, { useState, useRef } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";

const UniqueUsernameInput = () => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const timeoutRef = useRef(null);

  const handleUsernameChange = (event) => {
    clearTimeout(timeoutRef.current);
    setUsername(event.target.value);
    timeoutRef.current = setTimeout(validateUsername, 500);
  };

  const validateUsername = async () => {
    setIsChecking(true);

    try {
      const { data } = await axios.post(`/api/checkusername`, {
        username: username,
      });

      setIsUsernameTaken(data.isUsernameTaken);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleBlur = () => {
    clearTimeout(timeoutRef.current);
    if (username) {
      validateUsername();
    }
  };

  return (
    <div className="flex flex-row gap-x-2 items-center">
      <Input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        onBlur={handleBlur}
        placeholder="ex: johndoe"
      />
      {isChecking && <Loader2 className="animate-spin" />}
      {isUsernameTaken ? (
        <span>Username is already taken</span>
      ) : (
        <Check className="rounded-full p-1 bg-green-200" />
      )}
    </div>
  );
};

export default UniqueUsernameInput;
