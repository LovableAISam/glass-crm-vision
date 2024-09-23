import { apiContentManagement } from "@woi/common/meta/apiPaths/principalApiPaths";
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from "@woi/core/api";

export interface ContentDetail extends ResponseData {
  currentPage: number;
  data: {
    content: string;
    contentName: {
      createdDate: string;
      id: string;
      modifiedDate: string;
      name: string;
      type: string;
    };
    createdDate: string;
    id: string;
    modifiedDate: string;
    subject: string;
  }[];
  totalElements: number;
  totalPages: number;
}

function useContentDetailFetcher(baseUrl: string, id: number | string) {
  return apiGet<ContentDetail>({
    baseUrl,
    path: `${apiContentManagement}/${id}`,
  });
}

export default useContentDetailFetcher;
