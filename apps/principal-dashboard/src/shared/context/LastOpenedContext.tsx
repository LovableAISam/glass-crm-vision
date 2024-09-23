import React from "react";
import { MenuType } from "../constants/menu";

export interface LastOpenedData {
  lastOpenedTabs: MenuType[];
}

const LastOpened = React.createContext<LastOpenedData>(null!);
const LastOpenedDispatch = React.createContext<React.Dispatch<LastOpenedAction>>(null!);

type LastOpenedAction =
  | {
    type: 'set-last-opened-tab';
    payload: {
      lastOpenedTabs: MenuType[];
    }
  }

function specReducer(state: LastOpenedData, action: LastOpenedAction): LastOpenedData {
  if (action.type === 'set-last-opened-tab') {
    return {
      ...state,
      lastOpenedTabs: action.payload.lastOpenedTabs,
    }
  }
  return state;
}

const initialState: LastOpenedData = {
  lastOpenedTabs: [
    {
      menuType: 'Menu',
      menuName: 'Dashboard Home',
      menuIcon: 'Home',
      menuLink: '/',
    },
  ],
};

export const LastOpenedProvider = (props: React.PropsWithChildren<{
  lastOpenedTabs?: MenuType[];
}>) => {
  const { lastOpenedTabs, children } = props;
  const [spec, dispatch] = React.useReducer(specReducer, {
    ...initialState,
    lastOpenedTabs: lastOpenedTabs || initialState.lastOpenedTabs,
  });

  return (
    <LastOpened.Provider value={spec}>
      <LastOpenedDispatch.Provider value={dispatch}>
        {children}
      </LastOpenedDispatch.Provider>
    </LastOpened.Provider>
  );
}

export function useLastOpenedSpec() {
  return React.useContext(LastOpened);
}

export function useLastOpenedSpecDispatch() {
  return React.useContext(LastOpenedDispatch);
}