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
