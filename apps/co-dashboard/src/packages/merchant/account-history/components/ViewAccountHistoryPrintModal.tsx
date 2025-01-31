// Component
import { Dialog } from '@mui/material';
import { LegacyRef } from 'react';

type ViewAccountHistoryPrintModalProps = {
  isActive: boolean;
  onHide: () => void;
  iframeRef: LegacyRef<HTMLIFrameElement> | undefined;
  pdfUrl: string;
};

const ViewAccountHistoryPrintModal = (
  props: ViewAccountHistoryPrintModalProps,
) => {
  const { isActive, onHide, iframeRef, pdfUrl } = props;

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="md"
      fullWidth
    >
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="PDF Viewer"
      />
    </Dialog>
  );
};

export default ViewAccountHistoryPrintModal;
