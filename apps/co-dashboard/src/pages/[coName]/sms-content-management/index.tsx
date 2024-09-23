import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import SMSContentManagementList from '@src/packages/sms-content-management/SMSContentManagementList';

const SMSContentManagementListPage = () => (
  <DashboardContainer>
    <SMSContentManagementList />
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
      ...(await serverSideTranslations(locale || 'en', ['common', 'smsContent', 'form'])),
    },
  }
}

export default SMSContentManagementListPage;
