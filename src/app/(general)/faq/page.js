"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="w-full lg:w-[60%] h-screen m-10 mx-auto justify-center items-center">
      <p className="text-center text-5xl font-bold m-10 mb-[40px]">
        Frequently Asked Questions
      </p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the referral process work on this platform
          </AccordionTrigger>
          <AccordionContent>
            <>
              <ul className="list-disc pl-10">
                <li>
                  Go to <span>Ask Referral</span> Page
                </li>
                <li>
                  Find a Job Url from the internet for which you want Refferal
                </li>
                <li>Fill the job url and select the company</li>
                <li>
                  Find users who are willing to give referrals and send request
                </li>
                <li>Once user accepts, you can engage with them via Chat</li>
              </ul>
            </>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Who can request and give referrals on this platform
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-10">
              <li>
                Anyone who is a User in this platform can Request or Give
                Referrals.
              </li>
              <li>You can Send requests asking for referral to any User</li>
              <li>
                You can only give Referrals to a User for the current company
                you are working in
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Is there a limit to the number of referrals I can request?
          </AccordionTrigger>
          <AccordionContent>No. As of now, there is no limit.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            Is my information kept confidential?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-10">
              <li>
                Your Profile information (which contains basic details and your
                Resume) is only accessible to the Users in this website
              </li>
              <li>
                Chat conversations are Private and can be accessible only by you
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            What should I do if I encounter technical issues?
          </AccordionTrigger>
          <AccordionContent>
            <p>Please contact me. Email id: kvs.vishnukumar@gmail.com</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Is there a fee for using the referral platform?
          </AccordionTrigger>
          <AccordionContent>
            <p>No. Our platform is completely free to use</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>
            Can I edit or delete my referral request?
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-10">
              <li>Once you send a request, you cannot edit or delete</li>
              <li>
                The Referrer(whom you sent) can decide whether to accept your
                referral request or not
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;
