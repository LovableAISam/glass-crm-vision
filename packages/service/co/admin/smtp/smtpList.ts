import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiSMTP } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface SMTPData extends ResponseData {
  name: string;
  password: string;
  port: number;
  server: string;
  startTls: string;
  username: string;
}

interface SMTPListResponse extends ResultData<SMTPData[]> {}

export interface SMTPListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useSMTPListFetcher(baseUrl: string, payload: SMTPListRequest) {
  return apiGet<SMTPListResponse>({
    baseUrl,
    path: `${apiSMTP}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useSMTPListFetcher;
