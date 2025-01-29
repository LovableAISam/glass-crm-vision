import React from 'react';
import Image from 'next/image';
import LogoImg from '@public/logo.png';
import { Avatar } from '@mui/material';

type LogoProps = {
  width?: string | number;
  height?: string | number;
};

const Logo = (props: LogoProps) => {
  const { width = '100%', height = 150 } = props;

  return (
    <Avatar variant="rounded" sx={{ width, height, background: 'transparent' }}>
      <Image src={LogoImg} layout="fill" objectFit="contain" />
    </Avatar>
  );
}

export default Logo;
