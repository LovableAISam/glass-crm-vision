import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadMemberSummaryTransactionExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { MemberTransactionType } from "../../admin/report/membersummaryDetail";

interface TransactionSummaryExportResponseData {
  url: string;
}

interface TransactionSummaryExportResponse extends TransactionSummaryExportResponseData { }

export interface MemberTransactionSummaryExportRequest {
  endAt?: string;
  phoneNumber?: string;
  startAt?: string;
  sort?: string;
  fileExtension?: string;
  transactionType?: MemberTransactionType[];
}

function useMemberSummaryTransactionExportFetcher(baseUrl: string, payload: MemberTransactionSummaryExportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionSummaryExportResponse>({
    baseUrl,
    path: `${apiDownloadMemberSummaryTransactionExport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMemberSummaryTransactionExportFetcher;
