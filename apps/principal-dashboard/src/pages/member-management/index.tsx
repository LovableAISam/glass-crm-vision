import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import MemberManagementList from '@src/packages/member-management/MemberManagementList';

const MemberManagementPage = () => (
  <DashboardContainer>
    <MemberManagementList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'member', 'kyc', 'form', 'report'])),
    },
  }
}

export default MemberManagementPage;
