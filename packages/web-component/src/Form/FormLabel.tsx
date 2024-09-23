import { Grid, Typography, TypographyProps } from "@mui/material";
import React, { ComponentProps } from "react";
import Token from "../Token";

export type FormLabelRenderMethods = {
  isFocused?: () => boolean;
  onFocus: () => void;
  onBlur: () => void;
};

type FormLabelProps = ComponentProps<typeof Grid> & {
  inputLabel: string | React.ReactNode;
  mandatoryLabel?: boolean;
  labelStyle?: TypographyProps;
  descriptionLabel?: string;
  children: (methods: FormLabelRenderMethods) => React.ReactElement;
};

export default function FormLabel(props: FormLabelProps) {
  const { inputLabel, labelStyle, direction } = props;
  const [focus, setFocus] = React.useState<boolean>(false);

  return (
    <Grid
      container
      spacing={3}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Grid item xs>
        {typeof inputLabel === "string" ? (
          <Typography
            {...labelStyle}
            variant="body2"
            color={(theme) =>
              focus ? theme.palette.primary.main : Token.color.greyscaleGreyDarkest
            }
          >
            {inputLabel}
            {props?.mandatoryLabel ? "*" : null}
          </Typography>
        ) : (
          inputLabel
        )}
        {props?.descriptionLabel && (
          <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
            {props.descriptionLabel}
          </Typography>
        )}
      </Grid>
      <Grid item xs={9} sx={direction === 'column' ? { width: '100%' } : {}}>
        {props.children({
          isFocused: () => {
            return focus;
          },
          onFocus: () => setFocus(true),
          onBlur: () => setFocus(false),
        })}
      </Grid>
    </Grid>
  );
}
