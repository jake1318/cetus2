import { useState } from "react";
import { useCetusClient } from "../hooks/useCetusClient";
import { useWalletKit } from "@mysten/dapp-kit";
import "../styles/RemoveLiquidityModal.scss";

interface RemoveLiquidityModalProps {
  position: {
    id: string;
    poolAddress: string;
    coinA: {
      symbol: string;
      amount: string;
    };
    coinB: {
      symbol: string;
      amount: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export const RemoveLiquidityModal = ({
  position,
  isOpen,
  onClose,
}: RemoveLiquidityModalProps) => {
  const { removeLiquidity } = useCetusClient();
  const { currentAccount } = useWalletKit();

  const [percentToRemove, setPercentToRemove] = useState(50);
  const [slippage, setSlippage] = useState(0.5);
  const [customSlippage, setCustomSlippage] = useState("");
  const [isCustomSlippage, setIsCustomSlippage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  // Calculated return amounts based on percentage
  const returnAmountA =
    parseFloat(position.coinA.amount) * (percentToRemove / 100);
  const returnAmountB =
    parseFloat(position.coinB.amount) * (percentToRemove / 100);

  // Update percentage using slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentToRemove(parseInt(e.target.value));
  };

  // Set predefined percentage values
  const handlePercentageButtonClick = (percent: number) => {
    setPercentToRemove(percent);
  };

  // Handle slippage selection
  const handleSlippageSelect = (value: number) => {
    setSlippage(value);
    setIsCustomSlippage(false);
  };

  // Handle custom slippage input
  const handleCustomSlippageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100)
    ) {
      setCustomSlippage(value);
      if (value) {
        setSlippage(parseFloat(value));
      }
    }
  };

  // Switch to custom slippage mode
  const enableCustomSlippage = () => {
    setIsCustomSlippage(true);
    setCustomSlippage(slippage.toString());
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAccount || percentToRemove <= 0 || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setTransactionStatus("pending");

      // Call the removeLiquidity function from our context
      const result = await removeLiquidity(
        position.id,
        percentToRemove,
        slippage
      );

      if (result.success) {
        setTransactionStatus("success");
        setTransactionDetails(result);

        // Reset form after 3 seconds on success
        setTimeout(() => {
          onClose();
          setTransactionStatus("idle");
        }, 3000);
      } else {
        setTransactionStatus("error");
      }
    } catch (error) {
      console.error("Error removing liquidity:", error);
      setTransactionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Remove Liquidity</h2>
          {!isSubmitting && (
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Position Information */}
            <div className="position-info">
              <div className="token-pair">
                <span className="token-symbol">{position.coinA.symbol}</span>
                <span className="separator">/</span>
                <span className="token-symbol">{position.coinB.symbol}</span>
              </div>
              <div className="position-id">
                Position ID: {position.id.slice(0, 8)}...{position.id.slice(-6)}
              </div>
            </div>

            {/* Percentage Selection */}
            <div className="percentage-section">
              <div className="section-header">Amount to Remove</div>
              <div className="percentage-display">{percentToRemove}%</div>

              <div className="percentage-slider">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={percentToRemove}
                  onChange={handleSliderChange}
                  disabled={isSubmitting}
                />
                <div className="range-labels">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="percentage-buttons">
                <button
                  type="button"
                  onClick={() => handlePercentageButtonClick(25)}
                  disabled={isSubmitting}
                  className={percentToRemove === 25 ? "active" : ""}
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handlePercentageButtonClick(50)}
                  disabled={isSubmitting}
                  className={percentToRemove === 50 ? "active" : ""}
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handlePercentageButtonClick(75)}
                  disabled={isSubmitting}
                  className={percentToRemove === 75 ? "active" : ""}
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => handlePercentageButtonClick(100)}
                  disabled={isSubmitting}
                  className={percentToRemove === 100 ? "active" : ""}
                >
                  Max
                </button>
              </div>
            </div>

            {/* Expected Returns */}
            <div className="expected-return-section">
              <div className="section-header">Expected Return</div>
              <div className="expected-return-item">
                <span>{position.coinA.symbol}:</span>
                <span>{returnAmountA.toFixed(6)}</span>
              </div>
              <div className="expected-return-item">
                <span>{position.coinB.symbol}:</span>
                <span>{returnAmountB.toFixed(6)}</span>
              </div>
            </div>

            {/* Slippage Settings */}
            <div className="slippage-section">
              <div className="section-header">Slippage Tolerance</div>
              <div className="slippage-options">
                <button
                  type="button"
                  className={
                    !isCustomSlippage && slippage === 0.1 ? "active" : ""
                  }
                  onClick={() => handleSlippageSelect(0.1)}
                  disabled={isSubmitting}
                >
                  0.1%
                </button>
                <button
                  type="button"
                  className={
                    !isCustomSlippage && slippage === 0.5 ? "active" : ""
                  }
                  onClick={() => handleSlippageSelect(0.5)}
                  disabled={isSubmitting}
                >
                  0.5%
                </button>
                <button
                  type="button"
                  className={
                    !isCustomSlippage && slippage === 1 ? "active" : ""
                  }
                  onClick={() => handleSlippageSelect(1)}
                  disabled={isSubmitting}
                >
                  1.0%
                </button>
                {isCustomSlippage ? (
                  <div className="custom-slippage">
                    <input
                      type="text"
                      value={customSlippage}
                      onChange={handleCustomSlippageChange}
                      placeholder="Custom"
                      disabled={isSubmitting}
                    />
                    <span>%</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={enableCustomSlippage}
                    disabled={isSubmitting}
                  >
                    Custom
                  </button>
                )}
              </div>
            </div>

            {/* Transaction Status */}
            {transactionStatus === "pending" && (
              <div className="transaction-status pending">
                <div className="loading-spinner"></div>
                <p>Transaction in progress...</p>
              </div>
            )}

            {transactionStatus === "success" && (
              <div className="transaction-status success">
                <div className="success-icon">✓</div>
                <p>Transaction successful!</p>
                {transactionDetails && (
                  <div className="transaction-details">
                    <p>Transaction ID: {transactionDetails.txId}</p>
                  </div>
                )}
              </div>
            )}

            {transactionStatus === "error" && (
              <div className="transaction-status error">
                <div className="error-icon">×</div>
                <p>Transaction failed. Please try again.</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {transactionStatus === "idle" || transactionStatus === "error" ? (
              <button
                type="submit"
                className="remove-liquidity-button"
                disabled={
                  percentToRemove <= 0 || isSubmitting || !currentAccount
                }
              >
                {!currentAccount
                  ? "Connect Wallet to Continue"
                  : percentToRemove <= 0
                  ? "Select Amount"
                  : "Remove Liquidity"}
              </button>
            ) : transactionStatus === "success" ? (
              <button
                type="button"
                className="close-button-success"
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              <button type="button" className="processing-button" disabled>
                Processing...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
