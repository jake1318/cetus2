import { PoolDetail } from "./pool";

export interface Position {
  positionId: string;
  poolAddress: string;
  pool?: PoolDetail;
  tokenA: {
    symbol: string;
    amount: string;
  };
  tokenB: {
    symbol: string;
    amount: string;
  };
  fee: number;
  lowerTick: number;
  upperTick: number;
  liquidity: string;
  apr?: number;
}
