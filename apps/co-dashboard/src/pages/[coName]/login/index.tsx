import React from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import AuthContainer from '@src/shared/components/Container/AuthContainer';
import Login from '@src/packages/auth/login/Login';

const LoginPage = () => {
  const { t: tAuth } = useTranslation('auth');

  return (
    <AuthContainer
      title={tAuth('welcomeTitle')}
      description={tAuth('welcomeDescription')}
    >
      <Login />
    </AuthContainer>
  );
};

export async function getServerPath() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'auth',
        'form',
        'common',
      ])),
    },
  };
};

export default LoginPage;
