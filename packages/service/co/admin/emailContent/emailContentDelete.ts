import { ResponseData } from '@woi/core/api';
import { apiEmailContent } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface EmailContentDeleteResponse extends ResponseData {}

function useEmailContentDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<EmailContentDeleteResponse>({
    baseUrl,
    path: `${apiEmailContent}/${id}`,
  });
}

export default useEmailContentDeleteFetcher;
