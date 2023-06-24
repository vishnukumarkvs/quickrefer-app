import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

const JobCard = ({ jobData }) => {
  const {
    job: {
      properties: {
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
  } = jobData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{jobTitle}</CardTitle>
        <CardDescription>Base Salary: {baseSalary}</CardDescription>
        <CardDescription>High Salary: {highSalary}</CardDescription>
        <CardDescription>
          Locations: {eligibleLocations.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <CardDescription>Base Experience: {baseExp}</CardDescription>
        <CardDescription>High Experience: {highExp}</CardDescription>
        <CardDescription>Skills: {skills.join(", ")}</CardDescription>
      </CardContent>
      <CardFooter>
        {/* <Link href={`/jobs/${id}`}>
          <a className="ml-auto text-primary">View Details</a>
        </Link> */}
        <Button>Apply</Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
