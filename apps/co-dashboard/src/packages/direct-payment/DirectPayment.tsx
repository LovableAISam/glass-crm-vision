import React, { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import DialogDirectPayment from './components/DialogDirectPayment';
import { useForm } from 'react-hook-form';
import useModal from '@woi/common/hooks/useModal';

// Icons
import LogoImage from 'asset/images/logo.svg';
import { OTPInput } from '@woi/web-component';

type FormValues = {
  phoneNumber: string;
  pin: string | null;
  otp: string;
};

const DirectPayment = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [word, setWord] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(1);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phoneNumber: '',
      pin: null,
    },
  });

  const onSubmit = async () => {
    setActiveStep(2);
  };

  return (
    <Stack justifyContent="center" alignItems="center">
      <Card
        sx={{
          background: '#E6F7FF',
          width: '60%',
          borderRadius: '40px',
        }}
        elevation={0}
      >
        {activeStep === 1 ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={4}
            >
              <Image src={LogoImage} width={100} height={100} />
              <Grid
                container
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
                xs={6}
                md={6}
                xl={6}
                item
              >
                <Grid item width="100%">
                  <Typography variant="subtitle2" gutterBottom>
                    Phone Number
                  </Typography>
                  <TextField
                    {...register('phoneNumber', {
                      required: 'Phone number must be filled.',
                    })}
                    error={Boolean(errors.phoneNumber)}
                    placeholder="Enter your WOI phone no"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                        height: '40px',
                      },
                      height: '40px',
                    }}
                  />
                </Grid>
                <Grid item width="100%">
                  <Typography variant="subtitle2" gutterBottom>
                    PIN
                  </Typography>
                  <TextField
                    {...register('pin', {
                      required: 'PIN must be filled.',
                    })}
                    error={Boolean(errors.pin)}
                    placeholder="Enter your WOI PIN"
                    fullWidth
                    type="password"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                        height: '40px',
                      },
                      height: '40px',
                    }}
                    inputProps={{ maxLength: 6 }}
                  />
                </Grid>
                <Grid item alignSelf="end">
                  <Typography
                    variant="inherit"
                    color={theme => theme.palette.primary.main}
                    component="span"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setWord('Please change your PIN  using WOI App');
                      showModal();
                    }}
                  >
                    Forgot PIN?
                  </Typography>
                </Grid>
              </Grid>
              <List
                component="nav"
                style={{
                  width: '70%',
                }}
              >
                <Divider />
                <ListItem>
                  <Typography variant="subtitle1" component="span">
                    Total
                  </Typography>
                </ListItem>
                <ListItem style={{ justifyContent: 'space-between' }}>
                  <Typography variant="body1" component="span">
                    McDonald's Web Account
                  </Typography>
                  <Typography variant="body1" component="span">
                    Rp78.000
                  </Typography>
                </ListItem>
                <Divider />
              </List>
              <Stack width="70%">
                <Typography variant="inherit" textAlign="center">
                  By clicking 'Continue', you have read and agree to the{' '}
                  <Typography
                    variant="inherit"
                    color={theme => theme.palette.primary.main}
                    component="span"
                    style={{ cursor: 'pointer' }}
                  >
                    Terms & Conditions applied
                  </Typography>
                </Typography>
              </Stack>
              <Button type="submit" variant="contained" disableElevation>
                Continue
              </Button>
              <Typography variant="inherit" component="span" textAlign="center">
                Ends in{' '}
                <Typography
                  variant="inherit"
                  color={theme => theme.palette.primary.main}
                  component="span"
                >
                  02 : 01
                </Typography>
              </Typography>
              <Divider />
            </Stack>
          </form>
        ) : (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Image src={LogoImage} width={100} height={100} />
            <Grid
              container
              spacing={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              xs={6}
              md={6}
              xl={6}
              item
            >
              <Grid
                item
                width="100%"
                sx={{
                  '& .MuiOtpInput-TextField': {
                    backgroundColor: 'white',
                    height: '50px',
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '50px',
                  },
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Input OTP
                </Typography>
                <OTPInput value="123456" />
              </Grid>
              <Grid item width="100%">
                <Stack
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="inherit">Didn't recieve OTP?</Typography>
                  <Stack>
                    <Typography
                      variant="inherit"
                      color={theme => theme.palette.primary.main}
                      component="span"
                      onClick={() => {
                        setWord('Resend OTP Success');
                        showModal();
                      }}
                    >
                      Resend OTP
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              onClick={() => {
                setWord('Payment successful!');
                showModal();
                setActiveStep(1);
                reset();
              }}
            >
              Continue to Payment
            </Button>
            <Typography variant="inherit" component="span" textAlign="center">
              Ends in{' '}
              <Typography
                variant="inherit"
                color={theme => theme.palette.primary.main}
                component="span"
              >
                02 : 01
              </Typography>
            </Typography>
            <Divider />
          </Stack>
        )}
      </Card>

      <DialogDirectPayment isActive={isActive} onHide={hideModal} word={word} />
    </Stack>
  );
};

export default DirectPayment;
