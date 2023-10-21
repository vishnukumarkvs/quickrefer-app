import driver from "@/lib/neo4jClient";
import s3Client from "@/lib/s3Client";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

export async function GET(req) {
  const url = new URL(req.url);

  const username = url.searchParams.get("username");

  let resumeExists = true;

  try {
    const neo4jSession = driver.session({
      database: process.env.NEO4J_DATABASE,
    });
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

    let resumeExists = true;
    try {
      const data = await s3Client.send(
        new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: userData[0]?.properties.userId,
        })
      );
      console.log("File exists", data);
    } catch (error) {
      resumeExists = false;
      if (error.name === "NoSuchKey") {
        console.log("File does not exist");
      } else {
        console.error("An error occurred:", error);
      }
    }
    const profidata = {
      fullname: userData[0]?.properties.fullname,
      username: userData[0]?.properties.username,
      userId: userData[0]?.properties.userId,
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
      location: userData[3] + ", " + userData[4],
      skills: userData[2] || [],
      experience: userData[0]?.properties?.experience || 0,
      languages: userData[0]?.properties?.languages || [],
      resume: userData[0]?.properties?.resume || null,
      workExperiences: userData[6] || [],
      linktree: userData[7] || null,
      resumeExists: resumeExists,
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
