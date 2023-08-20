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

  const fileInputRef = React.useRef(null); // Add this line to get a reference to the input

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64File = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();

        await axios.put(
          "https://s9u8bu61y6.execute-api.us-east-1.amazonaws.com/dev/upload",
          {
            fileData: base64File,
            userId: session.user.id,
          },
          {
            headers: {
              "file-extension": fileExtension,
              "Content-Type": "application/json",
            },
          }
        );

        if (!session.user.isResume) {
          update({ isResume: true });
          await axios.post("/api/updateresume", { isResume: true });
        }

        toast.success("File uploaded successfully");

        // Reset the input field value
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setFile(null); // clear the file state too
          setFileName(""); // clear the filename state
        }
      } catch (error) {
        toast.error("Error uploading file");
        console.error("here is the error", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="flex gap-2 justify-center items-center">
        <input
          ref={fileInputRef} // Attach the reference to the input
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
