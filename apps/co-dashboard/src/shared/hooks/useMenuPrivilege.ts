import { getJwtData } from "@woi/core/utils/jwt/jwt";
import { Cookie } from "@woi/core";
import { MENU_ACCESS, PRIVILEGE_ACCESS } from "@woi/privilege";
import { useCallback, useMemo } from "react";
import { ckAccessToken } from '@woi/common/meta/cookieKeys';

const DEFAULT_AUTHORITIES = ['default:get', 'default:create', 'default:update', 'default:delete'];

function useMenuPrivilege() {
  const accessToken = Cookie.get(ckAccessToken);

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