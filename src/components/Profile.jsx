"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import * as DOMPurify from "dompurify";

const cloudfront_url = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
if (!cloudfront_url) {
  console.error(
    "API URL is not defined. Please define NEXT_PUBLIC_CLOUDFRONT_URL in .env"
  );
}

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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, Pencil, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { set } from "date-fns";
import { QuillWrapper, modules } from "./ui/QuillWrapper";
// import  AsyncLocationSelect  from "./ui/AsyncLocationSelect";
const AsyncLocationSelect = dynamic(() => import("./ui/AsyncLocationSelect"), {
  ssr: false,
});
import { useRouter } from "next/navigation";
import ResumeUpload from "./ResumeUpload";
import { useSession } from "next-auth/react";
import PageLoader from "./PageLoader";
import { Flex, Heading, Text } from "@chakra-ui/react";
import SocialButtons from "./profile/SocialLinks";
import AutoCompleteCompanyName from "./autocomplete/CompanyNameFromList";
import { BeatLoader } from "react-spinners";

// import Select from "react-select";

const useProfileData = (username) => {
  const { data, isLoading, error } = useQuery(["profileData"], async () => {
    const response = await axios.get(`/api/profiledata?username=${username}`);
    return response.data;
  });

  return { data, isLoading, error };
};

const PersonalDetails = ({ data, openPersonal, setOpenPersonal }) => {
  const [openLinkTree, setOpenLinkTree] = useState(false);
  const queryClient = useQueryClient();
  const mutationPersonal = useMutation(
    (data) => axios.post("/api/profiledata/update/personal", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profileData");
        setOpenPersonal(false);
      },
    }
  );
  const {
    handleSubmit: handleSubmitPersonal,
    control: controlPersonal,
    register: registerPersonal,
    setValue: setValuePersonal,
  } = useForm({
    defaultValues: {
      fullname: data.fullname,
      phone: data.phone,
      location: data.location,
      currentJobRole: data.currentJobRole,
      experience: data.experience,
      salary: data.salary,
      noticePeriod: data.noticePeriod,
      company: data.company,
    },
  });

  const onSubmit = (data0) => {
    const locationValue = data0.location ? data0.location.value : null;
    const updatedData = { ...data0, location: locationValue };
    mutationPersonal.mutate(updatedData);
  };

  return (
    <div className="">
      {/* Profile Section */}
      {/* <div className="w-full text-xl font-bold mb-5">Personal Details</div> */}
      <div className="flex flex-col gap-5">
        <Flex gap="2" justifyContent={"flex-end"}>
          <div>
            <Dialog open={openPersonal} onOpenChange={setOpenPersonal}>
              <DialogTrigger asChild>
                <Button size="sm">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you{"'"}
                    re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitPersonal(onSubmit)}>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        className="col-span-3"
                        {...registerPersonal("fullname")}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        className="col-span-3"
                        {...registerPersonal("phone")}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="currentJobRole">Current Job Role</Label>
                      <Input
                        id="currentJobRole"
                        className="col-span-3"
                        {...registerPersonal("currentJobRole")}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="company">Current Company</Label>
                      <AutoCompleteCompanyName
                        onSelect={(val) => {
                          setValuePersonal("company", val);
                        }}
                        defaultvalue={data.company}
                      />
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" >
                      Salary <br /> (in LPA)
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      className="col-span-3"
                      {...registerPersonal("salary")}
                    /> 
                  </div> */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="experience">Experience (in yrs)</Label>
                      <Input
                        id="experience"
                        type="number"
                        defaultValue={data.experience}
                        className="col-span-3"
                        required
                        {...registerPersonal("experience")}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="w-[280px]">
                        <AsyncLocationSelect
                          control={controlPersonal}
                          name="location"
                          defaultSelectedLocation={data.location}
                        />
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noticePeriod" >
                      Notice Period <br />
                      (in days)
                    </Label>
                    <Input
                      id="noticePeriod"
                      type="number"
                      className="col-span-3"
                      {...registerPersonal("noticePeriod")}
                    />
                  </div> */}
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      isLoading={mutationPersonal.isLoading}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <LinkTree
            data={data}
            openLinkTree={openLinkTree}
            setOpenLinkTree={setOpenLinkTree}
          />
        </Flex>
        <div className="w-full bg-white shadow-lg rounded-lg px-4 py-2 mx-auto">
          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Full Name</p>
            <p className="text-md">{data.fullname}</p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Email</p>
            <p className="text-md ">{data.email}</p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Phone</p>
            <p className="text-md ">{data.phone}</p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Location</p>
            <p className="text-md ">
              {data.location.includes("null") ? "" : data.location}
            </p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Current Job Role</p>
            <p className="text-md">{data.currentJobRole}</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Current Company</p>
            <p className="text-md">{data.company}</p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Experience</p>
            <p className="text-md ">
              {data.experience} <span className="pl-1">yrs</span>
            </p>
          </div>

          {/* <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Salary (in LPA)</p>
            <p className="text-md ">{data.salary}</p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Notice Period (in days)</p>
            <p className="text-md ">{data.noticePeriod}</p>
          </div> */}
        </div>

        <SocialButtons data={data} />
      </div>
    </div>
  );
};

