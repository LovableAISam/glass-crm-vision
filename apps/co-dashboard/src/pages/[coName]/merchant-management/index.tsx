import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import MerchantManagementList from '@src/packages/merchant-management/MerchantManagementList';

const MemberManagementPage = () => (
  <DashboardContainer>
    <MerchantManagementList />
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
      ...(await serverSideTranslations(locale || 'en', ['common', 'merchant', 'form'])),
    },
  }
}

export default MemberManagementPage;
