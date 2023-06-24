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
    company,
  } = jobData;

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
        <Button>Apply</Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
