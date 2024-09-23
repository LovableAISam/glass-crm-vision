import React, { useState, useEffect, useContext } from 'react';
import Page404 from '@src/pages/404';

const OnlineStatusContext = React.createContext(true);

interface OnlineStatusProviderProps {
  children: React.ReactNode;
  coName: string | null;
}

export const OnlineStatusProvider: React.FC<OnlineStatusProviderProps> = ({
  children,
  coName,
}) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {coName === 'co' ? children : <Page404 />}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};
