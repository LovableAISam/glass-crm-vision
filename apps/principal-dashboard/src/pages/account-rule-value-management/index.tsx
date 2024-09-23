import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import AccountRuleValueManagementList from '@src/packages/account-rule-value-management/AccountRuleValueManagementList';

const AccountRuleValueManagementListPage = () => (
  <DashboardContainer>
    <AccountRuleValueManagementList />
  </DashboardContainer>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'accountRuleValue', 'form'])),
    },
  }
}

export default AccountRuleValueManagementListPage;
