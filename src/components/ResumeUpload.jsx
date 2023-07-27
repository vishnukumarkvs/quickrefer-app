"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const ResumeUpload = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onFileUpload = async () => {
    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64File = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();
        console.log("session user id", session.user.id);

        // Send the data
        const response = await axios.put(
          "https://s9u8bu61y6.execute-api.us-east-1.amazonaws.com/dev/upload", // Replace with your API Gateway URL
          {
            fileData: base64File,
            userId: session.user.id, // Replace with your user ID
          },
          {
            headers: {
              "file-extension": fileExtension,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full m-7 bg-white">
      <div className="flex flex-col gp-2">
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload</button>
      </div>
    </div>
  );
};

export default ResumeUpload;
