"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const cloudfront_url = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
if (!cloudfront_url) {
  console.error(
    "API URL is not defined. Please define NEXT_PUBLIC_CLOUDFRONT_URL in .env"
  );
}

import { useQuery } from "@tanstack/react-query";
// import ResumeUpload from "./ResumeUpload";
import PageLoader from "./PageLoader";
import SocialButtons from "./profile/SocialLinks";

// import Select from "react-select";

const useProfileData = (username) => {
  const { data, isLoading, error } = useQuery(["profileData"], async () => {
    const response = await axios.get(`/api/profiledata?username=${username}`);
    return response.data;
  });

  return { data, isLoading, error };
};

const PersonalDetails = ({ data }) => {
  return (
    <div className="">
      {/* Profile Section */}
      {/* <div className="w-full text-xl font-bold mb-5">Personal Details</div> */}
      <div className="flex flex-col">
        <div className="w-full bg-white shadow-lg rounded-lg px-4 py-2 mx-auto">
          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Full Name</p>
            <p className="text-md">{data.fullname}</p>
          </div>

          {/* <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Email</p>
            <p className="text-md ">{data.email}</p>
          </div> */}

          {/* <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Phone</p>
            <p className="text-md ">{data.phone}</p>
          </div> */}

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
            <p className="text-md ">{data.company}</p>
          </div>

          <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Experience (in years)</p>
            <p className="text-md ">{data.experience}</p>
          </div>

          {/* <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Salary (in LPA)</p>
            <p className="text-md ">{data.salary}</p>
          </div> */}

          {/* <div className="grid grid-cols-2 items-center">
            <p className="text-md font-medium mr-2">Notice Period (in days)</p>
            <p className="text-md ">{data.noticePeriod}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const ProfilePlane = ({ username }) => {
  // https://next-auth.js.org/getting-started/client
  const { data, isLoading, error } = useProfileData(username);

  const [iframeLoaded, setIframeLoaded] = useState(true);

  let resumeUrl = "";

  if (isLoading) {
    return <PageLoader />;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    if (data) {
      resumeUrl = `${cloudfront_url}/${data.userId}.pdf#toolbar=0`;
    }
  }

  // Profile content
  return (
    <div className="w-[95%] h-full mx-auto">
      <p className="font-bold text-2xl text-center my-4 py-2 bg-white shadow-md rounded-md">
        {data.fullname
          ? `${data.fullname} Profile`
          : data.username
          ? `${data.username} Profile`
          : "Profile"}
      </p>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          <PersonalDetails data={data} />
          <SocialButtons data={data} />
        </div>
        {/* <div className="flex flex-col justify-start items-center col-span-2">
          {data.resumeExists == true && (
            <div className="w-full text-center">
              <a
                target="_blank"
                href={resumeUrl}
                className="lg:hidden text-blue-500 underline" // Added classes to make it blue and underlined
              >
                View
              </a>
              <iframe
                className="mt-3"
                src={resumeUrl}
                width="100%"
                height="1200px"
                onError={() => setIframeLoaded(false)}
              />
            </div>
          )}
          {!iframeLoaded && <div>Resume not found.</div>}
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePlane;
