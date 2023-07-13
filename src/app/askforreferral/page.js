import ReferralSubmit from "@/components/ReferralSubmit";

const Page = () => {
  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <div className="p-4">
        <p className="text-5xl font-bold m-4 text-center">Ask for a Referral</p>
        <p className="w-[70%] text-justify mx-auto my-10">
          If you want to ask referral for a particular job, please submit the
          job link and select the company of the posted job. We have many people
          among the platform who are willing to give referrals. Once a referrer
          desires to give you a referral, he will contact you through our chat
          for furthur details.{" "}
        </p>
        <ReferralSubmit />
      </div>
    </div>
  );
};

export default Page;
