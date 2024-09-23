import { PaletteMode } from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Token } from '@woi/web-component';

export const typographyTheme: ThemeOptions['typography'] = {
  fontFamily: ['Montserrat'].join(','),
  h1: {
    fontSize: 48,
    fontWeight: 500,
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  h2: {
    fontSize: 32,
    fontWeight: 500,
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  h3: {
    fontSize: 24,
    fontWeight: 500,
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  h4: {
    fontSize: 20,
    fontWeight: 500,
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  h5: {
    fontSize: 18,
    fontWeight: 500,
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  // @ts-ignore
  subtitle3: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textTransform: 'capitalize'
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal'
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal'
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal'
  },
  caption2: {
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal'
  },
  overline: {
    fontSize: 10,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textTransform: 'uppercase'
  }
}

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#3554F6',
            dark: '#263DB2'
          },
          secondary: {
            main: '#F2F4FF',
          },
          warning: {
            main: '#FB902D',
          },
          error: {
            main: '#DC4531',
          },
          success: {
            main: '#3DAF43',
          },
        }
      : {
          primary: {
            main: '#3554F6',
            dark: '#263DB2'
          },
          secondary: {
            main: '#F2F4FF',
          },
          warning: {
            main: '#FB902D',
          },
          error: {
            main: '#DC4531',
          },
          success: {
            main: '#3DAF43',
          },
        }
    ),
  },
  typography: typographyTheme
});

const pureTheme = {
  palette: {
    primary: {
      main: Token.color.primaryBlue,
      dark: '#263DB2',
      light: '#F2F4FF',
      gradient1: 'linear-gradient(113.96deg, #1C98F2 0%, #263DB2 100%);',
      gradient2: 'linear-gradient(113.96deg, #8598FF 0%, #1C98F2 100%);',
    },
    secondary: {
      main: Token.color.secondaryBlueTintLightest,
    },
    warning: {
      main: Token.color.orangeDark,
    },
    error: {
      main: Token.color.redDark,
    },
    success: {
      main: Token.color.greenDark,
    },
    info: {
      main: Token.color.secondaryBlueTintLight
    },
    text: {
      primary: Token.color.primaryBlack,
      secondary: Token.color.greyscaleGreyDarkest,
    }
  },
  typography: typographyTheme
};

export const theme = createTheme(pureTheme);

export default pureTheme;
