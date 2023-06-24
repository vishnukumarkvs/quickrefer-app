import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const JobCard = ({ job }) => {
  const { id, title, description, company, location, type } = job;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{company}</CardDescription>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <CardDescription>{type}</CardDescription>
        <Link href={`/jobs/${id}`}>
          <a className="ml-auto text-primary">View Details</a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
