// Core
import React from 'react';

// Utils
import useMenuPrivilege from '@src/shared/hooks/useMenuPrivilege';

// Types
import { MENU_ACCESS, PRIVILEGE_ACCESS } from '@woi/privilege';

export type AutorizeViewRenderMethods = {
  enabled: boolean;
};

type AuthorizeViewProps = {
  privileges: PRIVILEGE_ACCESS[];
  access: MENU_ACCESS;
  children:
    | React.ReactElement
    | ((methods: AutorizeViewRenderMethods) => React.ReactElement);
};

const AuthorizeView = (props: AuthorizeViewProps) => {
  const { children, privileges, access } = props;
  const { checkAuthority } = useMenuPrivilege();
  const enabled = privileges.every(privilege =>
    checkAuthority(access, privilege),
  );

  if (enabled) {
    if (typeof children === 'function') {
      return (
        <>
          {(
            children as (
              methods: AutorizeViewRenderMethods,
            ) => React.ReactElement
          )({ enabled })}
        </>
      );
    }
    return <>{children}</>;
  }

  return null;
};

export default AuthorizeView;
