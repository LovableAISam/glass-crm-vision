import { ResponseData } from '@woi/core/api';
import { apiSMSContent } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface SMSContentDeleteResponse extends ResponseData {}

function useSMSContentDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<SMSContentDeleteResponse>({
    baseUrl,
    path: `${apiSMSContent}/${id}`,
  });
}

export default useSMSContentDeleteFetcher;
