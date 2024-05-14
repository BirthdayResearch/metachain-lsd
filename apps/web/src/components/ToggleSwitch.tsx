import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface SwitchProps {
  setOn: (newState: boolean) => void;
  isOn: boolean;
}

export default function ToggleSwitch({ setOn, isOn }: SwitchProps) {
  return (
    <Switch
      checked={isOn}
      onChange={setOn}
      className={clsx(
        "relative inline-flex items-center h-[20px] w-[36px] shrink-0 cursor-pointer rounded-[20px] border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
        isOn ? "bg-valid" : "bg-dark-00/10",
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "bg-light-00 pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          isOn ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </Switch>
  );
}
