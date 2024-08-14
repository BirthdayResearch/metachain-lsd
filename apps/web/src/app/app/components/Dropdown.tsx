import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";
import { MdCheckCircle } from "react-icons/md";
import { CgChevronDown } from "react-icons/cg";

export interface DropdownOptionsI {
  label: string;
  value: string;
}

export default function Dropdown<T extends DropdownOptionsI>({
  value,
  label,
  options,
  onChange,
  placeholder,
  labelClass,
  labelClassName,
  dropdownContainerClassName,
}: {
  value: T;
  label?: string;
  options: T[];
  onChange: (val: T) => void;
  placeholder: string;
  labelClass?: string;
  labelClassName?: string;
  dropdownContainerClassName?: string;
}) {
  const isDisabled = options.length === 0;
  return (
    <div>
      {label && (
        <div className={clsx("text-lg mb-2 text-light-700", labelClassName)}>
          {label}
        </div>
      )}
      <Listbox value={value} onChange={onChange} disabled={isDisabled}>
        <div className="relative bg-light-100 rounded-[10px] border-[0.5px] border-light-300 focus-within:border focus-within:border-light-400">
          <Listbox.Button
            className={clsx(
              "relative px-4 py-[18px] w-full cursor-default text-left shadow-md bg-light-100 rounded-[10px]",
              dropdownContainerClassName,
            )}
          >
            {value?.value === "" ? (
              <span className={clsx("text-light-500 text-lg", labelClass)}>
                {placeholder}
              </span>
            ) : (
              <span className={clsx("text-light-700 text-lg", labelClass)}>
                {value?.label}
              </span>
            )}
            <span
              className={clsx(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4",
                {
                  "opacity-30": isDisabled,
                },
              )}
            >
              <CgChevronDown
                size={16}
                className={clsx(
                  "h-4 w-4 text-light-700 stroke-light-500 stroke-[1.5px]",
                  { "text-light-100": value?.value !== "" },
                )}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as="div"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-light-100 py-2 focus:outline-none text-lg z-10 border border-light-400 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className="relative cursor-pointer select-none py-2 p-4"
                  value={option}
                >
                  <div className="flex flex-row justify-between">
                    <span
                      className={clsx(
                        "block truncate text-light-700",
                        labelClass,
                      )}
                    >
                      {option.label}
                    </span>
                    {option.value === value.value ? (
                      <span className="text-green-800">
                        <MdCheckCircle className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
