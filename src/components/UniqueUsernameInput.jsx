"use client";

import React, { useState, useRef } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import debounce from "lodash.debounce";

const UniqueUsernameInput = ({ onUsernameChange, onUsernameTakenChange }) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  const validateUsernameDebounced = useRef(
    debounce(async (username) => {
      setIsChecking(true);
      try {
        const { data } = await axios.post(`/api/checkusername`, {
          username: username,
        });
        setIsUsernameTaken(data.isUsernameTaken);
        onUsernameTakenChange(data.isUsernameTaken);
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setIsChecking(false);
        setIsLoading(false);
      }
    }, 500)
  ).current;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setIsLoading(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => validateUsernameDebounced(event.target.value),
      1300
    );
    onUsernameChange(event.target.value);
  };

  const handleBlur = () => {
    clearTimeout(timeoutRef.current);
    if (username) {
      validateUsernameDebounced(username);
    }
  };

  return (
    <div className="flex flex-row gap-x-2 items-center">
      <Input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        onBlur={handleBlur}
        // placeholder="johndoe"
        required
        disabled={isChecking}
      />
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && isUsernameTaken ? (
        <span>Username is already taken</span>
      ) : null}
      {!isLoading && !isUsernameTaken && username && username.length > 0 ? (
        <Check className="rounded-full p-1 bg-green-200" />
      ) : null}
    </div>
  );
};

export default UniqueUsernameInput;
