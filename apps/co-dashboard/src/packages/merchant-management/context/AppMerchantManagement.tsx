import { UploadDocumentData } from '@woi/uploadDocument';
import { createContext, Dispatch, useContext } from 'react';

// -- TYPE
export interface ModelData {
  selectedFile: UploadDocumentData | null;
  selectedImage: string | null;
}

export interface ModelPhotoLogoContext {
  photoLogo: ModelData;
}

const photoLogoDefault: ModelData = {
  selectedFile: null,
  selectedImage: null,
};

export const photoLogoContext: ModelPhotoLogoContext = {
  photoLogo: photoLogoDefault,
};

// -- UPDATE

export type ActionMerchantManagement = {
  type: 'SET_LOGO';
  payload: Partial<ModelData>;
};

export function AppMerchantManagement(
  state: ModelPhotoLogoContext,
  action: ActionMerchantManagement,
): ModelPhotoLogoContext {
  switch (action.type) {
    case 'SET_LOGO': {
      let prevState: ModelPhotoLogoContext = { ...state };

      if (typeof action.payload.selectedFile !== 'undefined') {
        prevState = {
          ...prevState,
          photoLogo: {
            ...prevState.photoLogo,
            selectedFile: action.payload.selectedFile,
          },
        };
      }

      if (typeof action.payload.selectedImage !== 'undefined') {
        prevState = {
          ...prevState,
          photoLogo: {
            ...prevState.photoLogo,
            selectedImage: action.payload.selectedImage,
          },
        };
      }

      return prevState;
    }

    default:
      return state;
  }
}

// CONTEXT

export const appMerchantManagementContextState =
  createContext(photoLogoContext);
appMerchantManagementContextState.displayName =
  'appMerchantManagementContextState';

export function useAppMerchantManagementState() {
  return useContext(appMerchantManagementContextState);
}

export const AppMerchantManagementAction = createContext(
  (() => 0) as Dispatch<ActionMerchantManagement>,
);

AppMerchantManagementAction.displayName = 'AppMerchantManagementAction';

export function useAppMerhcantManagementAction() {
  return useContext(AppMerchantManagementAction);
}

export function useAppMerhcantManagement(): [
  ModelPhotoLogoContext,
  Dispatch<ActionMerchantManagement>,
] {
  return [useAppMerchantManagementState(), useAppMerhcantManagementAction()];
}
