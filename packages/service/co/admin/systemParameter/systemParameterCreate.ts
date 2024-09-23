import { DefaultRequest } from '@woi/core/api';
import { apiSystemParameter } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface SystemParameterCreateResponse {}

export interface SystemParameterCreateRequest extends DefaultRequest {
  code: string;
  valueDate: string;
  valueText: string;
  valueType: string;
  description: string;
}

function useSystemParameterCreateFetcher(baseUrl: string, payload: SystemParameterCreateRequest) {
  return apiPost<SystemParameterCreateResponse>({
    baseUrl,
    path: `${apiSystemParameter}`,
    payload,
  });
}

export default useSystemParameterCreateFetcher;
