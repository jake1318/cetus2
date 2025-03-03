import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useCetusClient } from "../hooks/useCetusClient";
import { Position } from "../types/position";
import { RemoveLiquidityModal } from "./RemoveLiquidityModal";
import { formatAmount } from "../utils/format";
import "../styles/UserLiquidity.scss";

export const UserLiquidity = () => {
  const currentAccount = useCurrentAccount();
  const { cetusClient, isInitialized } = useCetusClient();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [isRemoveLiquidityModalOpen, setIsRemoveLiquidityModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserPositions = async () => {
      if (!cetusClient || !isInitialized || !currentAccount) return;

      try {
        setIsLoading(true);

        // In a real application, you would fetch the user's positions from the blockchain
        // For demonstration purposes, we're setting mock positions

        const mockPositions: Position[] = [
          {
            positionId: "0x12345",
            poolAddress: "0x67890",
            tokenA: {
              symbol: "SUI",
              amount: "10.5",
            },
            tokenB: {
              symbol: "USDC",
              amount: "105.0",
            },
            fee: 3000,
            lowerTick: -10000,
            upperTick: 10000,
            liquidity: "1000000000000000",
            apr: 12.5,
          },
          {
            positionId: "0x54321",
            poolAddress: "0x09876",
            tokenA: {
              symbol: "ETH",
              amount: "0.5",
            },
            tokenB: {
              symbol: "SUI",
              amount: "250.0",
            },
            fee: 5000,
            lowerTick: -20000,
            upperTick: 20000,
            liquidity: "500000000000000",
            apr: 18.3,
          },
        ];

        setPositions(mockPositions);
      } catch (err) {
        console.error("Error fetching user positions:", err);
        setError(
          "Failed to load your liquidity positions. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPositions();
  }, [cetusClient, isInitialized, currentAccount]);

  const handleRemoveLiquidity = (position: Position) => {
    setSelectedPosition(position);
    setIsRemoveLiquidityModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your positions...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (positions.length === 0) {
    return (
      <div className="no-positions">
        <p>You don't have any active liquidity positions.</p>
        <p>Add liquidity to a pool to start earning rewards.</p>
      </div>
    );
  }

  return (
    <div className="user-liquidity">
      <h2>Your Liquidity Positions</h2>

      <div className="positions-list">
        {positions.map((position) => (
          <div key={position.positionId} className="position-card">
            <div className="position-header">
              <div className="position-pair">
                <div className="token-icons">
                  <div className="token-icon">
                    {position.tokenA.symbol.charAt(0)}
                  </div>
                  <div className="token-icon token-icon-overlap">
                    {position.tokenB.symbol.charAt(0)}
                  </div>
                </div>
                <div className="token-names">
                  {position.tokenA.symbol}/{position.tokenB.symbol}
                </div>
                <div className="position-fee">{position.fee / 10000}%</div>
              </div>
              <div className="position-apr">
                <span>APR:</span> {formatAmount(position.apr || 0)}%
              </div>
            </div>

            <div className="position-details">
              <div className="position-detail">
                <span className="detail-label">Position ID:</span>
                <span className="detail-value">{`${position.positionId.substring(
                  0,
                  6
                )}...${position.positionId.substring(
                  position.positionId.length - 4
                )}`}</span>
              </div>
              <div className="position-detail">
                <span className="detail-label">Liquidity:</span>
                <span className="detail-value">
                  {formatAmount(position.liquidity)}
                </span>
              </div>
              <div className="position-detail">
                <span className="detail-label">{position.tokenA.symbol}:</span>
                <span className="detail-value">{position.tokenA.amount}</span>
              </div>
              <div className="position-detail">
                <span className="detail-label">{position.tokenB.symbol}:</span>
                <span className="detail-value">{position.tokenB.amount}</span>
              </div>
            </div>

            <div className="position-actions">
              <button
                className="action-btn remove-btn"
                onClick={() => handleRemoveLiquidity(position)}
              >
                Remove Liquidity
              </button>
              <button
                className="action-btn view-btn"
                onClick={() =>
                  window.open(
                    `https://explorer.sui.io/object/${position.positionId}`,
                    "_blank"
                  )
                }
              >
                View on Explorer
              </button>
            </div>
          </div>
        ))}
      </div>

      {isRemoveLiquidityModalOpen && selectedPosition && (
        <RemoveLiquidityModal
          position={selectedPosition}
          isOpen={isRemoveLiquidityModalOpen}
          onClose={() => setIsRemoveLiquidityModalOpen(false)}
        />
      )}
    </div>
  );
};
