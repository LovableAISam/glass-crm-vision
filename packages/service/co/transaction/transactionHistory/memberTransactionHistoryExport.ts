import { constructUrlSearchParams, DefaultQueryPageRequest } from '@woi/core/api';
import { apiDownloadMemberTransactionExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface TransactionHistoryExportResponseData {
  url: string;
}

interface TransactionHistoryExportResponse extends TransactionHistoryExportResponseData { }

export interface MemberTransactionHistoryExportRequest extends DefaultQueryPageRequest {
  endAt?: string;
  phoneNumber?: string;
  startAt?: string;
  sort?: string;
  fileExtension?: string;
}

export interface CheckboxFileFormat {
  name: string;
  label: string;
}

export const fileFormats: CheckboxFileFormat[] = [
  { name: 'PDF', label: 'PDF' },
  { name: 'CSV', label: 'CSV' },
  { name: 'EXCEL', label: 'Excel' },
];

function useMemberTransactionHistoryExportFetcher(baseUrl: string, payload: MemberTransactionHistoryExportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionHistoryExportResponse>({
    baseUrl,
    path: `${apiDownloadMemberTransactionExport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMemberTransactionHistoryExportFetcher;
