import { OptionMap } from '@woi/option';
import { UploadDocumentData } from '@woi/uploadDocument';
import { createContext, Dispatch, useContext } from 'react';

// -- TYPE

export interface ModelAppCustomizationFile {
  selectedFile: UploadDocumentData | null;
  selectedImage: string | null;
}

export interface ModelAppCustomizationOnboarding extends ModelAppCustomizationFile {
  title: string;
  description: string;
}

export interface ModelAppCustomizationAppIcon extends ModelAppCustomizationFile {
  appName: string;
}

export interface ModelAppCustomization {
  themeColor: string;
  appIcon: ModelAppCustomizationAppIcon;
  splashScreen: ModelAppCustomizationFile;
  numberOfOnboarding: OptionMap<number> | null;
  onBoardingScreens: ModelAppCustomizationOnboarding[];
}

// -- FACTORY

export function AppCustomizationFile(): ModelAppCustomizationFile {
  return {
    selectedFile: null,
    selectedImage: null,
  };
}

export function AppCustomizationAppIcon(): ModelAppCustomizationAppIcon {
  return {
    appName: '',
    selectedFile: null,
    selectedImage: null,
  };
}

export function AppCustomizationOnboarding(): ModelAppCustomizationOnboarding {
  return {
    title: '<p>Your teks will appear here. Edit the text color & style</p>',
    description: '<p>You can make headline & bodytext by click enter and adjust the size.</p>',
    selectedFile: null,
    selectedImage: null,
  };
}

export function AppCustomization(): ModelAppCustomization {
  return {
    themeColor: '#aabbcc',
    appIcon: AppCustomizationAppIcon(),
    splashScreen: AppCustomizationFile(),
    numberOfOnboarding: null,
    onBoardingScreens: [],
  };
}

// -- UPDATE

export type ActionAppCustomization =
  | {
    type: 'SET_INIT_STATE';
    payload: Partial<ModelAppCustomization>;
  }
  | {
    type: 'SET_THEME_COLOR';
    payload: {
      themeColor: string;
    };
  }
  | {
    type: 'RESET_THEME_COLOR';
  }
  | {
    type: 'SET_SPLASH_SCREEN';
    payload: Partial<ModelAppCustomizationFile>;
  }
  | {
    type: 'SET_APP_ICON';
    payload: Partial<ModelAppCustomizationAppIcon>;
  }
  | {
    type: 'SET_NUMBER_OF_ONBOARDING';
    payload: {
      numberOfOnboarding: OptionMap<number> | null;
    };
  }
  | {
    type: 'REMOVE_SPLASH_SCREEN';
  }
  | {
    type: 'UPDATE_ONBOARDING_SCREEN';
    payload: {
      index: number;
      onBoardingScreen: Partial<ModelAppCustomizationOnboarding>;
    };
  };

