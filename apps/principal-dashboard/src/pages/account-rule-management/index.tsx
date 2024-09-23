import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import AccountRuleManagementList from '@src/packages/account-rule-management/AccountRuleManagementList';

const AccountRuleManagementListPage = () => (
  <DashboardContainer>
    <AccountRuleManagementList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'accountRule', 'form'])),
    },
  }
}

export default AccountRuleManagementListPage;
