import Homepage from "@/components/Homepage";
import ReferralSubmit from "@/components/ReferralSubmit";

const Page = () => {
  return (
    <div className="w-[90%] my-[20px] mx-auto">
      <div className=" flex flex-col items-center justify-center">
        <h1>Home Page</h1>
        <Homepage />
        <ReferralSubmit />
      </div>
    </div>
  );
};

export default Page;
