import { ResponseData, } from '@woi/core/api';
import { apiContentManagement } from "@woi/common/meta/apiPaths/principalApiPaths";
import apiGet from '@woi/common/api/apiGet';

export interface ContentNameData extends ResponseData {
  createdBy: string;
  createdDate: string;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  secureId: string;
  type: string;
}

function useContentNameListFetcher(baseUrl: string) {
  return apiGet<ContentNameData[]>({
    baseUrl,
    path: `${apiContentManagement}/contentName`,
  });
}

export default useContentNameListFetcher;