export function AppCustomizationReducer(
  state: ModelAppCustomization = AppCustomization(),
  action: ActionAppCustomization
): ModelAppCustomization {
  switch (action.type) {
    case 'SET_INIT_STATE': {
      let prevState: ModelAppCustomization = { ...state };

      if (typeof action.payload.themeColor !== 'undefined') {
        prevState = {
          ...prevState,
          themeColor: action.payload.themeColor
        }
      }

      if (typeof action.payload.splashScreen !== 'undefined') {
        prevState = {
          ...prevState,
          splashScreen: action.payload.splashScreen
        }
      }

      if (typeof action.payload.appIcon !== 'undefined') {
        prevState = {
          ...prevState,
          appIcon: action.payload.appIcon
        }
      }

      if (typeof action.payload.numberOfOnboarding !== 'undefined') {
        prevState = {
          ...prevState,
          numberOfOnboarding: action.payload.numberOfOnboarding
        }
      }

      if (typeof action.payload.onBoardingScreens !== 'undefined') {
        prevState = {
          ...prevState,
          onBoardingScreens: action.payload.onBoardingScreens
        }
      }

      return prevState;
    }

    case 'SET_THEME_COLOR': {
      return {
        ...state,
        themeColor: action.payload.themeColor,
      };
    }

    case 'RESET_THEME_COLOR': {
      return {
        ...state,
        themeColor: '#aabbcc',
      };
    }

    case 'SET_SPLASH_SCREEN': {
      let prevState: ModelAppCustomization = { ...state };

      if (typeof action.payload.selectedFile !== 'undefined') {
        prevState = {
          ...prevState,
          splashScreen: {
            ...prevState.splashScreen,
            selectedFile: action.payload.selectedFile
          }
        }
      }

      if (typeof action.payload.selectedImage !== 'undefined') {
        prevState = {
          ...prevState,
          splashScreen: {
            ...prevState.splashScreen,
            selectedImage: action.payload.selectedImage
          }
        }
      }

      return prevState;
    }

    case 'SET_APP_ICON': {
      let prevState: ModelAppCustomization = { ...state };

      if (typeof action.payload.selectedFile !== 'undefined') {
        prevState = {
          ...prevState,
          appIcon: {
            ...prevState.appIcon,
            selectedFile: action.payload.selectedFile
          }
        }
      }

      if (typeof action.payload.selectedImage !== 'undefined') {
        prevState = {
          ...prevState,
          appIcon: {
            ...prevState.appIcon,
            selectedImage: action.payload.selectedImage
          }
        }
      }

      if (typeof action.payload.appName !== 'undefined') {
        prevState = {
          ...prevState,
          appIcon: {
            ...prevState.appIcon,
            appName: action.payload.appName
          }
        }
      }

      return prevState;
    }

    case 'SET_NUMBER_OF_ONBOARDING': {
      return {
        ...state,
        numberOfOnboarding: action.payload.numberOfOnboarding,
        onBoardingScreens: action.payload.numberOfOnboarding
          ? Array.from(Array(Number(action.payload.numberOfOnboarding.value)).keys()).map(() => AppCustomizationOnboarding())
          : [],
      };
    }

    case 'REMOVE_SPLASH_SCREEN': {
      return {
        ...state,
        splashScreen: AppCustomizationFile(),
      };
    }

    case 'UPDATE_ONBOARDING_SCREEN': {
      return {
        ...state,
        onBoardingScreens: state.onBoardingScreens.map((onBoardingScreen, index) => {
          if (index === action.payload.index) {
            let onBoardingScreenData: ModelAppCustomizationOnboarding = onBoardingScreen;
            if (typeof action.payload.onBoardingScreen.title !== 'undefined') {
              onBoardingScreenData.title = action.payload.onBoardingScreen.title;
            }
            if (typeof action.payload.onBoardingScreen.description !== 'undefined') {
              onBoardingScreenData.description = action.payload.onBoardingScreen.description;
            }
            if (typeof action.payload.onBoardingScreen.selectedFile !== 'undefined') {
              onBoardingScreenData.selectedFile = action.payload.onBoardingScreen.selectedFile;
            }
            if (typeof action.payload.onBoardingScreen.selectedImage !== 'undefined') {
              onBoardingScreenData.selectedImage = action.payload.onBoardingScreen.selectedImage;
            }
            return onBoardingScreenData;
          }
          return onBoardingScreen;
        })
      }
    }

    default:
      return state;
  }
}

// CONTEXT

export const AppCustomizationContextState = createContext(AppCustomization());
AppCustomizationContextState.displayName = 'AppCustomizationContextState';
export const AppCustomizationContextAction = createContext((() => 0) as Dispatch<ActionAppCustomization>);
AppCustomizationContextAction.displayName = 'AppCustomizationContextAction';

export function useAppCustomizationState() {
  return useContext(AppCustomizationContextState);
}

export function useAppCustomizationAction() {
  return useContext(AppCustomizationContextAction);
}

export function useAppCustomization(): [ModelAppCustomization, Dispatch<ActionAppCustomization>] {
  return [useAppCustomizationState(), useAppCustomizationAction()];
}
