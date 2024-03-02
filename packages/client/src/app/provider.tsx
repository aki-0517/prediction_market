"use client";

import { AddressAvatar } from "@/components/AddressAvatar";
import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { RootWallet } from "@rootwallet/rainbowkit-plugin";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { useEffect, useState } from "react";
import { sepolia } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const supportedChains = [sepolia];

export const { chains, publicClient } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "" }), // The RPC URL of the provider set first is used.
  publicProvider(), // this provider is not used.
]);

const connectors = connectorsForWallets([
  {
    groupName: "Email",
    wallets: [
      RootWallet({
        chains,
        options: {
          ewUrl: "https://app.rootwallet.io",
          defaultChainId: sepolia.id,
          logoUrl: process.env.NEXT_PUBLIC_APP_LOGO_URL ?? "",
          apiKey: process.env.NEXT_PUBLIC_ROOT_WALLET_API_KEY ?? "",
        },
      }),
    ],
  },
]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // to prevent a hydration mismatch
  // ref: https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <WagmiConfig config={config}>
        <RainbowKitProvider
          modalSize="compact"
          chains={chains}
          locale="en"
          avatar={AddressAvatar}
          theme={lightTheme({
            accentColor: "#212121",
            accentColorForeground: "white",
            borderRadius: "medium",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    )
  );
};
