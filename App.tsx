import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import "./App.css";
//import RPC from "./web3RPC"; // for using web3.js
//import RPC from "./ethersRPC"; // for using ethers.js
import RPC from "./algorandRPC";


// Plugins
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

const clientId = "BCFn9wdARPPPXP7RIKfKamJ99no2C1e-ekpdn31cuaa2a2xyWMvk5t9Ritvx1YhiMxNccRca7YprS46yEAMo-vU"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {

        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: "Algorand", //
          rpcTarget: "https://testnet-api.algonode.cloud",

          displayName: "Algorand Mainnet",

          ticker: "ALGO",
          tickerName: "Algorand",

        };

        const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3Auth({
          clientId,
          // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan
          uiConfig: {
            appName: "W3A Heroes",
            mode: "light",
            // loginMethodsOrder: ["apple", "google", "twitter"],
            logoLight: "https://web3auth.io/images/web3authlog.png",
            logoDark: "https://web3auth.io/images/web3authlogodark.png",
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
            loginMethodsOrder: ["google", "github", "twitter", "farcaster", "discord", "twitch", "facebook",],
          },
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          loginSettings: {
            mfaLevel: "optional",
          },
          adapterSettings: {
            whiteLabel: {
              appName: "W3A Heroes",
              logoLight: "https://web3auth.io/images/web3authlog.png",
              logoDark: "https://web3auth.io/images/web3authlogodark.png",
              defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
              mode: "dark", // whether to enable dark mode. defaultValue: false
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: true,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: true,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: true,
              },
            },
            loginConfig: {
              facebook: {
                verifier: "w3a-facebook-demo",
                typeOfLogin: "facebook",
                clientId: "215892741216994", //use your app client id you got from facebook
              },
              discord: {
                verifier: "w3a-discord-demo",
                typeOfLogin: "discord",
                clientId: "1151006428610433095", //use your app client id you got from discord
              },
              twitch: {
                verifier: "w3a-twitch-demo",
                typeOfLogin: "twitch",
                clientId: "3k7e70gowvxjaxg71hjnc8h8ih3bpf", //use your app client id you got from twitch
              },
              twitter: {
                verifier: "w3a-auth0-demo",
                typeOfLogin: "twitter",
                clientId: "hUVVf4SEsZT7syOiL0gLU9hFEtm2gQ6O", //use your app client id from Auth0, since twitter login is not supported directly
                jwtParameters: {
                  domain: "https://web3auth.au.auth0.com",
                  verifierIdField: "sub",
                  isVerifierIdCaseSensitive: true,
                }
              },
              google: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-google",
                typeOfLogin: "google",
                clientId: "519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com",
              },
              github: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-github",
                typeOfLogin: "github",
                clientId: "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
                jwtParameters: {
                  domain: "https://web3auth.au.auth0.com",
                  verifierIdField: "email",
                  isVerifierIdCaseSensitive: false,
                  connection: "github",
                }
              },
            },
          },
        });
        web3auth.configureAdapter(authAdapter);

        // plugins and adapters are optional and can be added as per your requirement
        // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

        // adding torus wallet connector plugin

        // Wallet Services Plugin
        // const walletServicesPlugin = new WalletServicesPlugin({
        //   wsEmbedOpts: {},
        //   walletInitOptions: { whiteLabel: { showWidgetButton: true } },
        // });

        // setWalletServicesPlugin(walletServicesPlugin);
        // web3auth.addPlugin(walletServicesPlugin);

        setWeb3auth(web3auth);

        // await web3auth.initModal();

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.AUTH]: {
              label: "Auth Adapter",
              loginMethods: {
                // Disable the following login methods
                apple: {
                  name: "apple",
                  showOnModal: false,
                },
                reddit: {
                  name: "reddit",
                  showOnModal: false,
                },
                line: {
                  name: "line",
                  showOnModal: false,
                },
                wechat: {
                  name: "wechat",
                  showOnModal: false,
                },
                kakao: {
                  name: "kakao",
                  showOnModal: false,
                },
                linkedin: {
                  name: "linkedin",
                  showOnModal: false,
                },
                weibo: {
                  name: "weibo",
                  showOnModal: false,
                },
                // Disable email_passwordless and sms_passwordless
                email_passwordless: {
                  name: "email_passwordless",
                  showOnModal: false,
                },
                sms_passwordless: {
                  name: "sms_passwordless",
                  showOnModal: true,
                },
              },
            },
          },
        });
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const onGetAlgorandKeypair = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const algorandKeypair = await rpc.getAlgorandKeyPair();
    uiConsole("Keypair", algorandKeypair);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole("Address", userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(
      "Balance",
      balance,
      "You can get testnet funds from https://bank.testnet.algorand.network/"
    );
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole("Hash", result);
  };

  const signAndSendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole("Transaction ID: ", result);
  };

  const signAndSendOptinTxn = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signAndSendOptinTxn();
    uiConsole("Transaction ID: ", result);
  }

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={onGetAlgorandKeypair} className="card">
            Get Algorand Keypair
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signAndSendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={signAndSendOptinTxn} className="card">
            Send OptIn Transaction
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & Modal Custom Authentication Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/custom-authentication-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fcustom-authentication-modal-example&project-name=w3a-custom-auth-modal&repository-name=w3a-custom-auth-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
