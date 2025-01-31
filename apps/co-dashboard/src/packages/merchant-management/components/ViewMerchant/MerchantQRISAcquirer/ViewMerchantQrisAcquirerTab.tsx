import { MerchantDetail } from '@woi/service/co/merchant/merchantDetail';
import dynamic from 'next/dynamic';

const MerchantData = dynamic(() => import('./content/MerchantData'));
const MerchantData2 = dynamic(() => import('./content/MerchantData2'));
const SettlementInformation = dynamic(
  () => import('./content/SettlementInformation'),
);

export type ViewMerchantQrisAcquirerTabProps = {
  activeTab: number;
  merchantDetail: MerchantDetail | null;
  qrContent: string | undefined;
};

function ViewMerchantQrisAcquirerTab(props: ViewMerchantQrisAcquirerTabProps) {
  const { activeTab } = props;

  switch (activeTab) {
    case 0:
      // @ts-ignore
      return <MerchantData {...props} />;
    case 1:
      // @ts-ignore
      return <MerchantData2 {...props} />;
    case 2:
      // @ts-ignore
      return <SettlementInformation {...props} />;
    default:
      return null;
  }
}

export default ViewMerchantQrisAcquirerTab;
