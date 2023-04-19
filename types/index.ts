


/**
 * 分頁回傳參數
 */
export interface QPaginationParams {
  page: number;
  page_size: number;
  total: number;
}

/**
 * 分頁的query
 */
export interface QPaginationQuery {
  page?: number;
  page_size?: number;
}

export interface QApiResponse<T> {
  code: number;
  data: T;
  message: string;
  pagination: QPaginationParams;
}


export interface QSearchQuery {
  keyword?: string;
}

export type QSortBaseDirection = "desc" | "asc";

export interface QSortQuery<T = string, Direction = QSortBaseDirection> {
  sort?: T;
  direction?: Direction;
}

export interface QCategorizedQuery {
  category_id?: number;
}

/**
 * @example is_enable => -1 = All, 1 = is_enable, 0 = is_able
 */
export enum QIsType {
  All = -1,
  True = 1,
  False = 0,
}
