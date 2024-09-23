import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiContentManagement } from "@woi/common/meta/apiPaths/coApiPaths";
import apiPut from '@woi/common/api/apiPut';

export interface ContentUpdateResponse extends ResponseData { }

export interface ContentUpdateRequest extends DefaultRequest {
  contentDetail: {
    content: string;
    id: string;
    subject: string;
  }[];
  contentName: string;
  contentWillBeDeleted: {
    content: string;
    id: string;
    subject: string;
  }[] | [];
}

function useContentUpdateFetcher(baseUrl: string, id: number | string, payload: ContentUpdateRequest) {
  return apiPut<ContentUpdateResponse>({
    baseUrl,
    path: `${apiContentManagement}/${id}`,
    payload,
  });
}

export default useContentUpdateFetcher;
