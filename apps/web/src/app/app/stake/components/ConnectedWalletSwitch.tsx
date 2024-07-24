import React, { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function ConnectedWalletSwitch({
  customStyle,
  enableConnectedWallet,
  setEnableConnectedWallet,
}: {
  customStyle?: string;
  enableConnectedWallet: boolean;
  setEnableConnectedWallet: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={clsx("flex items-center gap-x-2", customStyle)}>
      <span className="text-xs text-light-1000/50">Use connected wallet</span>
      <ToggleSwitch
        setOn={setEnableConnectedWallet}
        isOn={enableConnectedWallet}
      />
    </div>
  );
}
