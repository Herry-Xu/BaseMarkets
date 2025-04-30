import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { baseSepolia, alchemy } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [
        {
          type: "email"
        }
      ],
      [
        {
          type: "external_wallets",
          walletConnect: {
            projectId: "bb5a943c17c2dab3952f898e64317b9c"
          }
        }
      ]
    ],
    addPasskeyOnSignup: false,
    header: "Welcome to Harwood",
    hideSignInText: false,
  }
};

export const config = createConfig({
  transport: alchemy({ apiKey: "c71_FFb7mMJvavgbFSAm60W0u8Tnq-jJ" }),
  chain: baseSepolia,
  ssr: true,
  enablePopupOauth: true,
}, uiConfig);

export const queryClient = new QueryClient();