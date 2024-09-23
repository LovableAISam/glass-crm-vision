import { apiEmailContent } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { EmailContentData } from './emailContentList';

function useEmailContentDetailFetcher(baseUrl: string, id: number | string) {
  return apiGet<EmailContentData>({
    baseUrl,
    path: `${apiEmailContent}/${id}`,
  });
}

export default useEmailContentDetailFetcher;
