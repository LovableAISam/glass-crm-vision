import { apiBank } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
import { BankStatus } from './bankList';

export interface BankData extends ResponseData {
  backgroundCard: string;
  color: string;
  fullName: string;
  logo: string;
  name: string;
  status: BankStatus;
}

function useBankDetailFetcher(baseUrl: string, id: string) {
  return apiGet<BankData>({
    baseUrl,
    path: `${apiBank}/${id}`,
  });
}

export default useBankDetailFetcher;
