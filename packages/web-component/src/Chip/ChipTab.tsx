import { useState } from 'react';
import { Typography, Stack, Card, CardProps, IconButton } from '@mui/material';
import { Token } from '@woi/web-component';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

interface ChipTabProps extends CardProps {
  label: string;
  active: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function ChipTab(props: ChipTabProps) {
  const { label, active, onClick, onDelete, ...cardProps } = props;
  const [hovered, setHovered] = useState<boolean>(false);

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete();
    }
  };

  return (
    <Card
      {...cardProps}
      sx={theme => ({
        background:
          active || hovered
            ? theme.palette.primary.main
            : Token.color.greyscaleGreyWhite,
        px: 2,
        py: 1,
        borderRadius: 2,
        minWidth: 220,
        cursor: active ? 'auto' : 'pointer',
        boxShadow: '0px 2px 8px rgba(137, 168, 191, 0.25)',
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          // @ts-ignore
          variant="subtitle3"
          sx={theme => ({
            color:
              active || hovered
                ? Token.color.greyscaleGreyWhite
                : theme.palette.primary.main,
            '&:hover': {
              color: Token.color.greyscaleGreyWhite,
            },
          })}
        >
          {label}
        </Typography>
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={active}
        >
          {active ? (
            <CheckIcon
              sx={theme => ({
                color:
                  active || hovered
                    ? Token.color.greyscaleGreyWhite
                    : theme.palette.primary.main,
              })}
            />
          ) : (
            <CloseIcon
              sx={theme => ({
                color:
                  active || hovered
                    ? Token.color.greyscaleGreyWhite
                    : theme.palette.primary.main,
              })}
            />
          )}
        </IconButton>
      </Stack>
    </Card>
  );
}
