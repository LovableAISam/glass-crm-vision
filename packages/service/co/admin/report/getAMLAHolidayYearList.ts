import { constructUrlSearchParams } from '@woi/core/api';
import { apiAMLAHolidayYearList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

function useYearListFetcher(baseUrl: string) {
  return apiGet<string[]>({
    baseUrl,
    path: `${apiAMLAHolidayYearList}`,
    config: { params: constructUrlSearchParams('') },
  });
}

export default useYearListFetcher;
