import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import EmailManagementList from '@src/packages/email-management/EmailManagementList';

const EmailManagementListPage = () => (
  <DashboardContainer>
    <EmailManagementList />
  </DashboardContainer>
);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'emailContent', 'form'])),
    },
  }
}

export default EmailManagementListPage;
