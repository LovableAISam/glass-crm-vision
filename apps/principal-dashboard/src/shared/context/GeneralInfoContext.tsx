import React from "react";
import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { theme as ThemeData } from "@woi/core/utils/theme";

export interface GeneralInfoData {
  theme: Theme;
}

const GeneralInfo = React.createContext<GeneralInfoData>(null!);
const GeneralInfoDispatch = React.createContext<React.Dispatch<GeneralInfoAction>>(null!);

type GeneralInfoAction =
  | {
    type: 'set-theme';
    payload: {
      theme: Theme;
    }
  }

function specReducer(state: GeneralInfoData, action: GeneralInfoAction): GeneralInfoData {
  if (action.type === 'set-theme') {
    return {
      ...state,
      theme: action.payload.theme,
    };
  }
  return state;
}

const initialState: GeneralInfoData = {
  theme: ThemeData,
};

export const GeneralInfoProvider = (props: React.PropsWithChildren<{
  theme: Theme;
}>) => {
  const { theme, children } = props;
  const [spec, dispatch] = React.useReducer(specReducer, {
    ...initialState,
    theme,
  });

  return (
    <GeneralInfo.Provider value={spec}>
      <GeneralInfoDispatch.Provider value={dispatch}>
        <ThemeProvider theme={createTheme(spec.theme)}>
          {children}
        </ThemeProvider>
      </GeneralInfoDispatch.Provider>
    </GeneralInfo.Provider>
  );
}

export function useGeneralInfoSpec() {
  return React.useContext(GeneralInfo);
}

export function useGeneralInfoSpecDispatch() {
  return React.useContext(GeneralInfoDispatch);
}