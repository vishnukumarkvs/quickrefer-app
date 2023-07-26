import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const {
    fullname,
    phone,
    location,
    currentJobRole,
    experience,
    salary,
    noticePeriod,
  } = await req.json();

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    let query = "MATCH (u:User {userId: $userId}) SET ";
    const updateClauses = [];

    if (fullname != "") {
      updateClauses.push("u.fullname = $fullname");
    }

    if (phone != "") {
      updateClauses.push("u.phone = $phone");
    }

    let params = {};

    // Split location into city and country
    if (location !== null && location !== "") {
      const locationSplit = location.split(", ");
      let city = locationSplit[0];
      let country = locationSplit.length > 1 ? locationSplit[1] : "";

      // Add city and country to the parameter object
      params.city = city;
      params.country = country;
    }

    // Build the full query string
    let queryString = `
      MATCH (u)
      OPTIONAL MATCH (u)-[oldCityRel:IN_CITY]->(:City)-[oldCountryRel:IN_COUNTRY]->(:Country)
      DELETE oldCityRel, oldCountryRel
      WITH u
      MERGE (c:City {name: $city})-[:IN_COUNTRY]->(co:Country {name: $country})
      MERGE (u)-[:IN_CITY]->(c)
      `;

    console.log(queryString, params);

    if (currentJobRole != "") {
      updateClauses.push("u.currentJobRole = $currentJobRole");
    }
    if (experience != null) {
      updateClauses.push("u.experience = $experience");
    }
    if (salary != null) {
      updateClauses.push("u.salary = $salary");
    }
    if (noticePeriod != null) {
      updateClauses.push("u.noticePeriod = $noticePeriod");
    }

    query += updateClauses.join(", ");

    console.log("query", query);

    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        userId: usession.user.id,
        fullname: fullname,
        phone: phone,
        city: params.city, // city from split location
        country: params.country, // country from split location
        currentJobRole: currentJobRole,
        experience: experience,
        salary: salary,
        noticePeriod: noticePeriod,
      })
    );

    console.log("writeResult", writeResult);

    return new Response(JSON.stringify("Update Successful"), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to update user profile data",
      { status: 500 }
    );
  }
}
