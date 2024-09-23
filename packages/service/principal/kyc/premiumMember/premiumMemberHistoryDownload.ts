import { apiKycPremiumMemberHistoryExportToXLS } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

function useKycPremiumMemberDownloadFetcher(baseUrl: string) {
  return apiGet<string>({
    baseUrl,
    path: `${apiKycPremiumMemberHistoryExportToXLS}`,
  });
}

export default useKycPremiumMemberDownloadFetcher;
