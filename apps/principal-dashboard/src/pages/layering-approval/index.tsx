import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import LayeringApprovalList from '@src/packages/layering-approval/LayeringApprovalList';

const LayeringApprovalListPage = () => (
  <DashboardContainer>
    <LayeringApprovalList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'layeringApproval', 'form'])),
    },
  }
}

export default LayeringApprovalListPage;
