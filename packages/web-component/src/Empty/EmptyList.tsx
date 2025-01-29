// Core
import React from 'react';
import Image from 'next/image';

// Components
import { Typography, Stack } from '@mui/material';
import NotFoundImageCO from 'asset/images/not-found-co.svg';
import NotFoundImage from 'asset/images/not-found.svg';

type EmptyListProps = {
  title: string;
  description: string;
  grayscale?: boolean;
}

export default function EmptyList(props: EmptyListProps) {
  const { title, description, grayscale = false } = props;
  return (
    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ width: '100%', height: 400 }}>
      <Stack direction="column" spacing={6}>
        <Image src={grayscale ? NotFoundImageCO : NotFoundImage} />
        <Stack direction="column" spacing={2}>
          <Typography variant="h3" align="center" fontWeight="bold">{title}</Typography>
          <Typography variant="body1" align="center">{description}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
