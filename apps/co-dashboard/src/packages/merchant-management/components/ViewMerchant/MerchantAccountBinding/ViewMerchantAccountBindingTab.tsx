import { MerchantDetail } from '@woi/service/co/merchant/merchantDetail';
import dynamic from 'next/dynamic';

const MerchantData = dynamic(() => import('./content/MerchantData'));
const SettlementInformation = dynamic(
  () => import('./content/SettlementInformation'),
);

export type ViewMerchantAccountBindingTabProps = {
  activeTab: number;
  merchantDetail: MerchantDetail | null;
};

function ViewMerchantAccountBindingTab(props: ViewMerchantAccountBindingTabProps) {
  const { activeTab } = props;

  switch (activeTab) {
    case 0:
      // @ts-ignore
      return <MerchantData {...props} />;
    case 1:
      // @ts-ignore
      return <SettlementInformation {...props} />;
    default:
      return null;
  }
}

export default ViewMerchantAccountBindingTab;
