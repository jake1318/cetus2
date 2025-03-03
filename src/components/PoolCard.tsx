import { useState } from "react";
import { PoolDetail } from "../types/pool";
import { formatCurrency } from "../utils/formatters.ts";
import "../styles/PoolCard.scss";

interface PoolCardProps {
  pool: PoolDetail;
  onAddLiquidity: () => void;
}

export const PoolCard = ({ pool, onAddLiquidity }: PoolCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`pool-card ${isExpanded ? "expanded" : ""}`}
      onClick={toggleExpanded}
    >
      <div className="pool-card-main">
        <div className="pool-pair">
          <div className="token-icons">
            <div className="token-icon">{pool.coinA?.symbol.charAt(0)}</div>
            <div className="token-icon second">
              {pool.coinB?.symbol.charAt(0)}
            </div>
          </div>
          <div className="token-names">
            {pool.coinA?.symbol}/{pool.coinB?.symbol}
            <span className="fee-tier">{pool.fee / 10000}%</span>
          </div>
        </div>
        <div className="pool-stat tvl">{formatCurrency(pool.tvl)}</div>
        <div className="pool-stat apr">{pool.apr.toFixed(2)}%</div>
        <div className="pool-stat volume">
          {formatCurrency(pool.volume24h || 0)}
        </div>
        <div className="pool-actions">
          <button
            className="add-liquidity-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddLiquidity();
            }}
          >
            Add Liquidity
          </button>
        </div>
        <div className="expand-icon">{isExpanded ? "▲" : "▼"}</div>
      </div>

      {isExpanded && (
        <div className="pool-card-details">
          <div className="details-section">
            <h4>Pool Information</h4>
            <div className="detail-row">
              <span>Pool Address:</span>
              <span className="address">
                {pool.poolAddress.slice(0, 8)}...{pool.poolAddress.slice(-6)}
              </span>
            </div>
            <div className="detail-row">
              <span>Current Price:</span>
              <span>
                {parseFloat(pool.currentSqrtPrice) ** 2 / 10 ** 6}{" "}
                {pool.coinB?.symbol}/{pool.coinA?.symbol}
              </span>
            </div>
          </div>

          <div className="details-section">
            <h4>Token Information</h4>
            <div className="token-details">
              <div className="token-detail-column">
                <div className="token-detail-row">
                  <span>Name:</span>
                  <span>{pool.coinA?.name}</span>
                </div>
                <div className="token-detail-row">
                  <span>Symbol:</span>
                  <span>{pool.coinA?.symbol}</span>
                </div>
                <div className="token-detail-row">
                  <span>Decimals:</span>
                  <span>{pool.coinA?.decimals}</span>
                </div>
              </div>
              <div className="token-detail-column">
                <div className="token-detail-row">
                  <span>Name:</span>
                  <span>{pool.coinB?.name}</span>
                </div>
                <div className="token-detail-row">
                  <span>Symbol:</span>
                  <span>{pool.coinB?.symbol}</span>
                </div>
                <div className="token-detail-row">
                  <span>Decimals:</span>
                  <span>{pool.coinB?.decimals}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
