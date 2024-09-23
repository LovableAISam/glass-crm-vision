import { apiMemberStatusType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type MemberStatusType = 'ACTIVE' | 'ERROR' | 'INACTIVE' | 'PENDING';

function useMemberStatusListFetcher(baseUrl: string) {
  return apiGet<Record<MemberStatusType, string>>({
    baseUrl,
    path: `${apiMemberStatusType}`,
  });
}

export default useMemberStatusListFetcher;
