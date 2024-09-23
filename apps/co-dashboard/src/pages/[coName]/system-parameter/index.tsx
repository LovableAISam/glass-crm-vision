import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import SystemParameterList from '@src/packages/system-parameter/SystemParameterList';

const SystemParameterListPage = () => (
  <DashboardContainer>
    <SystemParameterList />
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
        'sysParam',
        'form',
      ])),
    },
  };
};

export default SystemParameterListPage;
