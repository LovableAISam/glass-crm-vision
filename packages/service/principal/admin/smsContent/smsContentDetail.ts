import { apiSMSContent } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { SMSContentData } from './smsContentList';

function useSMSContentDetailFetcher(baseUrl: string, id: number | string) {
  return apiGet<SMSContentData>({
    baseUrl,
    path: `${apiSMSContent}/${id}`,
  });
}

export default useSMSContentDetailFetcher;
