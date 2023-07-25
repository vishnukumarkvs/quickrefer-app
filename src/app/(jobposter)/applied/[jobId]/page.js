"use client";

import { useEffect } from "react";

const Page = ({ params }) => {
  // apply checks
  // 1. only hr can access this page
  // 2. only hr who posted that job can access the page

  const getAppliedUsersOfJob = async (jobId) => {
    const response = await fetch(`/api/getappliedusersofjob?jobId=${jobId}`);
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    getAppliedUsersOfJob(params.jobId);
  }, []);

  console.log(params.jobId);
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

export default Page;
