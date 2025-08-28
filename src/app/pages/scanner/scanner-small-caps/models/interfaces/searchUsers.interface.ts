export interface IMicroCapsScanner {
  symbol:string,
  price: number,
  gap: number,
  volume: number,
  marketCap:number,
}
export interface IBroadcastTrade {
  symbol: string;
  price: number;
  gap_pct: number;      
  volume_today: number;
  timestamp: string;   
  market_cap:number,
  seq?: number; 
}

export interface RemoveEvent {
  symbol: string;
  type: 'remove';
  seq?: number; 
}

export interface SnapshotMessage {
  type: 'snapshot';
  snapshot_seq: number;
  items: IBroadcastTrade[];
}

export type WsEvent = IBroadcastTrade | RemoveEvent | SnapshotMessage | IBroadcastTrade[];

