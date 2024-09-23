import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import AuthContainer from '@src/shared/components/Container/AuthContainer';
import ForgotPassword from '@src/packages/auth/forgot-password/ForgotPassword';

const ForgotPasswordPage = () => {
  const { t: tAuth } = useTranslation('auth');

  return (
    <AuthContainer
      title={tAuth('welcomeTitle')}
      description={tAuth('welcomeDescription')}
    >
      <ForgotPassword />
    </AuthContainer>
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
      ...(await serverSideTranslations(locale || 'en', ['auth', 'form'])),
    },
  }
}

export default ForgotPasswordPage;
