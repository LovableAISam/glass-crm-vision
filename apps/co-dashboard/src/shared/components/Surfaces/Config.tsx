import React, { useMemo, useReducer } from 'react';
import { Drawer, Stack, Typography } from "@mui/material";
import { useGeneralInfoSpec, useGeneralInfoSpecDispatch } from '@src/shared/context/GeneralInfoContext';
import { FormColor } from '@woi/web-component';

const drawerWidth = 320;

interface ConfigState {
  isOpened: boolean;
}

const initialState: ConfigState = {
  isOpened: false,
};

const OPEN_POPUP_CONFIG = 'OPEN_POPUP_CONFIG';
const CLOSE_POPUP_LOGIN_CONFIG = 'CLOSE_POPUP_LOGIN_CONFIG';

const ConfigContext = React.createContext({
  state: initialState,
  actions: {
    openPopup: () => {
      /* do nothing */
    },
    closePopup: () => {
      /* do nothing */
    },
  },
});

function openPopupAction() {
  return {
    type: OPEN_POPUP_CONFIG,
  };
}

function closePopupAction() {
  return {
    type: CLOSE_POPUP_LOGIN_CONFIG,
  };
}

function reducer(state: ConfigState, action: any) {
  switch (action.type) {
    case OPEN_POPUP_CONFIG:
      return { ...state, isOpened: true };
    case CLOSE_POPUP_LOGIN_CONFIG:
      return { ...state, isOpened: false };
    default:
      return state;
  }
}

type ConfigProps = {
  children: React.ReactNode;
}

export function ConfigProvider({ children }: ConfigProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { colorForm } = useGeneralInfoSpec();
  const dispatchGeneralInfo = useGeneralInfoSpecDispatch();

  const actions = useMemo(
    () => ({
      openPopup: () => dispatch(openPopupAction()),
      closePopup: () => dispatch(closePopupAction()),
    }),
    [dispatch]
  );

  const drawer = (
    <Stack direction="column" spacing={2} sx={{ p: 2 }}>
      <Typography variant="subtitle1">Config</Typography>
      <FormColor
        title="Primary Color"
        value={colorForm.primary}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              primary: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <FormColor
        title="Secondary Color"
        value={colorForm.secondary}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              secondary: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <FormColor
        title="Error Color"
        value={colorForm.error}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              error: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <FormColor
        title="Warning Color"
        value={colorForm.warning}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              warning: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <FormColor
        title="Info Color"
        value={colorForm.info}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              info: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <FormColor
        title="Success Color"
        value={colorForm.success}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              success: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <FormColor
        title="Text Color"
        value={colorForm.text}
        onChange={(value: string) => dispatchGeneralInfo({
          type: 'set-color-form',
          payload: {
            colorForm: {
              text: value
            }
          }
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
    </Stack>
  )

  return (
    <ConfigContext.Provider value={{ state, actions }}>
      <Drawer
        variant="temporary"
        anchor="right"
        open={state.isOpened}
        onClose={actions.closePopup}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfigState() {
  return React.useContext(ConfigContext);
}