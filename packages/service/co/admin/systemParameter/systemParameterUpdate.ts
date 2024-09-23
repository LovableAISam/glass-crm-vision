import { DefaultRequest, ResponseData } from '@woi/core/api';
import apiPut from '@woi/common/api/apiPut';
import { apiSystemParameter } from "@woi/common/meta/apiPaths/coApiPaths";

export interface SystemParameterUpdateResponse extends ResponseData {}

export interface SystemParameterUpdateRequest extends DefaultRequest {
  code: string;
  valueDate: string;
  valueText: string;
  valueType: string;
  description: string;
}

function useSystemParameterUpdateFetcher(baseUrl: string, id: string, payload: SystemParameterUpdateRequest) {
  return apiPut<SystemParameterUpdateResponse>({
    baseUrl,
    path: `${apiSystemParameter}/${id}`,
    payload,
  });
}

export default useSystemParameterUpdateFetcher;
