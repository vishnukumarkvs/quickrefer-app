"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NewUser = () => {
  const router = useRouter();
  return (
    <div className="w-[70%] h-screen mx-auto pt-[10px] justify-center items-center">
      <p className="text-center font-bold text-4xl m-4">
        Please select who you are{" "}
      </p>
      <div className="flex flex-row gap-x-4 justify-center mt-[20px]">
        <Button
          variant="outline"
          className="w-full px-7 py-11 m-3"
          onClick={() => router.push("/profile/user")}
        >
          User
        </Button>
        <Button
          variant="outline"
          className="w-full px-7 py-11 m-3"
          onClick={() => router.push("/profile/hr")}
        >
          Recruiter
        </Button>
        <Button
          variant="outline"
          className="w-full px-7 py-11 m-3"
          onClick={() => router.push("/profile/company")}
        >
          Company
        </Button>
      </div>
    </div>
  );
};

export default NewUser;
