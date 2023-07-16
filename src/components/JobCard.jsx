"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const JobCard = ({ jobData }) => {
  const {
    job: {
      properties: {
        jobId,
        jobTitle,
        description,
        highSalary,
        baseSalary,
        baseExp,
        highExp,
      },
      identity: { low: id },
    },
    eligibleLocations,
    skills,
    company,
  } = jobData;

  const applyToJob = () => {
    return axios
      .post("/api/applyjob", { jobId: jobId })
      .then((res) => res.data);
  };

  const mutation = useMutation(applyToJob, {
    onSuccess: () => {
      console.log("Applied to job");
    },
    onError: (error) => {
      toast.error(`Application failed: ${error.message}`);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{jobTitle}</CardTitle>
        <CardDescription>Company: {company}</CardDescription>
        <CardDescription>
          Est Salary: {baseSalary} - {highSalary} LPA
        </CardDescription>
        <CardDescription>
          Locations: {eligibleLocations.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <CardDescription>
          Exp: {baseExp} - {highExp} years
        </CardDescription>
        <CardDescription>Skills: {skills.join(", ")}</CardDescription>
      </CardContent>
      <CardFooter>
        {/* <Link href={`/jobs/${id}`}>
          <a className="ml-auto text-primary">View Details</a>
        </Link> */}
        <Button
          onClick={handleClick}
          disabled={mutation.isLoading || mutation.isSuccess}
        >
          {mutation.isLoading
            ? "Applying..."
            : mutation.isSuccess
            ? "Applied"
            : "Apply"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
