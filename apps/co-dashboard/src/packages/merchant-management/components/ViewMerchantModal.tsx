//Core
import { useState } from 'react';

// Component
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ViewMerchantQrisAcquirerTab from './ViewMerchant/MerchantQRISAcquirer/ViewMerchantQrisAcquirerTab';
import ViewMerchantAccountBindingTab from './ViewMerchant/MerchantAccountBinding/ViewMerchantAccountBindingTab';

// Hooks & Utils
import { useTranslation } from 'react-i18next';

// Types & Consts
import { MerchantDetail } from '@woi/service/co/merchant/merchantDetail';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ViewMerchantPartnerTab from './ViewMerchant/MerchantPartner/ViewMerchantPartnerTab';

type ViewMerchantModalProps = {
  isActive: boolean;
  onHide: () => void;
  merchantDetail: MerchantDetail | null;
  qrContent: string | undefined;
};

const ViewMerchantModal = (props: ViewMerchantModalProps) => {
  const { isActive, onHide, merchantDetail, qrContent } = props;

  const { t: tMerchant } = useTranslation('merchant');

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{tMerchant('modalViewTitle')}</Typography>
          <IconButton data-testid="closeButton" onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Box
            sx={{ width: '100%', bgcolor: 'background.paper', mt: 2, px: 2 }}
          >
            {merchantDetail?.merchantFuntionId !==
              'Merchant Third Party/Business Partner' && (
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                variant="fullWidth"
                centered
                sx={{ mb: 2 }}
              >
                <Tab
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StorefrontIcon />
                      {/** @ts-ignore */}
                      <Typography variant="subtitle3">
                        {tMerchant('detailTabMerchantData')}
                      </Typography>
                    </Stack>
                  }
                />
                {merchantDetail?.merchantFuntionId ===
                  'Merchant QRIS Acquirer' && (
                  <Tab
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ReceiptLongIcon />
                        {/** @ts-ignore */}
                        <Typography variant="subtitle3">
                          {tMerchant('detailTabMerchantData2')}
                        </Typography>
                      </Stack>
                    }
                  />
                )}
                <Tab
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SupervisedUserCircleIcon />
                      {/** @ts-ignore */}
                      <Typography variant="subtitle3">
                        {tMerchant('detailTabSettlementInfo')}
                      </Typography>
                    </Stack>
                  }
                />
              </Tabs>
            )}

            {/* Merchant QRIS Acquirer */}
            {merchantDetail?.merchantFuntionId === 'Merchant QRIS Acquirer' && (
              <ViewMerchantQrisAcquirerTab
                activeTab={activeTab}
                merchantDetail={merchantDetail}
                qrContent={qrContent}
              />
            )}

            {/* Merchant Account Binding */}
            {merchantDetail?.merchantFuntionId ===
              'Merchant Account Binding' && (
              <ViewMerchantAccountBindingTab
                activeTab={activeTab}
                merchantDetail={merchantDetail}
              />
            )}

            {/* Merchant Third Party/Business Partner */}
            {merchantDetail?.merchantFuntionId ===
              'Merchant Third Party/Business Partner' && (
              <ViewMerchantPartnerTab merchantDetail={merchantDetail} />
            )}
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMerchantModal;
