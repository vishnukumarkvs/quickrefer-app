import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";
import ddbClient from "@/lib/ddbclient";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const config = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

const cclient = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

function html(params) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google credentials");
  }

  return { clientId, clientSecret };
};

const authorizeCredentials = async (credentials) => {
  // Use secondary index GSI1 to fetch the user by email
  const params = {
    TableName: "Users",
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :partitionValue AND GSI1SK = :sortValue",
    ExpressionAttributeValues: {
      ":partitionValue": { S: `USER#${credentials.email}` },
      ":sortValue": { S: `USER#${credentials.email}` },
    },
  };

  let userResult;

  try {
    userResult = await ddbClient.send(new QueryCommand(params));
    // console.log("User result:", userResult);
    // Handle the user result accordingly
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }

  const user =
    userResult.Items && userResult.Items[0]
      ? unmarshall(userResult.Items[0])
      : null;

  if (!user) {
    throw new Error("No user found");
  }

  const { password, salt } = user;

  // Note: bcrypt.compare() function should be used to verify hashed password
  const passwordIsValid = await bcrypt.compare(credentials.password, password);

  if (!passwordIsValid) {
    throw new Error("Incorrect password");
  }

  return user;
};

const jwtCallback = async ({ token, user, session, trigger, isNewUser }) => {
  // console.log("JWT callback:", { token, user, session, trigger, isNewUser });
  const params = {
    TableName: "Users",
    Key: {
      pk: { S: `USER#${token.id}` },
      sk: { S: `USER#${token.id}` },
    },
  };

  const dbUserResult = await ddbClient.send(new GetItemCommand(params));

  if (!dbUserResult.Item) {
    if (user) {
      token.id = user.id;
    }

    return token;
  }

  let dbUser = unmarshall(dbUserResult.Item);

  if (!dbUser.name) {
    const email = dbUser.email;
    const atIndex = email.indexOf("@");
    const username = email.substring(0, atIndex);
    const name = username.replace(/\./g, " ");

    dbUser.name = name;

    const putParams = {
      TableName: "Users",
      Item: marshall(dbUser),
    };

    await ddbClient.send(new PutItemCommand(putParams));
  }

  if (!dbUser.jtusername) {
    const uid = nanoid(5);
    const jtusername =
      dbUser.name.replace(/\s+/g, "").toLowerCase() + "#" + uid;
    dbUser.jtusername = jtusername;

    let dbUsernamesResult = {};
    dbUsernamesResult.jtusername = jtusername;
    dbUsernamesResult.id = dbUser.id;

    const putParams = {
      TableName: "Users",
      Item: marshall(dbUser),
    };

    await ddbClient.send(new PutItemCommand(putParams));
  }

  if (trigger === "update") {
    return { ...token, ...session.user };
  }

  return {
    id: dbUser.id,
    name: dbUser.name || user.name, // Use dbUser.name if available, otherwise fallback to user.name
    email: dbUser.email,
    image: dbUser?.image,
  };
};

const sessionCallback = ({ session, token }) => {
  if (token) {
    session.user.id = token.id;
    session.user.name = token?.name;
    session.user.email = token.email;
    session.user.image = token?.image;
  }

  return session;
};

export const authOptions = {
  adapter: DynamoDBAdapter(cclient, {
    tableName: "Users",
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider(getGoogleCredentials()),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "text", placeholder: "test@gmail.com" },
        password: { type: "password", placeholder: "pa$$w0rd" },
      },
      authorize: authorizeCredentials,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider, theme }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, theme }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
    redirect: () => "/",
  },
  pages: {
    newUser: "/profile",
  },
};
