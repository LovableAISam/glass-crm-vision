// Cores
import React, { createContext, useContext } from 'react';
import { Cookie, JWTConfig } from '@woi/core';
import { isExpiredToken } from '@woi/core/utils/jwt/jwt';
import { useLogoutFetcher } from '@woi/service/co';
import { CommunityOwnerDetailData } from '@woi/service/co/admin/communityOwner/communityOwnerDetail';
import { useRouter } from 'next/router';
import { ckMerchantCode } from '@woi/common/meta/cookieKeys';

// Contexts

export const CommunityOwnerContext = createContext<{
  coName: string;
  onChangeCoName: (coName: string) => void;
  coDetail: CommunityOwnerDetailData | null;
  merchantCode: string;
}>({
  coName: 'default',
  onChangeCoName: () => null,
  coDetail: null,
  merchantCode: '',
});

export function useCommunityOwner() {
  const value = useContext(CommunityOwnerContext);

  if (!value) {
    throw new Error(
      'useCommunityOwner must be used within a CommunityOwnerContext',
    );
  }
  return value;
}

// Provider
export function CommunityOwnerProvider(
  props: React.PropsWithChildren<{
    coName: string | null;
    coDetail: CommunityOwnerDetailData | null;
  }>,
) {
  const [coName, setCoName] = React.useState<string>(props.coName || 'default');
  const onChangeCoName = (data: string) => setCoName(data);
  const router = useRouter();

  const tokenData = JWTConfig.getTokenData(
    router.asPath.includes('/merchant/'),
  );

  const merchantCode = Cookie.get(ckMerchantCode) || '';

  if (tokenData?.exp) {
    const expiredToken = isExpiredToken(tokenData?.exp || 0);
    if (expiredToken) {
      useLogoutFetcher(`${process.env.NEXT_PUBLIC_BASE_URL_API!}/${coName}`, {
        username: tokenData?.user_name || '',
      });
    }
  }

  return (
    <CommunityOwnerContext.Provider
      value={{
        coName,
        onChangeCoName,
        coDetail: props.coDetail,
        merchantCode,
      }}
    >
      {props.children}
    </CommunityOwnerContext.Provider>
  );
}

// Provider
export function CommunityOwnerAvailableProvider(
  props: React.PropsWithChildren<{
    coName: string | null;
    coDetail: CommunityOwnerDetailData | null;
  }>,
) {
  const [coName, setCoName] = React.useState<string>(props.coName || 'default');
  const onChangeCoName = (data: string) => setCoName(data);
  const router = useRouter();
  const tokenData = JWTConfig.getTokenData(
    router.asPath.includes('/merchant/'),
  );

  const merchantCode = Cookie.get(ckMerchantCode) || '';

  if (tokenData?.exp) {
    const expiredToken = isExpiredToken(tokenData?.exp || 0);
    if (expiredToken) {
      useLogoutFetcher(`${process.env.NEXT_PUBLIC_BASE_URL_API!}/${coName}`, {
        username: tokenData?.user_name || '',
      });
    }
  }

  return (
    <CommunityOwnerContext.Provider
      value={{
        coName,
        onChangeCoName,
        coDetail: props.coDetail,
        merchantCode,
      }}
    >
      {props.children}
    </CommunityOwnerContext.Provider>
  );
}
