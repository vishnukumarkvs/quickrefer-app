"use client";
import Image from "next/image";

function ShareButton() {
  const baseMessage =
    "Get instant referrals & elevate Your Career. Unlock Job Opportunities with Personal Referrals. Check out https://quickrefer.in !";

  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(baseMessage)}`;

  const twitterMessage = `${baseMessage} 🔥 #JobSearch #TechJobs`;
  const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    twitterMessage
  )}`;

  return (
    <div className="flex justify-center items-center flex-col">
      <p className="text-center mt-5 mb-3 text-sm italic w-full lg:w-[60%]">
        Help others elevate their careers by sharing our platform – where
        connections become opportunities! 🚀
      </p>
      <div className="flex gap-x-2 flex-wrap">
        <button
          className="mx-auto flex gap-2 items-center border-2 border-[green] rounded-md px-2 py-1 text-sm font-semibold mb-2"
          onClick={() => window.open(whatsappURL, "_blank")}
        >
          <Image src="/whatsapp.png" height={25} width={25} alt="share" /> Share
          on WhatsApp
        </button>

        <button
          className="mx-auto flex gap-2 items-center border-2 border-[green] rounded-md px-2 py-1 text-sm font-semibold mb-2"
          onClick={() => window.open(twitterURL, "_blank")}
        >
          <Image src="/twitter.png" height={25} width={25} alt="share" /> Share
          on Twitter
        </button>
      </div>
    </div>
  );
}

export default ShareButton;
