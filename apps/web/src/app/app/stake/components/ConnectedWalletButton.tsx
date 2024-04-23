import React, { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import { Switch } from "@headlessui/react";

export default function ConnectedWalletButton({
  customStyle,
  enabled,
  setEnabled,
}: {
  customStyle: string;
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={clsx("flex-row items-center gap-x-2", customStyle)}>
      <span className="text-xs text-light-1000/50">Use connected wallet</span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-valid-object" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}
