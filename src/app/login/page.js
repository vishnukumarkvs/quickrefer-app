"use client";

import CredentialsLogin from "@/components/CredentialsLogin";
import Register from "@/components/NewUserRegister";
import PasswordlessLogin from "@/components/PasswordlessLogin";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Logins = () => {
  return (
    <div className="w-full h-screen flex justify-center mt-[100px]">
      <Tabs defaultValue="login" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-2 bg-[#ffc800e5]">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="">
          <div className="flex border-2 rounded-md border-[#ffc800e5] p-5">
            <div className="w-1/2 p-3  border-[#ffc800e5] border-r-2">
              <CredentialsLogin />
            </div>
            <div className="w-1/2 p-3 ml-2">
              <PasswordlessLogin />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="register">
          <div className="border-2 rounded-md border-[#ffc800e5] p-5">
            <Register />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Logins;
