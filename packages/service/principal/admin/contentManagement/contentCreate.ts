import { DefaultRequest, ResponseData } from '@woi/core/api';
import apiPost from '@woi/common/api/apiPost';
import { apiContentManagement } from "@woi/common/meta/apiPaths/principalApiPaths";

export interface ContentCreateResponse extends ResponseData { }

export interface ContentCreateRequest extends DefaultRequest {
  contentDetail: {
    content: string;
    id: string;
    subject: string;
  }[];
  contentName: {
    createdBy: string;
    createdDate: string;
    id: string;
    modifiedBy: string;
    modifiedDate: string;
    name: string;
    secureId: string;
    type: string;
  };
}

function useContentCreateFetcher(baseUrl: string, payload: ContentCreateRequest) {
  return apiPost<ContentCreateResponse>({
    baseUrl,
    path: `${apiContentManagement}`,
    payload,
  });
}

export default useContentCreateFetcher;