const WorkDetails = ({ data, openWork, setOpenWork }) => {
  const [editingExperience, setEditingExperience] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingWorkId, setDeletingWorkId] = useState(null); // This will keep track of which item is being deleted

  const queryClient = useQueryClient();

  const mutationCreate = useMutation(
    (data) => axios.post("/api/profiledata/update/workcreate", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profileData");
        setOpenWork(false);
        setLoading(false);
      },
    }
  );

  const mutationEdit = useMutation(
    (data) => axios.post("/api/profiledata/update/workupdate", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profileData");
        setOpenWork(false);
        setEditingExperience(null);
        setLoading(false);
      },
    }
  );

  const mutationDelete = useMutation(
    (workId) => axios.post("/api/profiledata/update/workdelete", { workId }),
    {
      onMutate: (workId) => {
        setDeletingWorkId(workId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries("profileData");
        setDeletingWorkId(null);
      },
      onError: () => {
        setDeletingWorkId(null);
      },
    }
  );

  const {
    handleSubmit: handleSubmitWork,
    control: controlWork,
    register: registerWork,
    reset: resetWork,
  } = useForm({});

  const onSubmitWorkDetails = (data1) => {
    setLoading(true);
    if (editingExperience) {
      mutationEdit.mutate({
        ...data1,
        workId: editingExperience.properties.workId,
      });
    } else {
      mutationCreate.mutate(data1);
    }
  };

  let experiences = data.workExperiences;

  const deleteWorkExperience = (workId) => {
    mutationDelete.mutate(workId);
  };

  const editWorkExperience = (exp) => {
    setOpenWork(true);
    setEditingExperience(exp);
    resetWork({
      workTitle: exp.properties.workTitle,
      workCompany: exp.properties.workCompany,
      workDescription: exp.properties.workDescription,
    });
  };

  return (
    <div>
      {/* Work Experience */}
      <div className="flex flex-col bg-white shadow-md rounded divide-y-2">
        {experiences.map((exp, index) => (
          <div key={index} className="p-3 flex flex-col my-2">
            <div className="mb-2 flex justify-between">
              <p className="font-bold text-xl">{exp.properties.workTitle}</p>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => deleteWorkExperience(exp.properties.workId)}
                  isLoading={deletingWorkId === exp.properties.workId}
                >
                  <Trash2 size={16} />
                </Button>
                <Button variant="ghost" onClick={() => editWorkExperience(exp)}>
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
                Make changes to your profile here. Click save when you{"'"}re
                done.
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
                    required
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
                    required
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
                      control={controlWork}
                      rules={{ required: true }}
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
                <Button type="submit" isLoading={loading}>
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

const LinkTree = ({ data, openLinkTree, setOpenLinkTree }) => {
  const queryClient = useQueryClient();
  const mutationLinkTree = useMutation(
    (data) => axios.post("/api/profiledata/update/linktree", data),
    {
      onSuccess: () => {
        // TODO: Invalidate or refetch?
        queryClient.refetchQueries("profileData");
        setOpenLinkTree(false);
      },
    }
  );
  const { handleSubmit: handleSubmitLinkTree, register: registerLinkTree } =
    useForm({});

  let links = Object.entries(data.linktree?.properties || {});

  const onSubmit = (data0) => {
    mutationLinkTree.mutate(data0);
  };

  return (
    <div>
      <Dialog open={openLinkTree} onOpenChange={setOpenLinkTree}>
        <DialogTrigger asChild>
          <Button size="sm">Add or Edit Links</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add links</DialogTitle>
            <DialogDescription>
              Fill the links that you have, leave the rest empty.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitLinkTree(onSubmit)}>
            <div className="">
              <div className="grid grid-cols-4 items-center gap-4 my-2">
                <Label htmlFor="linkedin" className="text-right">
                  Linkedin
                </Label>
                <Input
                  id="linkedin"
                  className="col-span-3"
                  defaultValue={data.linktree?.properties?.linkedin || ""}
                  {...registerLinkTree("linkedin")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 my-2">
                <Label htmlFor="github" className="text-right">
                  Github
                </Label>
                <Input
                  id="github"
                  className="col-span-3"
                  defaultValue={data.linktree?.properties?.github || ""}
                  {...registerLinkTree("github")}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 my-2">
              <Label htmlFor="blog" className="text-right">
                Blog
              </Label>
              <Input
                id="blog"
                className="col-span-3"
                defaultValue={data.linktree?.properties?.blog || ""}
                {...registerLinkTree("blog")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 my-2">
              <Label htmlFor="portfolio" className="text-right">
                Portfolio
              </Label>
              <Input
                id="portfolio"
                className="col-span-3"
                defaultValue={data.linktree?.properties?.portfolio || ""}
                {...registerLinkTree("portfolio")}
              />
            </div>
            <DialogFooter>
              <Button type="submit" isLoading={mutationLinkTree.isLoading}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Profile = ({ username }) => {
  // https://next-auth.js.org/getting-started/client
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useProfileData(username);

  const [openPersonal, setOpenPersonal] = useState(false);
  const [openWork, setOpenWork] = useState(false);
  const [openWorkUpdate, setOpenWorkUpdate] = useState(false);
  const [openLinkTree, setOpenLinkTree] = useState(false);

  if (status === "loading") {
    return <PageLoader />;
  }
  let resumeUrl = `${cloudfront_url}/${session.user.id}.pdf`;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <BeatLoader color="#ffc800e5" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // console.log(session, "session profile");

  return (
    <div className="w-full lg:w-[95%] h-full mx-auto">
      <p className="font-bold text-2xl text-center my-4 py-2 bg-white shadow-md rounded-md">
        My Profile
      </p>
      {/* <div className="grid grid-cols-2 gap-4"> */}
      <div className="flex flex-col gap-4">
        <PersonalDetails
          data={data}
          openPersonal={openPersonal}
          setOpenPersonal={setOpenPersonal}
        />
        <div className="flex flex-col justify-start items-center">
          <ResumeUpload />
          {session.user.isResume ? (
            <div>
              {/* Show the "View" link only on smaller screens */}
              <a
                target="_blank"
                href={resumeUrl}
                className="lg:hidden text-blue-500 underline" // Added classes to make it blue and underlined
              >
                View
              </a>

              {/* Show the iframe only on screens larger than "lg" */}
              <iframe
                className="hidden lg:block mt-3" // This shows the iframe on screens larger than "lg" and hides on smaller ones
                src={resumeUrl}
                width="100%"
                height="1290px"
              >
                Sorry, your browser doesnt support embedded PDFs. Please{" "}
                <a target="_blank" href={resumeUrl}>
                  download the PDF
                </a>{" "}
                to view it.
              </iframe>
            </div>
          ) : (
            <p className="my-2">Upload your resume to view it here!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
