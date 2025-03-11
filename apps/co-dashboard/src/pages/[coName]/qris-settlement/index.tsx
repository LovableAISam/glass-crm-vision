import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import QRISSettlementList from '@src/packages/qris-settlement/QRISSettlementList';

const QRISSettlementPage = () => (
  <DashboardContainer>
    <QRISSettlementList />
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
        'report',
        'form',
      ])),
    },
  };
};

export default QRISSettlementPage;
