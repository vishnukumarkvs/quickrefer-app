"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
import { Edit } from "lucide-react";
import { Textarea } from "./ui/textarea";
import AsyncSelect from "react-select/async";
import { Controller, useForm } from "react-hook-form";

const filterColors = (inputValue) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

const defaultLocationOptions = [
  { value: "Bangalore, India", label: "Bangalore, India" },
  { value: "Mumbai, India", label: "Mumbai, India" },
  { value: "Delhi, India", label: "Delhi, India" },
  { value: "Chennai, India", label: "Chennai, India" },
  { value: "Hyderabad, India", label: "Hyderabad, India" },
  { value: "Kolkata, India", label: "Kolkata, India" },
  { value: "Pune, India", label: "Pune, India" },
  { value: "Ahmedabad, India", label: "Ahmedabad, India" },
  { value: "Noida, India", label: "Noida, India" },
  { value: "Gurgaon, India", label: "Gurgaon, India" },
];

const Profile = ({ username }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");
  const [linkFields, setLinkFields] = useState([{ name: "", url: "" }]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({});

  const onSubmitJobDetails = (data) => {
    console.log("Form 2 data:", data);
  };

  const onSubmitLinks = (data) => {
    console.log("Form 3 data:", data);
  };

  const handleAddField = () => {
    setLinkFields((prevFields) => [...prevFields, { name: "", url: "" }]);
  };

  const handleRemoveField = (index) => {
    setLinkFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    setLinkFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index][field] = value;
      return newFields;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/profiledata?username=${username}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-[80%] h-full mx-auto">
      {/* Profile Section */}
      <div className="text-xl font-bold mt-10 mb-5">Personal Details</div>
      <div className="flex">
        <div>
          <p>Full Name: {data.fullname}</p>
          <p>Email: {data.email}</p>
          <p>Phone: {data.phone}</p>
          <p>Address: {data.location}</p>
        </div>
        <div>
          <Dialog>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullname" className="text-right">
                    Full Name
                  </Label>
                  <Input id="fullname" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea
                    placeholder="Type your address here."
                    className="w-[280px] h-[60px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Job Details */}
      <div className="text-xl font-bold mt-10 mb-5">Job Details</div>
      <div className="flex">
        <div>
          <p>Job Title: {data.jobtitle}</p>
          <p>Company: {data.company}</p>
          <p>Location: {data.location}</p>
          <p>Salary: {data.salary}</p>
          <p>Experience: {data.experience}</p>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Edit className="hover:bg-black hover:text-white rounded-md p-1" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Job Details</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitJobDetails)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="jobtitle" className="text-right">
                      Job Title
                    </Label>
                    <Input
                      id="jobtitle"
                      className="col-span-3"
                      defaultValue={data.jobtitle}
                      {...register("jobtitle")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Input
                      id="company"
                      className="col-span-3"
                      defaultValue={data.company}
                      {...register("company")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <div className="w-[280px]">
                      <Controller
                        name="location"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div className="w-full">
                            <AsyncSelect
                              {...field}
                              placeholder="Search..."
                              loadOptions={loadOptions}
                              defaultOptions={defaultLocationOptions}
                              isSearchable
                              required
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" className="text-right">
                      Salary <br /> (in LPA)
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      defaultValue={data.salary}
                      className="col-span-3"
                      required
                      {...register("salary")}
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
                      {...register("experience")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Online Links */}
      <div className="text-xl font-bold mt-10 mb-5">Online Links</div>
      <div className="flex">
        <div>
          {linkFields.length === 0 ? (
            <p className="text-center">No links added yet.</p>
          ) : (
            linkFields.map((link, index) => (
              <div key={index}>
                <p>{link.name}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </div>
            ))
          )}
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Edit className="hover:bg-black hover:text-white rounded-md p-1" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Online Links</DialogTitle>
                <DialogDescription>
                  Add or edit your online links here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitLinks)}>
                <div className="grid gap-4 py-4">
                  {linkFields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <Input
                        id={`linkName-${index}`}
                        className="col-span-2"
                        value={field.name}
                        placeholder="Name of website"
                        onChange={(e) =>
                          handleFieldChange(index, "name", e.target.value)
                        }
                      />
                      <Input
                        id={`linkUrl-${index}`}
                        className="col-span-2"
                        value={field.url}
                        placeholder="URL"
                        onChange={(e) =>
                          handleFieldChange(index, "url", e.target.value)
                        }
                      />
                      {index === linkFields.length - 1 && (
                        <button
                          type="button"
                          className="ml-2 text-gray-600"
                          onClick={handleAddField}
                        >
                          +
                        </button>
                      )}
                      {index !== 0 && (
                        <button
                          type="button"
                          className="ml-2 text-gray-600"
                          onClick={() => handleRemoveField(index)}
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;
