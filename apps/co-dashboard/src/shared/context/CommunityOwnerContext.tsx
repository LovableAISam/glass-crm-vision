// Cores
import { CommunityOwnerDetailData } from '@woi/service/co/admin/communityOwner/communityOwnerDetail';
import React, { createContext, useContext } from 'react';

export const CommunityOwnerContext = createContext<{
  coName: string;
  onChangeCoName: (coName: string) => void;
  coDetail: CommunityOwnerDetailData | null;
}>({ coName: 'default', onChangeCoName: () => null, coDetail: null });

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

  return (
    <CommunityOwnerContext.Provider
      value={{ coName, onChangeCoName, coDetail: props.coDetail }}
    >
      {props.children}
    </CommunityOwnerContext.Provider>
  );
}
