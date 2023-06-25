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
