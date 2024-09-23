import React from 'react';
import DashboardContainer from '@src/shared/components/Container/DashboardContainer';
import MerchantMasterList from '@src/packages/merchant-master/MerchantMasterList';

const MerchantMasterPage = () => (
  <DashboardContainer>
    <MerchantMasterList />
  </DashboardContainer>
)

export default MerchantMasterPage;
