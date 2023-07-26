"use client";

// QuillWrapper
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import "react-quill/dist/quill.snow.css";

export const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ ...props }) => <RQ {...props} />;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    ),
  }
);

export const modules = {
  toolbar: [
    // [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
    // [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
