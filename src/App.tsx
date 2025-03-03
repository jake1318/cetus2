import { useEffect, useState } from "react";
import { useWalletKit } from "@mysten/dapp-kit";
import { ConnectButton } from "./components/ConnectButton";
import { PoolsList } from "./components/PoolsList";
import { useCetusClient } from "./hooks/useCetusClient";
import "./styles/App.scss";

const App = () => {
  const { isInitialized, isLoading } = useCetusClient();
  const { currentAccount } = useWalletKit();
  const [activeTab, setActiveTab] = useState("pools");

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Initializing Cetus SDK...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <h1>Cetus LP</h1>
        </div>
        <div className="wallet-section">
          <ConnectButton />
        </div>
      </header>

      <main className="app-content">
        {!isInitialized ? (
          <div className="error-message">
            <p>Failed to initialize Cetus SDK. Please refresh and try again.</p>
          </div>
        ) : (
          <>
            <div className="tabs">
              <button
                className={activeTab === "pools" ? "active" : ""}
                onClick={() => setActiveTab("pools")}
              >
                Pools
              </button>
              <button
                className={activeTab === "my-positions" ? "active" : ""}
                onClick={() => setActiveTab("my-positions")}
                disabled={!currentAccount}
              >
                My Positions
              </button>
            </div>

            {activeTab === "pools" ? (
              <PoolsList />
            ) : (
              <div className="positions-container">
                <h2>My Positions</h2>
                {!currentAccount ? (
                  <div className="connect-wallet-message">
                    <p>Connect your wallet to view your positions</p>
                  </div>
                ) : (
                  <div className="positions-list-placeholder">
                    <p>No active positions found.</p>
                    <p>Add liquidity to pools to create positions.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Cetus LP. All rights reserved.</p>
        <div className="footer-links">
          <a
            href="https://github.com/your-username/cetus"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://docs.cetus.zone"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
