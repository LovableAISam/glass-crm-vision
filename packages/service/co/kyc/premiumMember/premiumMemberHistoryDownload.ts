import { apiKycPremiumMemberHistoryExportToXLS } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type KycPremiumMemberDownloadResponse = {
  url: string;
}

function useKycPremiumMemberDownloadFetcher(baseUrl: string) {
  return apiGet<KycPremiumMemberDownloadResponse>({
    baseUrl,
    path: `${apiKycPremiumMemberHistoryExportToXLS}`,
  });
}

export default useKycPremiumMemberDownloadFetcher;
