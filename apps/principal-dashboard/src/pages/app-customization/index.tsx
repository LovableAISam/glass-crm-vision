import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import AppCustomizationList from '@src/packages/app-customization/AppCustomizationList';

const AppCustomizationListPage = () => (
  <DashboardContainer>
    <AppCustomizationList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'appCustomization', 'form'])),
    },
  }
}

export default AppCustomizationListPage;
