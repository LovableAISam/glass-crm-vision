import { ResponseData } from '@woi/core/api';
import { apiTransactionType } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface TransactionTypeDeleteResponse extends ResponseData {}

function useTransactionTypeDeleteFetcher(baseUrl: string, id: string) {
  return apiDelete<TransactionTypeDeleteResponse>({
    baseUrl,
    path: `${apiTransactionType}/${id}`,
  });
}

export default useTransactionTypeDeleteFetcher;
