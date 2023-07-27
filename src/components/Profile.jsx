"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import * as DOMPurify from "dompurify";
import useRenderCounter from "@/helperClient/useRenderCount";

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
import { Edit, Loader2, Pencil, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { set } from "date-fns";
import { QuillWrapper, modules } from "./ui/QuillWrapper";
import { AsyncLocationSelect } from "./ui/AsyncLocationSelect";
import { useRouter } from "next/navigation";
import ResumeUpload from "./ResumeUpload";

const useProfileData = (username) => {
  const { data, isLoading, error } = useQuery(["profileData"], async () => {
    const response = await axios.get(`/api/profiledata?username=${username}`);
    return response.data;
  });

  return { data, isLoading, error };
};

const PersonalDetails = ({ data, openPersonal, setOpenPersonal }) => {
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
    <div className="mt-10">
      {/* Profile Section */}
      <div className="w-full text-xl font-bold mb-5">Personal Details</div>
      <div className="flex flex-col">
        <div class="w-full bg-white shadow-lg rounded-lg p-4 mx-auto">
          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Full Name:</p>
            <p class="text-md p-2">{data.fullname}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Email:</p>
            <p class="text-md p-2">{data.email}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Phone:</p>
            <p class="text-md p-2">{data.phone}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Location:</p>
            <p class="text-md p-2">{data.location}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Current Job Role:</p>
            <p class="text-md p-2">{data.currentJobRole}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Experience (in years):</p>
            <p class="text-md p-2">{data.experience}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Salary:</p>
            <p class="text-md p-2">{data.salary}</p>
          </div>

          <div class="grid grid-cols-2 items-center">
            <p class="text-md font-bold mr-2">Notice Period:</p>
            <p class="text-md p-2">{data.noticePeriod}</p>
          </div>
        </div>

        <div>
          <Dialog open={openPersonal} onOpenChange={setOpenPersonal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="my-4">
                Edit Profile
              </Button>
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

const WorkDetails = ({ data, openWork, setOpenWork }) => {
  // const router = useRouter();
  const queryClient = useQueryClient();

  const mutationCreate = useMutation(
    (data) => axios.post("/api/profiledata/update/workcreate", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profileData");
      },
    }
  );

  const {
    handleSubmit: handleSubmitWork,
    control: controlWork,
    register: registerWork,
  } = useForm({});

  const onSubmitWorkDetails = (data1) => {
    console.log("data1", data1);
    mutationCreate.mutate(data1);
  };

  useEffect(() => {
    if (mutationCreate.isSuccess) {
      setOpenWork(false);
    }
  }, [mutationCreate.isSuccess]);

  let experiences = data.workExperiences;
  console.log("experiences", experiences);

  const deleteWorkExperience = async (workId) => {
    await axios.post("/api/profiledata/update/workdelete", { workId });
  };

  return (
    <div>
      {/* Work Experience */}
      <div className="text-xl font-bold mt-10 mb-5">Work Experience</div>
      <div className="flex flex-col">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2"
          >
            <div className="mb-2 flex justify-between">
              <p className="font-bold text-xl">{exp.properties.workTitle}</p>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => deleteWorkExperience(exp.properties.workId)}
                >
                  <Trash2 size={16} />
                </Button>
                <Button variant="ghost">
                  <Pencil size={16} />
                </Button>
              </div>
            </div>
            <div className="mb-2">
              <Label>{exp.properties.workCompany}</Label>
            </div>
            <div
              id={`description-${exp.workId}`}
              className="mb-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(exp.properties.workDescription),
              }}
            />
          </div>
        ))}
      </div>
      <div>
        {/* TODO: Add lazy loading maybe by using suspense*/}
        <Dialog open={openWork} onOpenChange={setOpenWork}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Work Experience</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Job Details</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitWork(onSubmitWorkDetails)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workTitle" className="text-right">
                    Job Title
                  </Label>
                  <Input
                    id="workTitle"
                    className="col-span-3"
                    {...registerWork("workTitle")}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="workCompany"
                    className="col-span-3"
                    {...registerWork("workCompany")}
                  />
                </div>

                <div className="w-full flex flex-col">
                  <Label htmlFor="workDescription" className="text-left p-4">
                    Description
                  </Label>
                  <div className="">
                    <Controller
                      name="workDescription"
                      control={controlWork} // make sure you pass your form's control object
                      render={({ field }) => (
                        <QuillWrapper
                          modules={modules}
                          theme="snow"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" isLoading={mutationCreate.isLoading}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const Profile = ({ username }) => {
  const renderCount = useRenderCounter();

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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <PersonalDetails
            data={data}
            openPersonal={openPersonal}
            setOpenPersonal={setOpenPersonal}
          />
          <WorkDetails
            data={data}
            openWork={openWork}
            setOpenWork={setOpenWork}
          />
        </div>
        <div>
          <ResumeUpload />
        </div>
      </div>
    </div>
  );
};

export default Profile;
