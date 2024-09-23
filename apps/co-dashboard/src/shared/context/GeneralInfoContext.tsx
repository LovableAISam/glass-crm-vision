import React from "react";
import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { theme as ThemeData } from "@woi/core/utils/theme";
import { Token } from "@woi/web-component";

interface GeneralInfoColorForm {
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  info: string;
  success: string;
  text: string;
}

export interface GeneralInfoData {
  theme: Theme;
  colorForm: GeneralInfoColorForm;
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
  | {
      type: 'set-color-form';
      payload: {
        colorForm: Partial<GeneralInfoColorForm>;
      }
    }

function specReducer(state: GeneralInfoData, action: GeneralInfoAction): GeneralInfoData {
  switch (action.type) {
    case 'set-theme':
      return {
        ...state,
        theme: action.payload.theme,
      };
    case 'set-color-form':
      let theme = state.theme;
      let colorForm = state.colorForm;
      if (action.payload.colorForm.primary) {
        colorForm = { ...colorForm, primary: action.payload.colorForm.primary}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            primary: {
              ...theme.palette.primary,
              main: action.payload.colorForm.primary,
            }
          } 
        }
      }
      if (action.payload.colorForm.secondary) {
        colorForm = { ...colorForm, secondary: action.payload.colorForm.secondary}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            secondary: {
              ...theme.palette.secondary,
              main: action.payload.colorForm.secondary,
            }
          } 
        }
      }
      if (action.payload.colorForm.error) {
        colorForm = { ...colorForm, error: action.payload.colorForm.error}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            error: {
              ...theme.palette.error,
              main: action.payload.colorForm.error,
            }
          } 
        }
      }
      if (action.payload.colorForm.warning) {
        colorForm = { ...colorForm, warning: action.payload.colorForm.warning}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            warning: {
              ...theme.palette.warning,
              main: action.payload.colorForm.warning,
            }
          } 
        }
      }
      if (action.payload.colorForm.info) {
        colorForm = { ...colorForm, info: action.payload.colorForm.info}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            info: {
              ...theme.palette.info,
              main: action.payload.colorForm.info,
            }
          } 
        }
      }
      if (action.payload.colorForm.success) {
        colorForm = { ...colorForm, success: action.payload.colorForm.success}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            success: {
              ...theme.palette.success,
              main: action.payload.colorForm.success,
            }
          } 
        }
      }
      if (action.payload.colorForm.text) {
        colorForm = { ...colorForm, text: action.payload.colorForm.text}
        theme = { 
          ...theme, 
          palette: {
            ...theme.palette,
            text: {
              ...theme.palette.text,
              primary: action.payload.colorForm.text,
            }
          } 
        }
      }

      return {
        ...state,
        colorForm,
        theme,
      };
    default:
      return state;
  }
}

const initialState: GeneralInfoData = {
  theme: ThemeData,
  colorForm: {
    primary: Token.color.primaryBlue,
    secondary: Token.color.secondaryBlueTintLightest,
    error: Token.color.redDark,
    warning: Token.color.orangeDark,
    info: Token.color.secondaryBlueTintLight,
    success: Token.color.greenDark,
    text: Token.color.primaryBlack,
  }
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