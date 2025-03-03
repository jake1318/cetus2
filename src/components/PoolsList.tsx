import { useState, useEffect } from "react";
import { useCetusClient } from "../hooks/useCetusClient";
import { PoolDetail } from "../types/pool";
import { PoolCard } from "./PoolCard";
import { AddLiquidityModal } from "./AddLiquidityModal";
import "../styles/PoolsList.scss";

export const PoolsList = () => {
  const { isInitialized, fetchPools } = useCetusClient();
  const [pools, setPools] = useState<PoolDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPool, setSelectedPool] = useState<PoolDetail | null>(null);
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PoolDetail;
    direction: "ascending" | "descending";
  }>({ key: "tvl", direction: "descending" });

  useEffect(() => {
    const loadPools = async () => {
      if (!isInitialized) return;

      try {
        setIsLoading(true);
        const poolsList = await fetchPools();
        setPools(poolsList);
      } catch (err) {
        console.error("Failed to fetch pools:", err);
        setError("Failed to load pools. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPools();
  }, [isInitialized, fetchPools]);

  const handleAddLiquidity = (pool: PoolDetail) => {
    setSelectedPool(pool);
    setIsAddLiquidityModalOpen(true);
  };

  const requestSort = (key: keyof PoolDetail) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedPools = [...pools].sort((a, b) => {
    // Handle potentially undefined values safely
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA === undefined && valueB === undefined) return 0;
    if (valueA === undefined) return 1;
    if (valueB === undefined) return -1;

    if (valueA < valueB) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredPools = sortedPools.filter((pool) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (pool.coinA?.symbol || "").toLowerCase().includes(searchLower) ||
      (pool.coinB?.symbol || "").toLowerCase().includes(searchLower) ||
      (pool.coinA?.name || "").toLowerCase().includes(searchLower) ||
      (pool.coinB?.name || "").toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pools...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="pools-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by token name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pools-header">
        <div className="pool-header-item">Pair</div>
        <div className="pool-header-item" onClick={() => requestSort("tvl")}>
          TVL{" "}
          {sortConfig.key === "tvl" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </div>
        <div className="pool-header-item" onClick={() => requestSort("apr")}>
          APR{" "}
          {sortConfig.key === "apr" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </div>
        <div
          className="pool-header-item"
          onClick={() => requestSort("volume24h" as keyof PoolDetail)}
        >
          Volume (24h){" "}
          {sortConfig.key === "volume24h" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </div>
        <div className="pool-header-item">Actions</div>
      </div>

      {filteredPools.length === 0 ? (
        <div className="no-pools">No pools found matching your search</div>
      ) : (
        filteredPools.map((pool) => (
          <PoolCard
            key={pool.poolAddress}
            pool={pool}
            onAddLiquidity={() => handleAddLiquidity(pool)}
          />
        ))
      )}

      {isAddLiquidityModalOpen && selectedPool && (
        <AddLiquidityModal
          pool={selectedPool}
          isOpen={isAddLiquidityModalOpen}
          onClose={() => setIsAddLiquidityModalOpen(false)}
        />
      )}
    </div>
  );
};
