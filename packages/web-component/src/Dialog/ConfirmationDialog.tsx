import React from 'react';

import ConfirmationModal from '../Modal/ConfirmationModal';
import { ButtonProps } from '@mui/material';

type ConfirmationContext = {
  openDialog: (form: ConfirmationForm) => void;
};

type ConfirmationForm = {
  title: string;
  message: string;
  actionCallback: (open: boolean) => void;
  primaryText: string;
  secondaryText: string;
  btnPrimaryIcon: string;
  btnPrimaryColor: ButtonProps['color'];
  btnSecondaryColor: ButtonProps['color'];
  disableBtnSecondary?: boolean
};

type ConfirmationDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  onClose: () => void;
  title: string;
  message: string;
  primaryText: string;
  secondaryText: string;
  btnPrimaryIcon?: React.ReactNode;
  btnSecondaryIcon?: React.ReactNode;
  btnPrimaryColor?: ButtonProps['color'];
  btnSecondaryColor?: ButtonProps['color'];
  disableBtnSecondary?: boolean;
};

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onDismiss,
  onClose,
  primaryText,
  secondaryText,
  btnPrimaryIcon,
  btnPrimaryColor,
  btnSecondaryColor,
  disableBtnSecondary
}: ConfirmationDialogProps) => {
  return (
    <ConfirmationModal
      title={title}
      subtitle={message}
      btnPrimaryText={primaryText || 'Ya'}
      btnSecondaryText={secondaryText || 'Tidak'}
      btnPrimaryIcon={btnPrimaryIcon}
      isOpen={open}
      handlePrimary={onConfirm}
      handleSecondary={onDismiss}
      btnPrimaryColor={btnPrimaryColor}
      btnSecondaryColor={btnSecondaryColor}
      handleClose={onClose}
      disableBtnSecondary={disableBtnSecondary}
    />
  );
};

const ConfirmationDialogContext = React.createContext<ConfirmationContext>({
  openDialog: () => {},
});

const ConfirmationDialogProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] =
    React.useState<ConfirmationForm | null>(null);

  const openDialog = ({
    title,
    message,
    actionCallback,
    primaryText,
    secondaryText,
    btnPrimaryIcon,
    btnPrimaryColor,
    btnSecondaryColor,
    disableBtnSecondary
  }: ConfirmationForm) => {
    setDialogOpen(true);
    setDialogConfig({
      title,
      message,
      actionCallback,
      primaryText,
      secondaryText,
      btnPrimaryIcon,
      btnPrimaryColor,
      btnSecondaryColor,
      disableBtnSecondary
    });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig(null);
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig?.actionCallback(true);
  };

  const onDismiss = () => {
    dialogConfig?.actionCallback(false);
    resetDialog();
  };

  const onClose = () => {
    resetDialog();
  };

  return (
    <ConfirmationDialogContext.Provider value={{ openDialog }}>
      {dialogOpen && dialogConfig && (
        <ConfirmationDialog
          open={dialogOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          primaryText={dialogConfig.primaryText}
          secondaryText={dialogConfig.secondaryText}
          btnPrimaryIcon={dialogConfig.btnPrimaryIcon}
          onConfirm={onConfirm}
          onDismiss={onDismiss}
          onClose={onClose}
          btnPrimaryColor={dialogConfig.btnPrimaryColor}
          btnSecondaryColor={dialogConfig.btnSecondaryColor}
          disableBtnSecondary={dialogConfig.disableBtnSecondary}
        />
      )}
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

const useConfirmationDialog = () => {
  const { openDialog } = React.useContext(ConfirmationDialogContext);

  const getConfirmation = ({
    ...options
  }: Partial<Omit<ConfirmationForm, 'actionCallback'>>) =>
    new Promise<boolean>(res => {
      openDialog({
        actionCallback: res,
        ...options,
        title: options.title || '',
        message: options.message || '',
        primaryText: options.primaryText || '',
        secondaryText: options.secondaryText || '',
        btnPrimaryIcon: options.btnPrimaryIcon || '',
        btnPrimaryColor: options.btnPrimaryColor,
        btnSecondaryColor: options.btnSecondaryColor,
        disableBtnSecondary: options.disableBtnSecondary,
      });
    });

  return { getConfirmation };
};

export default ConfirmationDialog;
export { ConfirmationDialogProvider, useConfirmationDialog };
