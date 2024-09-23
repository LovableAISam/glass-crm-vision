import { Box } from '@mui/material';
import useTheme from '@mui/styles/useTheme';

export default function HeaderAuth() {
  const theme = useTheme();

  return (
    <Box
      position="absolute"
      color="default"
      sx={{
        position: 'relative',
        borderBottom: t => `1px solid ${t.palette.divider}`,
        // @ts-ignore
        background: theme.palette.primary.gradient1,
      }}
      style={{ height: 24 }}
    />
  );
}
