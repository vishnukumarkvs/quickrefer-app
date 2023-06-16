import { Check, Loader2 } from "lucide-react";
import React, { useState, useRef } from "react";
import { Input } from "./ui/input";

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
    const params = {
      TableName: "Usernames",
      Key: {
        username: {
          S: username,
        },
      },
      ProjectionExpression: "username",
    };

    try {
      const result = await dynamodb.getItem(params).promise();
      return !!result.Item; // Returns true if the item exists, false otherwise
    } catch (error) {
      console.error("Error checking username in DynamoDB:", error);
      throw error;
    }
    setIsUsernameTaken(data.isTaken);
    setIsChecking(false);
  };

  const handleBlur = () => {
    clearTimeout(timeoutRef.current);
    if (username) {
      validateUsername();
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default UniqueUsernameInput;
