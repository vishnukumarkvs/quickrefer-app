"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { set } from "date-fns";
import { QuillWrapper, modules } from "./ui/QuillWrapper";
import { AsyncLocationSelect } from "./ui/AsyncLocationSelect";

const useProfileData = (username) => {
  const { data, isLoading, error } = useQuery(["profileData"], async () => {
    const response = await axios.get(`/api/profiledata?username=${username}`);
    return response.data;
  });

  return { data, isLoading, error };
};

const useUpdateWorkData = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => axios.post("/api/profiledata/update/work", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profileData");
      },
    }
  );

  return mutation;
};

const ProfileDetails = ({ data, openPersonal, setOpenPersonal }) => {
  const queryClient = useQueryClient();
  const mutationPersonal = useMutation(
    (data) => axios.post("/api/profiledata/update/personal", data),
    {
      onSuccess: () => {
        queryClient.refetchQueries("profileData");
      },
    }
  );
  const {
    handleSubmit: handleSubmitPersonal,
    control: controlPersonal,
    register: registerPersonal,
  } = useForm({
    defaultValues: {
      fullname: data.fullname,
      phone: data.phone,
      location: data.location,
      currentJobRole: data.currentJobRole,
      experience: data.experience,
      salary: data.salary,
      noticePeriod: data.noticePeriod,
    },
  });

  const onSubmit = (data0) => {
    const locationValue = data0.location ? data0.location.value : null;
    const updatedData = { ...data0, location: locationValue };
    mutationPersonal.mutate(updatedData);
  };

  useEffect(() => {
    if (mutationPersonal.isSuccess) {
      setOpenPersonal(false);
    }
  }, [mutationPersonal.isSuccess]);

  return (
    <div>
      {/* Profile Section */}
      <div className="text-xl font-bold mt-10 mb-5">Personal Details</div>
      <div className="flex">
        <div>
          <p>Full Name: {data.fullname}</p>
          <p>Email: {data.email}</p>
          <p>Phone: {data.phone}</p>
          <p>Location: {data.location}</p>
          <p>Current Job Role: {data.currentJobRole} </p>
          <p>Experience(in years): {data.experience} </p>
          <p>Salary: {data.salary}</p>
          <p>Notice Period: {data.noticePeriod}</p>
        </div>
        <div>
          <Dialog open={openPersonal} onOpenChange={setOpenPersonal}>
            <DialogTrigger asChild>
              <Edit className="hover:bg-black hover:text-white rounded-md p-1" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitPersonal(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullname" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="fullname"
                      className="col-span-3"
                      {...registerPersonal("fullname")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      className="col-span-3"
                      {...registerPersonal("phone")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <div className="w-[280px]">
                      <AsyncLocationSelect
                        control={controlPersonal}
                        name="location"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentJobRole" className="text-right">
                      Current Job Role
                    </Label>
                    <Input
                      id="currentJobRole"
                      className="col-span-3"
                      {...registerPersonal("currentJobRole")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" className="text-right">
                      Salary <br /> (in LPA)
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      className="col-span-3"
                      {...registerPersonal("salary")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="experience" className="text-right">
                      Experience <br /> (in yrs)
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      defaultValue={data.experience}
                      className="col-span-3"
                      required
                      {...registerPersonal("experience")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noticePeriod" className="text-right">
                      Notice Period <br />
                      (in days)
                    </Label>
                    <Input
                      id="noticePeriod"
                      type="number"
                      className="col-span-3"
                      {...registerPersonal("noticePeriod")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" isLoading={mutationPersonal.isLoading}>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

const Profile = ({ username }) => {
  const [content, setContent] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [openPersonal, setOpenPersonal] = useState(false);
  const [openWork, setOpenWork] = useState(false);
  const [openWorkUpdate, setOpenWorkUpdate] = useState(false);

  const { data, isLoading, error } = useProfileData(username);
  console.log("profile adta", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-[80%] h-full mx-auto">
      <ProfileDetails
        data={data}
        openPersonal={openPersonal}
        setOpenPersonal={setOpenPersonal}
      />
    </div>
  );
};

export default Profile;
