import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import RoleManagementList from '@src/packages/role-management/RoleManagementList';

const RoleManagementPage = () => (
  <DashboardContainer>
    <RoleManagementList />
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
      ...(await serverSideTranslations(locale || 'en', ['common', 'role', 'form'])),
    },
  }
}

export default RoleManagementPage;
