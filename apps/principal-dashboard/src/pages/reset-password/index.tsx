import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import AuthContainer from '@src/shared/components/Container/AuthContainer';
import ResetPassword from '@src/packages/auth/reset-password/ResetPassword';

const ResetPasswordPage = () => {
  const { t: tAuth } = useTranslation('auth');

  return (
    <AuthContainer
      title={tAuth('welcomeTitle')}
      description={tAuth('welcomeDescription')}
    >
      <ResetPassword />
    </AuthContainer>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale || 'en', ['auth', 'form']),
  },
})

export default ResetPasswordPage;
