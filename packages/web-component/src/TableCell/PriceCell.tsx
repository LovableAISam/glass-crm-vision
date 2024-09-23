import { Typography } from '@mui/material';
import { PriceConverter } from '@woi/core';
import React from 'react';

type PriceCellProps = {
  value: number;
  router: any;
};

const PriceCell: React.FC<PriceCellProps> = ({ value, router }) => {
  return (
    <Typography variant="inherit" key="feeCommision">
      {PriceConverter.formatPrice(value, router.locale)}
    </Typography>
  );
};

export default PriceCell;
