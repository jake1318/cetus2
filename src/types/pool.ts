export interface CoinInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export interface Coin {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export interface PoolDetail {
  poolAddress: string;
  coinA: Coin;
  coinB: Coin;
  fee: number; // Fee in basis points (e.g. 3000 = 0.3%)
  currentSqrtPrice: string;
  tvl?: number; // Total value locked in USD
  apr?: number; // Annual percentage rate
  volume24h?: number; // 24-hour trading volume in USD
}

export interface Position {
  id: string;
  poolAddress: string;
  owner: string;
  liquidity: string;
  tickLower: number;
  tickUpper: number;
  coinA: {
    symbol: string;
    amount: string;
    decimals: number;
  };
  coinB: {
    symbol: string;
    amount: string;
    decimals: number;
  };
  apr?: number;
  feesEarned?: {
    coinA: string;
    coinB: string;
  };
  createdAt: number;
}
