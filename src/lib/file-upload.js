import axios from "axios";

export const FileUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/file-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
