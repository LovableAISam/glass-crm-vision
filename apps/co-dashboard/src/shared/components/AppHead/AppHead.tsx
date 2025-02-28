import React from 'react';
import { AppHead as AppHeadComponent } from '@woi/web-component';

import { useGeneralInfoSpec } from '@src/shared/context/GeneralInfoContext';
import { useCommunityOwner } from '@src/shared/context/CommunityOwnerContext';
import { useRouter } from 'next/router';

const AppHead = () => {
  const { theme } = useGeneralInfoSpec();
  const { coName, coDetail } = useCommunityOwner();
  const { asPath } = useRouter();

  return (
    <AppHeadComponent
      title={`${coDetail || coName === 'co' ? `${coName.toUpperCase()} -` : ''} CO Dashboard`}
      color={theme.palette.primary.main}
      logo={<link rel="shortcut icon" href="/logo.png" />}
      asPath={asPath}
    />
  );
};

export default AppHead;