"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const ResumeUpload = () => {
  const { data: session, update } = useSession();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onFileUpload = async () => {
    setIsLoading(true);
    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64File = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();

        // Send the data
        await axios.put(
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
      };
      reader.readAsDataURL(file);
      update({ isResume: true });
      await axios.post("/api/updateresume", { isResume: true });
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Error uploading file");
      console.error("here is the error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="flex gap-2 justify-center items-center">
        <input
          type="file"
          onChange={onFileChange}
          className="flex-1 px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <Button onClick={onFileUpload} variant="ghost" isLoading={isLoading}>
          <Upload size={24} />
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
