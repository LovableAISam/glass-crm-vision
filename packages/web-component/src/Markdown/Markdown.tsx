import React, { ComponentProps } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { Typography, Link, TypographyProps } from '@mui/material';
import { css } from '@emotion/css';

interface MarkdownProps extends ComponentProps<typeof ReactMarkdown> {
  typographyProps?: TypographyProps;
}

export default function Markdown(props: MarkdownProps) {
  const { typographyProps, ...markdownProps } = props;
  return (
    <ReactMarkdown
      options={{
        overrides: {
          h1: {
            component: Typography,
            props: {
              variant: 'h5',
            },
          },
          h2: { component: Typography, props: { variant: 'h6' } },
          h3: { component: Typography, props: { variant: 'subtitle1' } },
          h4: {
            component: Typography,
            props: { variant: 'caption', paragraph: true },
          },
          p: {
            component: Typography,
            props: {
              paragraph: false,
              className: css`
                word-wrap: break-word;
              `,
              ...typographyProps,
            },
          },
          a: { component: Link },
          table: {
            component: props => (
              <table
                {...props}
                className={css`
                  width: 100%;
                `}
              />
            ),
          },
          tr: {
            component: props => (
              <tr
                {...props}
                className={css`
                  width: 100%;
                `}
              />
            ),
          },
        },
      }}
      {...markdownProps}
    />
  );
}
