const Policy = () => {
  return (
    <div className="px-4 py-6 text-sm">
      {" "}
      {/* Added 'text-sm' class */}
      <h1 className="text-xl font-bold mb-4">
        Privacy Policy for QuickRefer
      </h1>{" "}
      {/* Adjusted font size to 'text-xl' */}
      <p className="mb-2">Last updated: 2023-09-30</p>
      <p className="mb-4">Welcome to QuickRefer!</p>
      <p className="mb-4">
        This Privacy Policy explains how we collect, use, disclose, and protect
        your personal information when you use our website. By using our
        services, you consent to the practices described in this Privacy Policy.
      </p>
      <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">a. Google OAuth:</h3>{" "}
        {/* Adjusted font size to 'text-md' */}
        <p className="mb-2">
          We use Google OAuth for user authentication and collect the following
          information:
        </p>
        <ul className="list-disc ml-6">
          <li>Name</li>
          <li>Email address</li>
          <li>Profile picture</li>
        </ul>
      </div>
      {/* <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">b. Resumes:</h3>{" "}
        <p className="mb-2">
          We collect resumes that you voluntarily submit for the purpose of
          connecting with other users for referrals.
        </p>
      </div> */}
      <h2 className="text-lg font-semibold mb-2">
        2. How We Use Your Information
      </h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <p className="mb-4">
        We use the information collected for the following purposes:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>User Authentication:</strong> We use Google OAuth information
          to authenticate users and provide access to our services.
        </li>
        <li>
          <strong>Profile Information:</strong> We may display your name and
          profile picture to other users.
        </li>
        {/* <li>
          <strong>Referrals:</strong> We use resume information to connect users
          for referral opportunities.
        </li> */}
        <li>
          <strong>Communication:</strong> We may contact you regarding your
          account, services, or updates.
        </li>
      </ul>
      <h2 className="text-lg font-semibold mb-2">3. Data Security</h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <p className="mb-4">
        We take reasonable measures to protect your personal information from
        unauthorized access, disclosure, alteration, or destruction. However,
        please be aware that no method of transmission over the internet is
        entirely secure.
      </p>
      <h2 className="text-lg font-semibold mb-2">4. Sharing of Information</h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <p className="mb-4">
        We do not sell, trade, or otherwise transfer your personal information
        to third parties unless we obtain your consent or are required to do so
        by law.
      </p>
      <h2 className="text-lg font-semibold mb-2">5. Access and Control</h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <p className="mb-4">
        You have the right to access, correct, or delete your personal
        information at any time. Please contact us at kvsvishnukumar@gmail.com
        for assistance.
      </p>
      <h2 className="text-lg font-semibold mb-2">
        6. Changes to This Privacy Policy
      </h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <p className="mb-4">
        We may update this Privacy Policy from time to time to reflect changes
        to our practices or for other operational, legal, or regulatory reasons.
        Any such updates will be posted on this page.
      </p>
      <h2 className="text-lg font-semibold mb-2">7. Contact Us</h2>{" "}
      {/* Adjusted font size to 'text-lg' */}
      <p className="mb-4">
        If you have any questions, concerns, or feedback regarding this Privacy
        Policy, please contact us at kvsvishnukumar@gmail.com.
      </p>
    </div>
  );
};

export default Policy;
