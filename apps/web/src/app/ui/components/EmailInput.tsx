import { IoIosClose } from "react-icons/io";
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
  return (
    <form
      className={clsx(
        "relative w-full md:w-[472px] py-4 px-7 flex items-center bg-light-00 rounded-[32px] border border-light-1000/10",
        customStyle,
      )}
    >
      <HiOutlineMail className="mr-3" size={20} />
      <input
        className={clsx(
          "w-full bg-light-00",
          "placeholder:text-light-1000 focus:outline-none",
        )}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value !== "" && (
        <button
          type="button"
          className="absolute right-7 rounded-full bg-dark-00 bg-opacity-10 active:opacity-70 text-dark-00"
          onClick={() => setValue("")}
        >
          <IoIosClose size={20} />
        </button>
      )}
    </form>
  );
}
