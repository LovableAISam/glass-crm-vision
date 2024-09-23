import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import AuthContainer from '@src/shared/components/Container/AuthContainer';
import ExpiredLink from '@src/packages/error/expired-link/ExpiredLink';

const ExpiredLinkPage = () => {
  const { t: tAuth } = useTranslation('auth');

  return (
    <AuthContainer
      title={tAuth('welcomeTitle')}
      description={tAuth('welcomeDescription')}
    >
      <ExpiredLink />
    </AuthContainer>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale || 'en', ['auth', 'form']),
  },
})

export default ExpiredLinkPage;
