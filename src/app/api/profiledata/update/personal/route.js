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
    company,
  } = await req.json();

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    let query = "MATCH (u:User {userId: $userId})";
    const updateClauses = [];

    if (fullname != "") {
      updateClauses.push("u.fullname = $fullname");
    }
    if (phone != "") {
      updateClauses.push("u.phone = $phone");
    }
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

    if (company) {
      query += `
        OPTIONAL MATCH (u)-[oldWorkRel:WORKS_AT]->()
        DELETE oldWorkRel
        MERGE (c:Company {name: $company})
        MERGE (u)-[:WORKS_AT]->(c)
      `;
    }

    let params = {};

    // Split location into city and country
    if (location) {
      const [city, country = ""] = location.split(", ");
      params.city = city;
      params.country = country;

      // Delete existing relationships and create new ones
      query += `
      WITH u
      OPTIONAL MATCH (u)-[oldCityRel:IN_CITY]->(oldCity:City)-[oldCountryRel:IN_COUNTRY]->(oldCountry:Country)
      DELETE oldCityRel, oldCountryRel
      MERGE (c:City {name: $city})-[:IN_COUNTRY]->(co:Country {name: $country})
      MERGE (u)-[:IN_CITY]->(c)
    `;
    }

    query += "SET " + updateClauses.join(", ");

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
        company: company,
      })
    );

    return new Response(JSON.stringify("Update Successful"), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to update user profile data",
      { status: 500 }
    );
  }
}
