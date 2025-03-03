import { useEffect, useState } from "react";
import { useCetusClient } from "../hooks/useCetusClient";
import { useWalletKit } from "@mysten/dapp-kit";
import { PoolDetail } from "../types/pool";
import "../styles/AddLiquidityModal.scss";

interface AddLiquidityModalProps {
  pool: PoolDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const AddLiquidityModal = ({
  pool,
  isOpen,
  onClose,
}: AddLiquidityModalProps) => {
  const { addLiquidity } = useCetusClient();
  const { currentAccount } = useWalletKit();

  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [customSlippage, setCustomSlippage] = useState("");
  const [isCustomSlippage, setIsCustomSlippage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Price ratio between token A and B
  const priceRatio = 1.5; // In a production app, calculate this from the pool's currentSqrtPrice

  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setAmountA("");
      setAmountB("");
      setError(null);
      setSuccess(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle token A input changes
  const handleAmountAChange = (value: string) => {
    setAmountA(value);

    // If the value is valid, update the other input based on the price ratio
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      const estimatedB = (Number(value) * priceRatio).toFixed(
        pool.coinB?.decimals || 6
      );
      setAmountB(estimatedB);
    } else {
      setAmountB("");
    }
  };

  // Handle token B input changes
  const handleAmountBChange = (value: string) => {
    setAmountB(value);

    // If the value is valid, update the other input based on the price ratio
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      const estimatedA = (Number(value) / priceRatio).toFixed(
        pool.coinA?.decimals || 9
      );
      setAmountA(estimatedA);
    } else {
      setAmountA("");
    }
  };

  // Update slippage based on preset buttons
  const handleSlippagePreset = (value: number) => {
    setSlippage(value);
    setIsCustomSlippage(false);
  };

  // Handle custom slippage input
  const handleCustomSlippageChange = (value: string) => {
    setCustomSlippage(value);

    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setSlippage(Number(value));
    }
  };

  // Toggle custom slippage input
  const toggleCustomSlippage = () => {
    setIsCustomSlippage(!isCustomSlippage);
    if (!isCustomSlippage) {
      setCustomSlippage(slippage.toString());
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    if (!currentAccount) {
      setError("Please connect your wallet to add liquidity");
      return false;
    }

    if (!amountA || !amountB) {
      setError("Please enter amounts for both tokens");
      return false;
    }

    if (Number(amountA) <= 0 || Number(amountB) <= 0) {
      setError("Amounts must be greater than zero");
      return false;
    }

    // In a production app, you would check wallet balance here

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await addLiquidity(
        pool.poolAddress,
        amountA,
        amountB,
        slippage
      );

      if (result.success) {
        setSuccess(
          `Successfully added liquidity! Transaction ID: ${result.txId.slice(
            0,
            8
          )}...`
        );

        // Reset form after success
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError("Transaction failed. Please try again.");
      }
    } catch (err) {
      console.error("Error adding liquidity:", err);
      setError(
        "An error occurred while adding liquidity. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add Liquidity</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pool-info">
            <div className="token-pair">
              <div className="token-icons">
                <div className="token-icon">
                  {pool.coinA?.symbol?.charAt(0)}
                </div>
                <div className="token-icon token-icon-overlap">
                  {pool.coinB?.symbol?.charAt(0)}
                </div>
              </div>
              <div className="token-names">
                {pool.coinA?.symbol} / {pool.coinB?.symbol}
              </div>
              <div className="pool-fee">{pool.fee / 10000}%</div>
            </div>
          </div>

          <div className="input-groups">
            <div className="input-group">
              <div className="token-selector">
                <div className="token-icon">
                  {pool.coinA?.symbol?.charAt(0)}
                </div>
                <span>{pool.coinA?.symbol}</span>
              </div>
              <input
                type="text"
                placeholder="0.0"
                value={amountA}
                onChange={(e) => handleAmountAChange(e.target.value)}
                disabled={isSubmitting}
                className="token-amount-input"
              />
              <div
                className="max-button"
                onClick={() => handleAmountAChange("100")}
              >
                MAX
              </div>
            </div>

            <div className="plus-icon">+</div>

            <div className="input-group">
              <div className="token-selector">
                <div className="token-icon">
                  {pool.coinB?.symbol?.charAt(0)}
                </div>
                <span>{pool.coinB?.symbol}</span>
              </div>
              <input
                type="text"
                placeholder="0.0"
                value={amountB}
                onChange={(e) => handleAmountBChange(e.target.value)}
                disabled={isSubmitting}
                className="token-amount-input"
              />
              <div
                className="max-button"
                onClick={() => handleAmountBChange("100")}
              >
                MAX
              </div>
            </div>
          </div>

          <div className="slippage-settings">
            <div className="slippage-header">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>

            <div className="slippage-options">
              <button
                type="button"
                className={
                  !isCustomSlippage && slippage === 0.1 ? "active" : ""
                }
                onClick={() => handleSlippagePreset(0.1)}
              >
                0.1%
              </button>
              <button
                type="button"
                className={
                  !isCustomSlippage && slippage === 0.5 ? "active" : ""
                }
                onClick={() => handleSlippagePreset(0.5)}
              >
                0.5%
              </button>
              <button
                type="button"
                className={!isCustomSlippage && slippage === 1 ? "active" : ""}
                onClick={() => handleSlippagePreset(1)}
              >
                1%
              </button>
              <button
                type="button"
                className={isCustomSlippage ? "active" : ""}
                onClick={toggleCustomSlippage}
              >
                Custom
              </button>
            </div>

            {isCustomSlippage && (
              <div className="custom-slippage">
                <input
                  type="text"
                  placeholder="Enter slippage %"
                  value={customSlippage}
                  onChange={(e) => handleCustomSlippageChange(e.target.value)}
                />
                <span>%</span>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !amountA || !amountB}
          >
            {isSubmitting ? "Adding Liquidity..." : "Add Liquidity"}
          </button>
        </form>
      </div>
    </div>
  );
};
