import { CardDesc } from "@/app/ui/components/CardDesc";
import EmailInput from "@/app/ui/components/EmailInput";
import { useState } from "react";

export default function JoinTheCommunitySection() {
  const [emailString, setEmailString] = useState("");
  return (
    <div className="w-full flex flex-col justify-center gap-6 p-10 rounded-[20px] card-gradient-background">
      <div className="flex flex-col gap-3 md:gap-2">
        <div className="text-[28px] leading-[40px] font-semibold">
          Join the growing community
        </div>
        <CardDesc
          text="Learn more about MarbleFi protocol. Get involved in the community."
          testID="community-desc"
        />
      </div>
      <EmailInput
        value={emailString}
        setValue={setEmailString}
        placeholder="Email address"
      />
      <div className="text-light-1000/70">
        This email will only receive updates from the platform.
      </div>
    </div>
  );
}
