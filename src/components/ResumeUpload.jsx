"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { FileUpload } from "@/lib/file-upload";

// const resume_api_url = process.env.NEXT_PUBLIC_RESUME_UPLOAD_URL;

// if (!resume_api_url) {
//   console.error("Resume API URL is not defined.");
// }

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
    if (file.type !== "application/pdf") {
      toast.error("Please select a pdf file");
      return;
    }
    setIsLoading(true);
    FileUpload(file)
      .then(async (res) => {
        setIsLoading(false);
        if (!session.user.isResume) {
          update({ isResume: true });
          await axios.post("/api/updateresume", { isResume: true });
        }
        // Reset the input field value
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setFile(null); // clear the file state too
          setFileName(""); // clear the filename state
        }
        toast.success("File uploaded successfully");
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Error uploading file");
      });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="flex gap-2 justify-center items-center">
        <input
          ref={fileInputRef} // Attach the reference to the input
          type="file"
          onChange={onFileChange}
          accept=".pdf"
          className="flex-1 px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <Button onClick={onFileUpload} variant="ghost" isLoading={isLoading}>
          {/* <Upload size={24} /> */}
          <p className="text-sm">Upload</p>
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
