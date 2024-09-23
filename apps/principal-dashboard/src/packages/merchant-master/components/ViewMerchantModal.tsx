import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';

interface MercantData {
  merchantCode: string;
  merchantVA: string;
  merchantName: string;
  username: string;
  email: string;
  apiLink: string;
  effectiveDate: string;
  useLoyalty: string;
  status: string;
}

type ViewMerchantModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const ViewMerchantModal = (props: ViewMerchantModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const [merchantData] = useState<MercantData>({
    merchantCode: 'Thu.301239719004123',
    merchantVA: '03167218938910',
    merchantName: 'Jamob WOI',
    username: 'Jamob',
    email: 'jamobwoi@gmail.com',
    apiLink: '-',
    effectiveDate: '2 Nov 2019 - 15 Jan 2020',
    useLoyalty: 'NO',
    status: 'Active',
  })

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{ 
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">View Merchant</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} rowSpacing={4} sx={{ pt: 1 }}>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Merchant Code</Typography>
              <Typography variant="subtitle2">{merchantData.merchantCode}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Merchant VA</Typography>
              <Typography variant="subtitle2">{merchantData.merchantVA}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Merchant Name</Typography>
              <Typography variant="subtitle2">{merchantData.merchantName}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Username</Typography>
              <Typography variant="subtitle2">{merchantData.username}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Email</Typography>
              <Typography variant="subtitle2">{merchantData.email}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Api Link</Typography>
              <Typography variant="subtitle2">{merchantData.apiLink}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Effective Date</Typography>
              <Typography variant="subtitle2">{merchantData.effectiveDate}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Use Loyalty</Typography>
              <Typography variant="subtitle2">{merchantData.useLoyalty}</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">Status</Typography>
              <Typography variant="subtitle2">{merchantData.status}</Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default ViewMerchantModal;