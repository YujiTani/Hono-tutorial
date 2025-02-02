/**
 * id か uuid を指定するためのリクエスト
 */
export type FindRequest = {
  id?: number;
  uuid?: string;
};

/**
 * query パラメーターと limit と offset を指定するためのリクエスト
 */
export type LimitOffsetRequest = {
  query: string;
  limit: number;
  offset: number;
};

/**
 * 一覧系基本レスポンス
 */
export type BaseResponse = {
  total: number;
  limit: number;
  offset: number;
};
