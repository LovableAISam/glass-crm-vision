import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import FDSHistoryList from '@src/packages/fds-history/FDSHistoryList';

const FDSHistoryPage = () => (
  <DashboardContainer>
    <FDSHistoryList />
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
        'fDSHistory',
        'report',
      ])),
    },
  };
};

export default FDSHistoryPage;
