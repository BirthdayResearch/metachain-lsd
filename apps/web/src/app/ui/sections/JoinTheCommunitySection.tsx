import { CardDesc } from "@/app/ui/components/CardDesc";
import EmailInput from "@/app/ui/components/EmailInput";
import { useState } from "react";
import SectionContainer from "@/app/ui/components/SectionContainer";

export default function JoinTheCommunitySection() {
  const [emailString, setEmailString] = useState("");
  return (
    <SectionContainer customContainerStyle="flex-col text-center md:text-left items-left px-6 py-10 md:p-10 rounded-xl card-gradient-background">
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-2xl md:text-[28px] md:leading-10 font-semibold">
            Join the growing community
          </div>
          <CardDesc
            customStyle="!text-sm md:!text-xl font-normal w-fit"
            text="Learn more about MarbleFi protocol. Get involved in the community."
            testID="community-desc"
          />
        </div>
        <EmailInput
          customStyle="text-sm"
          value={emailString}
          setValue={setEmailString}
          placeholder="Email address"
        />
        <div className="text-left text-xs font-light text-light-1000/70">
          This email will only receive updates from the platform.
        </div>
      </div>
    </SectionContainer>
  );
}
