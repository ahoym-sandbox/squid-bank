import { useEffect, useState } from "react";
import "./App.css";
import {
  createConditionalEscrow,
  parseEscrowDataFromMemos,
} from "./bank/manageEscrow";
import { Circle } from "./shapes/Circle";
import { Triangle } from "./shapes/Triangle";
import { xrplClient } from "./XrplApiSandbox";

const ORACLE_WALLET = "rgbv6kNj77J9DTjZM39Q5xi1pzufv13g1";
const POT_AMOUNT = 100;

// Can import and run TS scripts this way if so desired
// import './XrplApiSandbox/scripts/sendXrp';
// import './XrplApiSandbox/scripts/sendEscrow';

// Generate testnet wallet
const generateBankWalletRequest = xrplClient.generateFaucetWallet();

function App() {
  const [logs, setLogs] = useState<unknown[]>([]);

  useEffect(() => {
    generateBankWalletRequest.then((result) => {
      setLogs((logState) => [
        result,
        "Created faucet wallet for Bank",
        ...logState,
      ]);
    });
  }, []);

  useEffect(() => {
    xrplClient.subscribeToAccountTransactions(
      {
        accounts: [ORACLE_WALLET],
      },
      (event: any) => {
        console.log(event);
        if ("AccountSet" === event["transaction"].TransactionType) {
          const memos = event["transaction"].Memos;
          const { playerAddress, condition } = parseEscrowDataFromMemos(memos);

          if (playerAddress && condition) {
            setLogs((logState) => [
              {
                playerAddress,
                condition,
              },
              "Received new Escrow condition",
              ...logState,
            ]);

            createConditionalEscrow(POT_AMOUNT, playerAddress, condition)
              .then((playerEscrow) => {
                setLogs((logState) => [
                  playerEscrow,
                  "Created new Player Escrow",
                  ...logState,
                ]);
              })
              .catch((err) => console.log(err));
          }
        }
        return Promise.resolve(event);
      }
    );
  }, []);

  return (
    <div className="App">
      <div className="Squid">
        <Circle />
        <Triangle />
        <img
          src={process.env.PUBLIC_URL + "/piggy_bank.jpg"}
          className="App-logo Square"
          alt="logo"
        />
      </div>

      <div className="App-logs">
        {logs.map((log) => {
          if (typeof log === "string") {
            return (
              <p key={Math.random()} className="App-console-log">
                {log}
              </p>
            );
          } else if (typeof log === "object") {
            return (
              <div key={Math.random()}>
                <pre>{JSON.stringify(log, null, 2)}</pre>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default App;
