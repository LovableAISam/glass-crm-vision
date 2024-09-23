import { apiAMLAHolidayDelete } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export type UserDeleteResponse = {
  id: number;
};

function useHolidayDeleteFetcher(baseUrl: string, id: string) {
  return apiDelete<UserDeleteResponse>({
    baseUrl,
    path: `${apiAMLAHolidayDelete}/${id}`,
  });
}

export default useHolidayDeleteFetcher;
