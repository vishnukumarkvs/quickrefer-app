import driver from "@/lib/neo4jClient";

export async function GET(req) {
  const url = new URL(req.url);

  const username = url.searchParams.get("username");
  console.log("neo4j username", username);

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    const query = `
        WITH $username AS username
        MATCH (u:User {username: username})
        OPTIONAL MATCH (u)-[:WORKS_AT]->(c:Company)
        OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
        OPTIONAL MATCH (u)-[:IN_CITY]->(ci:City)-[:IN_COUNTRY]->(co:Country)
        OPTIONAL MATCH (u)-[:HAS_CERTIFICATION]->(ce:Certification)
        OPTIONAL MATCH (u)-[:HAS_WORK_EXPERIENCE]->(w:WorkExperience)
        OPTIONAL MATCH (u)-[:HAS_LINKTREE]->(l:LinkTree)
        RETURN u, c, collect(s) AS skills, ci.name, co.name, collect(ce) AS certifications, collect(w) AS workExperiences, l; 
        `;
    const readResult = await neo4jSession.executeRead((tx) =>
      tx.run(query, {
        username: username,
      })
    );
    // console.log("neo4j read result", readResult.records[0]._fields);
    const userData = readResult.records[0]?._fields;
    await neo4jSession.close();
    if (!userData) {
      return new Response("User not found", { status: 404 });
    }
    const profidata = {
      fullname: userData[0]?.properties.fullname,
      username: userData[0]?.properties.username,
      email: userData[0]?.properties.email,
      phone: userData[0]?.properties?.phone || null,
      currentJobRole: userData[0]?.properties?.currentJobRole || null,
      experience: userData[0]?.properties?.experience || null,
      salary: userData[0]?.properties?.salary || null,
      noticePeriod: userData[0]?.properties?.noticePeriod || null,
      jobtitle: userData[0]?.properties.title,
      onlinelinks: userData[0]?.properties?.onlinelinks || [],
      certifications: userData[5] || [],
      company: userData[1]?.properties.name,
      location: userData[3],
      skills: userData[2] || [],
      experience: userData[0]?.properties?.experience || 0,
      languages: userData[0]?.properties?.languages || [],
      resume: userData[0]?.properties?.resume || null,
      workExperiences: userData[6] || [],
      linktree: userData[7] || null,
    };

    return new Response(JSON.stringify(profidata), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to fetch user profile data",
      { status: 500 }
    );
  }
}
