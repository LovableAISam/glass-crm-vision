// Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { DateConvert } from "@woi/core";
import { LONG_DATE_TIME_FORMAT } from "@woi/core/utils/date/constants";
import { PriceCell } from "@woi/web-component";

// Hooks & Utils
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';

// Types & Consts
import { QRDynamicStatusResponse } from "@woi/service/co/merchant/merchantQRDynamicStatus";

type ViewStatusModalProps = {
  isActive: boolean;
  onHide: () => void;
  onHideModalQR: () => void;
  showModalQR: () => void;
  handleReset: () => void;
  isLoading: boolean;
  dataStatus: QRDynamicStatusResponse;
};

interface StyledTableRowProps {
  isEven?: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&:first-of-type': {
    width: '30%',
  },
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isEven',
})<StyledTableRowProps>(({ theme, isEven }) => ({
  '& > td': {
    backgroundColor: isEven ? theme.palette.grey[100] : theme.palette.common.white,
  }
}));

const ViewStatusModal = (props: ViewStatusModalProps) => {
  const { isActive, onHide, isLoading, dataStatus, onHideModalQR, showModalQR, handleReset } = props;
  const { status, amount, cpan, mpan, issuerName, date, rrn } = dataStatus;

  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');

  const rows = [
    { label: tAccount('detailStatus'), value: status || '-', type: 'text' },
    { label: tAccount('detailAmount'), value: amount, type: 'amount' },
    { label: tAccount('detailCPAN'), value: cpan || '-', type: 'text' },
    { label: tAccount('detailMPAN'), value: mpan || '-', type: 'text' },
    { label: tAccount('detailIssuerName'), value: issuerName || '-', type: 'text' },
    { label: tAccount('detailDate'), value: date || '-', type: 'date' },
    { label: tAccount('detailRRN'), value: rrn || '-', type: 'text' }
  ];

  return (
    <Dialog
      open={isActive}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row">
          <Typography variant="h4">{tAccount('titleCheckStatusQRIS')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={0} sx={{ mt: 1 }}>
          <Table>
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow
                  key={row.label}
                  isEven={index % 2 === 1}
                >
                  <StyledTableCell>
                    <Typography variant="subtitle1">{row.label}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="body1">{
                      row.type === 'amount' ?
                        <PriceCell value={Number(row.value)} router={router} /> :
                        row.type === 'date' ?
                          DateConvert.stringToDateFormat(String(row.value), LONG_DATE_TIME_FORMAT) : row.value}</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          p={4}
          alignItems="center"
          justifyContent="center"
          width='100%'
        >
          <Button
            variant="outlined"
            onClick={() => {
              if (status.toUpperCase() === "OPEN") {
                // Back Button
                showModalQR();
                onHide();
              } else {
                // Close Button 
                onHideModalQR();
                handleReset();
              }
            }}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
            disabled={isLoading}
          >
            {status.toUpperCase() === "OPEN" ? tCommon('actionBack') : tCommon('actionClose')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStatusModal;
