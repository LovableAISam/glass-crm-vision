import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import { Button } from '@woi/web-component';
import StyledMenu from './StyledMenu';

type MenuItemRenderMethods = {
  handleClose?: () => void;
};

type StyledMenuItemProps = {
  title?: string;
  iconLeft?: React.ReactNode;
  children: (methods: MenuItemRenderMethods) => React.ReactElement;
};

const StyledMenuItem = (props: StyledMenuItemProps) => {
  const { title, iconLeft, children } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();

  return (
    <>
      {title ? (
        <Button
          id="demo-customized-button"
          aria-controls="demo-customized-menu"
          color="primary"
          aria-haspopup="true"
          aria-expanded={open && 'true'}
          variant="text"
          disableElevation
          onClick={handleClick}
          endIcon={title && <KeyboardArrowDownIcon />}
        >
          <Stack direction="row" justifyContent="center" alignContent="center">
            {iconLeft}
            <Stack direction="column" justifyContent="center" alignContent="center">
              <Typography variant="subtitle2">{title}</Typography>
            </Stack>
          </Stack>
        </Button>
      ) : (
        <IconButton
          id="demo-customized-button"
          aria-controls="demo-customized-menu"
          aria-haspopup="true"
          aria-expanded={open && 'true'}
          onClick={handleClick}
        >
          <KeyboardArrowDownIcon sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      )}
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children({
          handleClose,
        })}
      </StyledMenu>
    </>
  );
}

export default StyledMenuItem;
