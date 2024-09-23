
export interface ResultData<T> {
  data: T;
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface ResultSubmit {
  status: boolean;
  rows_affected: number;
  last_insert_id: number;
}

export interface DefaultResponse {
  descriptions: Array<string | null>;
  details: Array<string>;
  errorCode: number;
  message: string;
  status: number;
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  error_description: string;
}

export interface APIResponseList<T> extends DefaultResponse {
  data: ResultData<T>;
}

export interface APIResponse<T> extends DefaultResponse {
  data: T;
}

export interface DefaultRequest {
  client_id?: string;
  client_secret?: string;
}

export interface DefaultQueryRequest extends DefaultRequest {
  search?: string;
}

export interface DefaultQueryPageRequest extends DefaultQueryRequest {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginationData {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalElements: number;
}

export interface ResponseData {
  id: string;
  createdDate: string;
  modifiedDate: string;
}

export interface DefaultResponseData<T> {
  code: 'SUCCESS' | 'FAILED';
  message: string;
  data: T;
  errors: string | null;
  serverTime: number;
}

export interface DefaultResponseDataPagination<T> {
  code: 'SUCCESS' | 'FAILED';
  message: string;
  data: T;
  errors: string | null;
  serverTime: number;
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface DefaultResponseTransactionsPagination<T> {
  code: 'SUCCESS' | 'FAILED';
  message: string;
  transactions: T;
  errors: string | null;
  serverTime: number;
  currentPage: number;
  totalElements: number;
  totalPages: number;
}