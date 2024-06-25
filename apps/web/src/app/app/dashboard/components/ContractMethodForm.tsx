import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { ConnectKitButton } from "connectkit";
import {
  SmartContractInputOutput,
  SmartContractMethod,
  StateMutability,
} from "@/lib/types";
import ContractMethodTextInput from "./ContractMethodTextInput";
import { useContractContext } from "@/context/ContractContext";
import { CTAButton } from "@/components/button/CTAButton";
import { CTAButtonOutline } from "@/components/button/CTAButtonOutline";

interface KeyValue {
  [k: string]: string;
}

export default function ContractMethodForm({
  method,
}: {
  method: SmartContractMethod;
}) {
  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const { MarbleLsdProxy, ExplorerURL } = useContractContext();
  const defaultInputValues = getDefaultValues(method.inputs ?? []);
  const [userInput, setUserInput] = useState<KeyValue>(defaultInputValues);
  const [dfiValue, setDfiValue] = useState("");
  const [writeResult, setWriteResult] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const isPayable = method.stateMutability === StateMutability.Payable; // isPayable -> transaction involves transfer of DFI

  // To handle user input values based on the type of method input
  function convertUserInputs(
    input: KeyValue,
    inputTypes: SmartContractInputOutput[] | [],
  ) {
    return Object.entries(input).map(([, value], i) => {
      const inputType = inputTypes[i].type;

      // Check if inputType matches is an array
      if (inputType.includes("[]")) {
        try {
          const parsedValue = JSON.parse(value);
          if (Array.isArray(parsedValue)) {
            // parse the string into an array
            return parsedValue;
          }
        } catch (e) {
          // Intentionally empty - ignore JSON parsing errors
        }
      }
      if (inputType === "bool") {
        return value === "true";
      }
      return value;
    });
  }

  const handleSubmit = async () => {
    const convertedValue = convertUserInputs(userInput, method.inputs);
    setIsLoading(true);
    const config = {
      address: MarbleLsdProxy.address,
      abi: [method],
      functionName: method.name,
      args: method.inputs?.length > 0 ? convertedValue : [],
      ...(dfiValue && { value: parseEther(dfiValue) }), // to specify the amount of Ether to send with the contract function call, if any
    };

    writeContract(config, {
      onSuccess: (hash) => {
        setError("");
        if (hash) {
          setWriteResult(hash);
        }
      },
      onError: (error) => {
        setError(error.message);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const fieldsWithValue = Object.keys(userInput).filter((i) => userInput[i]);
  const hasCompletedInput = method.inputs?.length === fieldsWithValue.length;

  return (
    <div className="flex flex-col gap-6">
      {isPayable && (
        // `value` is not part of method `inputs`, only display this additional input field when method is payable
        <ContractMethodTextInput
          label="Value"
          value={dfiValue}
          setValue={(value: string) => setDfiValue(value)}
          placeholder={`value (DFI)`}
          type="number"
        />
      )}
      {method?.inputs?.map((input: SmartContractInputOutput, index: number) => (
        <ContractMethodTextInput
          key={`${input.name}-${input.type}`}
          label={`${input.name} (${input.type})`}
          value={userInput[index]}
          setValue={(value: string) =>
            setUserInput({ ...userInput, [index]: value })
          }
          placeholder={`${input.name} (${input.type})`}
          valueType={input.type}
        />
      ))}
      <div className="flex gap-4 flex-row justify-center items-center">
        <ConnectKitButton.Custom>
          {({ show }) => (
            <CTAButton
              testId={`${method.name}-button`}
              label="Write"
              onClick={!isConnected ? show : () => handleSubmit()}
              isDisabled={
                !hasCompletedInput || isLoading || (isPayable && !dfiValue)
              }
            />
          )}
        </ConnectKitButton.Custom>
        {/* Write result is always hash */}
        {writeResult && (
          <CTAButtonOutline
            testId={`${method.name}-result-button`}
            label="View your transaction"
            onClick={() =>
              window.open(`${ExplorerURL}/tx/${writeResult}`, "_blank")
            }
          />
        )}
      </div>
      {error && (
        <div className="text-red italic -mt-4 text-xs break-all">{error}</div>
      )}
    </div>
  );
}

/**
 * Returns object with key-value pair based on the `inputs` length,
 * wherein key is the index from array, initialized with empty string
 *
 * Eg: [{name:"amount", type:"uint256"}, {name:"to", type:"address"}] -> { '0': "", '1': "" }
 * @param inputs SmartContractInputOutput[]
 * @returns
 */
function getDefaultValues(inputs: SmartContractInputOutput[]) {
  const defaultValues = inputs.reduce((acc, _curr, index) => {
    const keyValue = { [index]: "" };
    return { ...acc, ...keyValue };
  }, {} as KeyValue);

  return defaultValues;
}
