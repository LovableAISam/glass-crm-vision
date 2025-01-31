import { getJwtData } from "@woi/core/utils/jwt/jwt";
import { Cookie } from "@woi/core";
import { MENU_ACCESS, PRIVILEGE_ACCESS } from "@woi/privilege";
import { useCallback, useMemo } from "react";
import { ckAccessToken, ckMerchantAccessToken } from '@woi/common/meta/cookieKeys';
import { useRouter } from "next/router";

function useMenuPrivilege() {
  const router = useRouter();
  const accessToken = router.asPath.includes('/merchant/') ? Cookie.get(ckMerchantAccessToken) : Cookie.get(ckAccessToken);

  const authDetail = useMemo(() => {
    if (accessToken === undefined) return null;
    return getJwtData(accessToken);
  }, [accessToken]);

  const DEFAULT_DASHBOARD = ['default:get', 'default:create', 'default:update', 'default:delete'];
  const DEFAULT_MERCHANT = ['default-merchant:get', 'default-merchant:create', 'default-merchant:update', 'default-merchant:delete'];

  const DEFAULT_MERCHANT_DYNAMIC = authDetail?.merchantCode?.startsWith('MED') ? ['default-merchant-dynamic:get', 'default-merchant-dynamic:create', 'default-merchant-dynamic:update', 'default-merchant-dynamic:delete'] : [];

  const DEFAULT_AUTHORITIES = router.asPath.includes('/merchant/') ? [...DEFAULT_MERCHANT, ...DEFAULT_MERCHANT_DYNAMIC] : DEFAULT_DASHBOARD;


  const authorities = useMemo(() => {
    let authoritiesTemp = DEFAULT_AUTHORITIES;
    if (accessToken) {
      const jwtData = getJwtData(accessToken);
      return [...authoritiesTemp, ...(jwtData.authorities || [])];
    }
    return authoritiesTemp;
  }, [accessToken]);

  const checkAuthority = useCallback((menuAccess: MENU_ACCESS, privilegeAccess: PRIVILEGE_ACCESS | PRIVILEGE_ACCESS[]) => {
    if (typeof privilegeAccess === 'string') {
      return authorities.includes(`${menuAccess}:${privilegeAccess}`);
    }
    return privilegeAccess.every(privilege => authorities.includes(`${menuAccess}:${privilege}`));
  }, [authorities]);

  return {
    authorities,
    checkAuthority,
  };
}

export default useMenuPrivilege;