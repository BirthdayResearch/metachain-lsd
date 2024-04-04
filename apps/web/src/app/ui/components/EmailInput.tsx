import { IoIosCloseCircle } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import clsx from "clsx";
import { CTAButton } from "@/app/ui/components/button/CTAButton";
import { SubscriptionStatus } from "@/app/types/user";
import { useCreateUserMutation } from "@/app/store/marbleFiApi";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

export default function EmailInput({
  value,
  setValue,
  placeholder,
  customStyle,
}: {
  value: string;
  setValue: (text: string) => void;
  placeholder?: string;
  customStyle?: string;
}) {
  const [createUser] = useCreateUserMutation();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const isValidEmail = (email: string) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    status?: SubscriptionStatus,
  ) => {
    e.preventDefault();
    try {
      const user = {
        email: email,
        status: status,
      };
      const data = await createUser(user);
      // @ts-ignore
      if (data?.error) {
        // @ts-ignore
        setErrorMsg(data.error.data.message);
        setSuccess(false);
      } else {
        setErrorMsg("");
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  useEffect(() => {
    setSuccess(false);
    setErrorMsg("");
  }, [value]);
  // @ts-ignore
  return (
    <div>
      <div
        className={clsx(
          "border border-light-1000/10 rounded-[32px] flex relative w-full md:w-[472px]",
          value && !isValidEmail(value) ? "bg-red" : "input-gradient-1",
        )}
      >
        <form
          className={clsx(
            "relative w-full md:w-[472px] py-4 px-7 flex items-center bg-light-00 rounded-[32px]",
            customStyle,
          )}
        >
          <HiOutlineMail className="mr-3" size={20} />
          <input
            className={clsx(
              "mr-6 w-full bg-light-00 caret-brand-100",
              "placeholder:text-light-1000 focus:outline-none",
            )}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex absolute right-4">
            {value !== "" && !success && (
              <button
                type="button"
                className="rounded-full mr-3"
                onClick={() => setValue("")}
              >
                <IoIosCloseCircle
                  size={16}
                  className="opacity-70 text-dark-00"
                />
              </button>
            )}
            {success ? (
              <FaCheck className="text-valid w-5 h-5" />
            ) : (
              <CTAButton
                label="Submit"
                testID="join-community-submit-btn"
                onClick={(e) => handleSubmit(e, value)}
                isDisabled={!isValidEmail(value) || value == ""}
                customStyle="!py-2 !px-5"
                customTextStyle="text-[#B2B2B2] font-semibold text-xs"
              />
            )}
          </div>
        </form>
      </div>
      {errorMsg && (
        <div className="text-left mt-2 ml-2 text-sm text-red">{errorMsg}</div>
      )}
    </div>
  );
}
