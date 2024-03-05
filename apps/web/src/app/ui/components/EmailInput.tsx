import { IoIosCloseCircle } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import clsx from "clsx";

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
  const isValidEmail = (email: string) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  return (
    <div
      className={clsx(
        "border border-light-1000/10 rounded-[32px] flex relative w-full md:w-[472px]",
        value && !isValidEmail(value) ? "bg-red" : "input-gradient-1"
      )}
    >
      <form
        className={clsx(
          "relative w-full md:w-[472px] py-4 px-7 flex items-center bg-light-00 rounded-[32px]",
          customStyle
        )}
      >
        <HiOutlineMail className="mr-3" size={20} />
        <input
          className={clsx(
            "mr-6 w-full bg-light-00 caret-brand-100",
            "placeholder:text-light-1000 focus:outline-none"
          )}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value !== "" && (
          <button
            type="button"
            className="absolute right-7 rounded-full"
            onClick={() => setValue("")}
          >
            <IoIosCloseCircle size={16} className="opacity-70 text-dark-00" />
          </button>
        )}
      </form>
    </div>
  );
}
