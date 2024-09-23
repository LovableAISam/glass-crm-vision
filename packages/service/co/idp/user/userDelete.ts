import { apiUser } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export type UserDeleteResponse = {
  id: number;
}

function useUserDeleteFetcher(baseUrl: string, id: string) {
  return apiDelete<UserDeleteResponse>({
    baseUrl,
    path: `${apiUser}/${id}`,
  });
}

export default useUserDeleteFetcher;
