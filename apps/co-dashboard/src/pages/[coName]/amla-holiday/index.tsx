import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import AMBAHolidayList from "@src/packages/amla-holiday/AMLAHolidayList";

const AMLAHolidayPage = () => (
  <DashboardContainer>
    <AMBAHolidayList />
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
        'amlaHoliday',
        'form',
      ])),
    },
  };
};

export default AMLAHolidayPage;
