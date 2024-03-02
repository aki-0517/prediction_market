import {
  ConnectButton as RainbowkitConnectButton,
  WalletButton,
} from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { parseEther, parseAbi } from "viem";
import { useAccount, useSendTransaction, useContractWrite } from "wagmi";

// wagmiの使い方を簡単に紹介するためのmock
export const WalletActionsMock = () => {
  const { isConnected } = useAccount();
  return (
    <div className="flex flex-col items-center gap-4">
      {isConnected ? (
        <div className="flex flex-col items-center gap-4">
          <RainbowkitConnectButton
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
          <SendEthToVitalikButton />
          <ExecuteContractButton />
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
};

const ConnectButton = () => {
  return (
    <WalletButton.Custom wallet="rootwallet">
      {({ ready, connect }) => {
        return (
          <button
            type="button"
            disabled={!ready}
            onClick={connect}
            className="border-2 rounded-lg p-2 font-semibold"
          >
            Login with Email
          </button>
        );
      }}
    </WalletButton.Custom>
  );
};

const SendEthToVitalikButton = () => {
  // vitalikに0ETHを送金する実装の例
  const {
    data: result,
    isLoading,
    isSuccess,
    isError,
    error,
    sendTransaction,
  } = useSendTransaction({
    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // vitalik.eth
    value: parseEther("0"),
    data: "0x",
  });

  useEffect(() => {
    if (isError) {
      console.error("error: ", error);
    }

    if (isSuccess) {
      console.log("hash: ", result?.hash);
    }
  }, [result, error, isSuccess, isError]);

  return (
    <button
      type="button"
      onClick={() => sendTransaction()}
      className="border-2 rounded-lg p-2 font-semibold"
    >
      {isLoading ? "Now Sending..." : "Send to Vitalik"}
    </button>
  );
};

const ExecuteContractButton = () => {
  // Smaple NFTコントラクトのmint関数を実行する実装の例
  const contractABI = parseAbi(["function mint(address _to) public"]);
  const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  const {
    data: result,
    error,
    isError,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite({
    address: "0x1771070d7Cc9669a7cC9a058f6e8434ABA9c276F",
    abi: contractABI,
    functionName: "mint",
    args: [to],
  });

  useEffect(() => {
    if (isError) {
      console.error("error: ", error);
    }

    if (isSuccess) {
      console.log("hash: ", result?.hash);
    }
  }, [result, error, isSuccess, isError]);

  return (
    <button
      type="button"
      onClick={() => write()}
      className="border-2 rounded-lg p-2 font-semibold"
    >
      {isLoading ? "Now Executing..." : "Execute Contract"}
    </button>
  );
};
