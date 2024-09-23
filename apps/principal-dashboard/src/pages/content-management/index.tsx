import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import ContentManagement from '@src/packages/content-management/ContentManagement';

const ContentManagementPage = () => (
  <DashboardContainer>
    <ContentManagement />
  </DashboardContainer>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'co'])),
    },
  };
}

export default ContentManagementPage;
