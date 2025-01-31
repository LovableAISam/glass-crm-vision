import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import AccountInformation from '@src/packages/merchant/account-information/AccountInformation';

const AccountInformationPage = () => (
  <DashboardContainer>
    <AccountInformation />
  </DashboardContainer>
);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'form',
        'account',
      ])),
    },
  };
};

export default AccountInformationPage;
