import React from 'react';
import { Stack, Typography, Card, Divider, Box, List, Avatar, ListItemButton, Button, useTheme } from '@mui/material';
import { FormDatePicker, Token } from '@woi/web-component';
import Image from 'next/image';

// Asset
import Merchant1 from 'asset/images/merchant-1.png';
import Merchant2 from 'asset/images/merchant-2.png';
import Merchant3 from 'asset/images/merchant-3.png';
import Merchant4 from 'asset/images/merchant-4.png';
import Merchant5 from 'asset/images/merchant-5.png';

// Icon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EmailIcon from '@mui/icons-material/Email';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body1">Period</Typography>
        <FormDatePicker
          size="small"
          placeholder="select date"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              minWidth: 450
            }
          }}
        />
      </Stack>
      <Card elevation={0} sx={themeProps => ({ background: themeProps.palette.secondary.main, p: 3, borderRadius: 4 })}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Quick Widgets</Typography>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: 'none' }}
              endIcon={<EditIcon />}
            >
              Edit Widgets
            </Button>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Card sx={{ p: 2, borderRadius: 4, flex: 1 }}>
              <Stack direction="column" spacing={2}>
                <StarOutlineIcon fontSize="large" />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h3">128</Typography>
                  <Typography variant="body2" color={theme.palette.success.main}>20%</Typography>
                  <ArrowUpwardIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                </Stack>
                <Typography variant="body2">KYC Request</Typography>
              </Stack>
            </Card>
            <Card sx={{ p: 2, borderRadius: 4, flex: 1 }}>
              <Stack direction="column" spacing={2}>
                <EventIcon fontSize="large" />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h3">128</Typography>
                </Stack>
                <Typography variant="body2">Events</Typography>
              </Stack>
            </Card>
            <Card sx={{ p: 2, borderRadius: 4, flex: 1 }}>
              <Stack direction="column" spacing={2}>
                <AccountBalanceIcon fontSize="large" />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h3">128</Typography>
                  <Typography variant="body2" color={theme.palette.warning.main}>15%</Typography>
                  <ArrowDownwardIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
                </Stack>
                <Typography variant="body2">Bank Registered</Typography>
              </Stack>
            </Card>
            <Card sx={{ p: 2, borderRadius: 4, flex: 1 }}>
              <Stack direction="column" spacing={2}>
                <AccountBoxIcon fontSize="large" />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h3">128</Typography>
                  <Typography variant="body2" color={theme.palette.success.main}>56%</Typography>
                  <ArrowUpwardIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                </Stack>
                <Typography variant="body2">Members Joined</Typography>
              </Stack>
            </Card>
            <Card sx={{ p: 2, borderRadius: 4, flex: 1 }}>
              <Stack direction="column" spacing={2}>
                <KeyIcon fontSize="large" />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h3">128</Typography>
                  <Typography variant="body2" color={theme.palette.warning.main}>20%</Typography>
                  <ArrowDownwardIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
                </Stack>
                <Typography variant="body2">CO Account</Typography>
              </Stack>
            </Card>
          </Stack>
          <Typography variant="caption" color={theme.palette.text.secondary}>Data compared from year 2021</Typography>
        </Stack>
      </Card>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Card sx={{ flex: 3, p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
              <Typography variant="subtitle1">Users Statistic</Typography>
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={2}>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body2">Total Users</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h3">1089</Typography>
                      <Typography variant="body2" color={theme.palette.success.main}>20%</Typography>
                      <ArrowUpwardIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                    </Stack>
                  </Stack>
                  <Box sx={{ p: 1 }}>
                    <Divider variant="middle" orientation="vertical" />
                  </Box>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body2">Active Users</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h3">795</Typography>
                      <Typography variant="body2" color={theme.palette.warning.main}>8%</Typography>
                      <ArrowDownwardIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
                    </Stack>
                  </Stack>
                </Stack>
                <Typography variant="caption" color={theme.palette.text.secondary}>Data compared from year 2021</Typography>
              </Stack>
            </Stack>
            <Box sx={{ width: '100%', height: 380, background: Token.color.greyscaleGreyLightest }}>
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ flex: 1, height: '100%' }}>
                <Typography variant="caption">Graph</Typography>
              </Stack>
            </Box>
          </Stack>
        </Card>
        <Card sx={{ flex: 1, p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2} alignItems="flex-start">
            <Stack direction="row" spacing={2} alignItems="center">
              <ShoppingBasketIcon />
              <Typography variant="subtitle1">Registered Merchant</Typography>
            </Stack>
            <Stack direction="column" spacing={1}>
              <Stack direction="row" spacing={2}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="body2">Total Merchant</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h3">37</Typography>
                    <Typography variant="body2" color={theme.palette.success.main}>20%</Typography>
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                  </Stack>
                </Stack>
                <Box sx={{ p: 1 }}>
                  <Divider variant="middle" orientation="vertical" />
                </Box>
                <Stack direction="column" spacing={1}>
                  <Typography variant="body2">Active Merchant</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h3">28</Typography>
                    <Typography variant="body2" color={theme.palette.warning.main}>8%</Typography>
                    <ArrowDownwardIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
                  </Stack>
                </Stack>
              </Stack>
              <Typography variant="caption" color={theme.palette.text.secondary}>Data compared from year 2021</Typography>
            </Stack>
            <List
              sx={themeProps => ({
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                '& .MuiListItemButton-root:hover': {
                  background: themeProps.palette.secondary.main,
                }
              })}
            >
              <ListItemButton sx={{ py: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar variant="rounded" sx={{ width: 20, height: 20, background: 'transparent' }}>
                    <Image src={Merchant1} layout="fill" objectFit="contain" />
                  </Avatar>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">KFC</Typography>
                </Stack>
              </ListItemButton>
              <Divider variant="fullWidth" component="li" />
              <ListItemButton sx={{ py: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar variant="rounded" sx={{ width: 20, height: 20, background: 'transparent' }}>
                    <Image src={Merchant2} layout="fill" objectFit="contain" />
                  </Avatar>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">Dunkin Donuts</Typography>
                </Stack>
              </ListItemButton>
              <Divider variant="fullWidth" component="li" />
              <ListItemButton sx={{ py: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar variant="rounded" sx={{ width: 20, height: 20, background: 'transparent' }}>
                    <Image src={Merchant3} layout="fill" objectFit="contain" />
                  </Avatar>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">Ta Wan</Typography>
                </Stack>
              </ListItemButton>
              <Divider variant="fullWidth" component="li" />
              <ListItemButton sx={{ py: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar variant="rounded" sx={{ width: 20, height: 20, background: 'transparent' }}>
                    <Image src={Merchant4} layout="fill" objectFit="contain" />
                  </Avatar>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">Pizza Hut</Typography>
                </Stack>
              </ListItemButton>
              <Divider variant="fullWidth" component="li" />
              <ListItemButton sx={{ py: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar variant="rounded" sx={{ width: 20, height: 20, background: 'transparent' }}>
                    <Image src={Merchant5} layout="fill" objectFit="contain" />
                  </Avatar>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">Starbucks Coffee</Typography>
                </Stack>
              </ListItemButton>
              <Divider variant="fullWidth" component="li" />
            </List>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              See all merchants
            </Button>
          </Stack>
        </Card>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Card sx={{ flex: 3, p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
              <Typography variant="subtitle1">Transaction</Typography>
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={2}>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body2">Total Transaction</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h3">Rp 97.580.450</Typography>
                      <Typography variant="body2" color={theme.palette.success.main}>20%</Typography>
                      <ArrowUpwardIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                    </Stack>
                  </Stack>
                </Stack>
                <Typography variant="caption" color={theme.palette.text.secondary}>Data compared from year 2021</Typography>
              </Stack>
            </Stack>
            <Box sx={{ width: '100%', height: 380, background: Token.color.greyscaleGreyLightest }}>
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ flex: 1, height: '100%' }}>
                <Typography variant="caption">Graph</Typography>
              </Stack>
            </Box>
          </Stack>
        </Card>
        <Card sx={{ flex: 1, p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2} alignItems="flex-start">
            <Stack direction="row" spacing={2} alignItems="center">
              <EmailIcon />
              <Typography variant="subtitle1">Recent Notification</Typography>
            </Stack>
            <List
              sx={themeProps => ({
                width: '100%',
                maxWidth: 360,
                '& .MuiListItemButton-root:hover': {
                  background: themeProps.palette.secondary.main,
                }
              })}
            >
              <ListItemButton
                sx={themeProps => ({
                  py: 2,
                  my: 1,
                  background: themeProps.palette.secondary.main,
                })}
              >
                <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    {/** @ts-ignore */}
                    <Typography variant="subtitle3">Successfully add new bank!</Typography>
                    <CircleIcon sx={{ fontSize: 10, color: theme.palette.warning.main }} />
                  </Stack>
                  <Typography variant="caption">Bank Mandiri is added to list</Typography>
                  <Divider variant="fullWidth" />
                  <Typography variant="caption" color={theme.palette.text.secondary}>Bank Management</Typography>
                </Stack>
              </ListItemButton>
              <ListItemButton sx={{ py: 2, my: 1 }}>
                <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">Successfully add new bank!</Typography>
                  <Typography variant="caption">Bank Mandiri is added to list</Typography>
                  <Divider variant="fullWidth" />
                  <Typography variant="caption" color={theme.palette.text.secondary}>Bank Management</Typography>
                </Stack>
              </ListItemButton>
              <ListItemButton sx={{ py: 2, my: 1 }}>
                <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3">Successfully add new bank!</Typography>
                  <Typography variant="caption">Bank Mandiri is added to list</Typography>
                  <Divider variant="fullWidth" />
                  <Typography variant="caption" color={theme.palette.text.secondary}>Bank Management</Typography>
                </Stack>
              </ListItemButton>
            </List>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              See all notifications
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}

export default Dashboard;