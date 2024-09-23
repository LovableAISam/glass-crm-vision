import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import AppCustomization from '@src/packages/app-customization/AppCustomizationContainer';
import { useRouter } from 'next/router';

function Create() {
  const router = useRouter();
  const coId = router.query.coId as string;

  return (
    <DashboardContainer>
      <AppCustomization coId={coId} />
    </DashboardContainer>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'appCustomization', 'form'])),
    },
  }
}

export default Create;
