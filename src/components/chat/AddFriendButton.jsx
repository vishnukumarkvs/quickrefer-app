"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { AxiosError } from "axios";
import { set, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

const AddFriendButton = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (id) => {
    try {
      await axios.post("/api/friends/add", { id });
      setShowSuccessState(true);
    } catch (error) {
      console.error(error);
      // if (error instanceof z.ZodError) {
      //   setError("email", { message: error.message });
      //   return;
      // }
      if (error instanceof AxiosError) {
        setError("id", { message: error.response?.data });
        return;
      }
      setError("id", { message: "Something went wrong!" });
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    addFriend(data.id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add Friend by Id
      </label>

      <div className="mt-4 flex gap-4">
        <Input
          {...register("id")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray=400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="##########"
        />
        <Button>ADD</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.id?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
