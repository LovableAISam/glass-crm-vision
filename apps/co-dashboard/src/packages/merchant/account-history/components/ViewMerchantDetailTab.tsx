import { AccountHistoryDetailData } from "@woi/service/co/merchant/merchantAccountHistoryDetail";
import dynamic from 'next/dynamic';

const DetailMerchantQRISAcquirer = dynamic(() => import('./ViewMerchantDetail/MerchantQRISAcquirer'));
const DetailMerchantAccountBIndiProps = dynamic(() => import('./ViewMerchantDetail/MerchantAccountBinding'));
const DetailMerchantPartner = dynamic(() => import('./ViewMerchantDetail/MerchantPartner'));

export type ViewMerchantDetailTabProps = {
  isActive: boolean;
  onHide: () => void;
  merchantCode: string;
  accountHistoryDetail: AccountHistoryDetailData | null;
};

function ViewMerchantDetailTab(props: ViewMerchantDetailTabProps) {
  const { merchantCode } = props;

  if (merchantCode.startsWith('ME')) {
    // Jika merchantCode dimulai dengan 'ME'
    // @ts-ignore
    return <DetailMerchantQRISAcquirer {...props} />;
  } else if (merchantCode.startsWith('MAC')) {
    // Jika merchantCode dimulai dengan 'MAC'
    // @ts-ignore
    return <DetailMerchantAccountBIndiProps {...props} />;
  } else {
    // Selain itu, tampilkan komponen DetailMerchantPartner
    // @ts-ignore
    return <DetailMerchantPartner {...props} />;
  }
}

export default ViewMerchantDetailTab;
