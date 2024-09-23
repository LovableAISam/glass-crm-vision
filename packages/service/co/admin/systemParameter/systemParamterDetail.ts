import apiGet from '@woi/common/api/apiGet';
import { apiSystemParameter } from "@woi/common/meta/apiPaths/coApiPaths";
import { ResponseData } from '@woi/core/api';

export interface SystemParameterData extends ResponseData {
  code: string;
  createdDate: string;
  id: string;
  modifiedDate: string;
  valueDate: string;
  valueText: string;
  valueType: string;
  description: string;
}

function useSystemParameterDetailFetcher(baseUrl: string, id: string) {
  return apiGet<SystemParameterData>({
    baseUrl,
    path: `${apiSystemParameter}/${id}`,
  });
}

export default useSystemParameterDetailFetcher;
