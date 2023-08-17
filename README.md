"Dynamodb auth"

https://react-select.com/home

use this select

import "./styles.css";
import React from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

const options = [
{ value: 'chocolate', label: 'Chocolate' },
{ value: 'strawberry', label: 'Strawberry' },
{ value: 'vanilla', label: 'Vanilla' }
]

export default function App() {
return (

<div className="App">
<h1>Hello CodeSandbox</h1>
<h2>Start editing to see some magic happen!</h2>
<CreatableSelect isMulti options={options} />
</div>
);
}

can also get options from async, remote etc

https://neo4j.com/docs/cypher-cheat-sheet/5/auradb-enterprise/

need to implement tanstack and backend neo4j api

npm i json-server --save-dev
npx json-server -p 8000 -w db.json -> Start json server

npm i @tanstack/react-query
npm i @tanstack/react-query-devtools --save-dev

ft: need to add job company name and hr id
add loading state to post button

Query used for fetching data, mutation used for post or updating data in server

merged tanstack, job company, hr id, some query unit and experience changes needs to be done

doing add role

done above

lets work on homepage now
https://serpapi.com/google-jobs-api - google jobs api
https://serpapi.com/pricing

const encodedString = encodeURIcomponent("hello+world");
const decodedString = decodeURIComponent(encodedString);
console.log(decodedString); // "hello world"

Lets work on referral submit. small feature
needs link company, add referrer in new user option

```
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client(config);
const params = {
  Bucket: "examplebucket",
  Key: "exampleobject",
  Expires: 315360000 // 10 years
};
const url = await getSignedUrl(client, "getObject", params);

```

// Name:
// Email:
// Phone Number:
// Job Title:
// Company:
// Location:
// Experience:
// Key Skills:
// Additional Skills:
// Online Links:
// Certifications:
// Projects:
// Languages:
// Resume:

// scrollbar
// https://youtu.be/RaeXdPsSvfM

applied, viewed , shortlisted, result

// Job status
Live
Closed
On Hold
Expired
Withdrawn
Reopen

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue defaultValue={job.status} placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Withdrwan">Withdrwan</SelectItem>
                    <SelectItem value="Reopen">Reopen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

Name
Email
Top 5 Skills
Experiennce
Linkedin
JT profile

Shortlist

chat not refresh. need to use A maybe
