import { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.svg";
import { xrplClient } from "./XrplApiSandbox";
import {
  createConditionalEscrow,
  parseEscrowDataFromMemos,
} from "./bank/manageEscrow";

const ORACLE_WALLET = "rnn6aoehGjuibE1BFXbjFWnzFdeN3EmRix";
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
      async (event: any) => {
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

            const playerEscrow = await createConditionalEscrow(
              POT_AMOUNT,
              playerAddress,
              condition
            );

            setLogs((logState) => [
              playerEscrow,
              "Created new Player Escrow",
              ...logState,
            ]);
          }
        }
        return Promise.resolve(event);
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

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

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
