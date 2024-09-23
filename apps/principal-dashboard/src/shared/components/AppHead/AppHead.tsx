import React from 'react';
import { AppHead as AppHeadComponent } from '@woi/web-component';
import { useRouter } from 'next/router';

import { useGeneralInfoSpec } from '@src/shared/context/GeneralInfoContext';

const AppHead = () => {
  const { theme } = useGeneralInfoSpec();
  const { asPath } = useRouter();

  return (
    <AppHeadComponent
      title="Payment & Loyalty - Principal Dashboard"
      color={theme.palette.primary.main}
      logo={<link rel="shortcut icon" href="/logo.png" />}
      asPath={asPath}
    />
  )
}

export default AppHead;