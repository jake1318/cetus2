import { useWalletKit } from "@mysten/dapp-kit";
import { truncateAddress } from "../utils/formatters";
import "../styles/ConnectButton.scss";

export const ConnectButton = () => {
  const { currentAccount, isConnected, disconnect, connect } = useWalletKit();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="connect-button-container">
      {isConnected && currentAccount ? (
        <div className="wallet-connected">
          <span className="wallet-address">
            {truncateAddress(currentAccount.address)}
          </span>
          <button className="disconnect-button" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="connect-button" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};
