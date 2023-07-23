"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const res = await axios.get("/api/getpostedjobs");
      setJobs(res.data.records);
      console.log(res.data.records);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    const res = await axios.delete("/api/deletejob");
    console.log(res);
  };

  return (
    <div className="w-full m-5">
      <h1 className="text-primary mb-3">My Posted Jobs</h1>
      <div className="flex flex-wrap gap-x-2">
        {jobs.map((job) => (
          <div
            key={job._fields[0].properties.jobId}
            className="card mb-3 p-4 border rounded-lg shadow-md w-80"
          >
            <h5 className="text-lg font-semibold">
              {job._fields[0].properties.jobTitle}
            </h5>
            <div className="mt-2">
              <h5 className="text-sm text-gray-600">
                {job._fields[0].properties.jobType}
              </h5>
              <p className="text-gray-800 mt-1">
                {job._fields[0].properties.description}
              </p>

              {/* Bottom right buttons */}
              <div className="flex justify-end mt-4 space-x-2">
                <Button className="bg-blue-500">Edit Job</Button>
                <Button className="bg-green-500">View Applied</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
