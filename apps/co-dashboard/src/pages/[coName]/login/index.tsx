import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useCommunityOwner } from "@src/shared/context/CommunityOwnerContext";
import useRouteRedirection from "@src/shared/hooks/useRouteRedirection";

import AuthContainer from '@src/shared/components/Container/AuthContainer';
import Login from '@src/packages/auth/login/Login';

const LoginPage = () => {
  const { t: tAuth } = useTranslation('auth');
  const { coDetail, coName } = useCommunityOwner();
  const { onNavigate } = useRouteRedirection();

  useEffect(() => {
    if (!coDetail && coName !== 'co') {
      onNavigate('/404');
    }
  }, []);

  if (!coDetail && coName !== 'co') {
    return <div />;
  }

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
