import React from 'react';
import { Role } from '@src/shared/types/user';
import { MENU_ACCESS } from '@woi/privilege';

export type MenuType = {
  menuType: 'Header' | 'Menu' | 'Submenu';
  menuIcon?: React.ReactNode | string;
  menuName: string;
  menuLink?: string;
  children?: MenuType[];
  privilege?: MENU_ACCESS;
};

// Admin Menu
const adminMenu: MenuType[] = [
  // {
  //   menuType: 'Menu',
  //   menuName: 'Merchant Management',
  //   menuIcon: 'Storefront',
  //   menuLink: '/merchant-management',
  //   // privilege: 'merchant',
  //   privilege: 'default',
  // },
  {
    menuType: 'Menu',
    menuName: 'Member Management',
    menuIcon: 'AccountBox',
    menuLink: '/member-management',
    privilege: 'member',
  },
  {
    menuType: 'Menu',
    menuName: 'System Setting Management',
    menuIcon: 'Analytics',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'User Management',
        menuLink: '/user-management',
        privilege: 'principal',
      },
      {
        menuType: 'Submenu',
        menuName: 'Role Management',
        menuLink: '/role-management',
        privilege: 'role',
      },
      {
        menuType: 'Submenu',
        menuName: 'Account Rule Value Management',
        menuLink: '/account-rule-value-management',
        privilege: 'account-rule-value',
      },
      {
        menuType: 'Submenu',
        menuName: 'System Parameter',
        menuLink: '/system-parameter',
        privilege: 'system-parameter',
      },
      {
        menuType: 'Submenu',
        menuName: 'Email Management',
        menuLink: '/email-management',
        privilege: 'email-content',
      },
      {
        menuType: 'Submenu',
        menuName: 'SMS Content Management',
        menuLink: '/sms-content-management',
        privilege: 'sms-content',
      },
      {
        menuType: 'Submenu',
        menuName: 'AMLA Holiday',
        menuLink: '/amla-holiday',
        privilege: 'amla-holiday',
      },
    ],
  },
  {
    menuType: 'Menu',
    menuName: 'Report',
    menuIcon: 'FactCheck',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'CO VA Member Summary',
        menuLink: '/co-va-member-summary',
        privilege: 'co-va-member-summary',
      },
      {
        menuType: 'Submenu',
        menuName: 'CO Fee Summary',
        menuLink: '/co-fee-summary',
        privilege: 'co-fee-summary',
      },
      {
        menuType: 'Submenu',
        menuName: 'CO Transaction Summary',
        menuLink: '/co-transaction-summary',
        privilege: 'co-transaction-summary',
      },
      {
        menuType: 'Submenu',
        menuName: 'P2POutgoing Transaction Summary',
        menuLink: '/p2poutgoing-transaction-summary',
        privilege: 'p2p-outgoing-report',
      },
      {
        menuType: 'Submenu',
        menuName: 'User Fund Balance',
        menuLink: '/user-fund-balance',
        privilege: 'user-fund-balance',
      },
      {
        menuType: 'Submenu',
        menuName: 'Daily Channel Reliability',
        menuLink: '/daily-channel-reliability',
        privilege: 'daily-channel-reliability',
      },
      {
        menuType: 'Submenu',
        menuName: 'Daily Report',
        menuLink: '/daily-report',
        privilege: 'daily-report',
      },
      {
        menuType: 'Submenu',
        menuName: 'Bank Account Summary',
        menuLink: '/bank-account-summary',
        privilege: 'bank-account-summary',
      },
      {
        menuType: 'Submenu',
        menuName: 'QRIS Report',
        menuLink: '/qris-report',
        privilege: 'default',
      },
      {
        menuType: 'Submenu',
        menuName: 'QRIS Settlement',
        menuLink: '/qris-settlement',
        privilege: 'default',
      },
      {
        menuType: 'Submenu',
        menuName: 'Direct Debit Settlement',
        menuLink: '/direct-debit-settlement',
        privilege: 'default',
      },
    ],
  },
  {
    menuType: 'Menu',
    menuName: 'KYC Management',
    menuIcon: 'StarOutline',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'KYC Request',
        menuLink: '/kyc-request',
        privilege: 'kyc',
      },
      {
        menuType: 'Submenu',
        menuName: 'KYC Request History',
        menuLink: '/kyc-request-history',
        privilege: 'kyc',
      },
    ],
  },
  {
    menuType: 'Menu',
    menuName: 'Balance Correction',
    menuIcon: 'StarOutline',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'Balance Correction',
        menuLink: '/balance-correction',
        privilege: 'balance-correction',
      },
      {
        menuType: 'Submenu',
        menuName: 'Balance Correction History',
        menuLink: '/balance-correction-history',
        privilege: 'balance-correction',
      },
    ]
  },
  {
    menuType: 'Menu',
    menuName: 'FDS History',
    menuIcon: 'SafetyCheck',
    menuLink: '/fds-history',
    // privilege: 'fds-history',
    privilege: 'default',
  },
  {
    menuType: 'Menu',
    menuName: 'Activity Member History',
    menuIcon: 'WorkHistory',
    menuLink: '/activity-member-history',
    privilege: 'activity-member-history',
  },
  {
    menuType: 'Menu',
    menuName: 'Activity History',
    menuIcon: 'History',
    menuLink: '/activity-history',
    privilege: 'activity-history',
  },

  // Merchant
  {
    menuType: 'Menu',
    menuName: 'Account Information',
    menuIcon: 'Badge',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'Account Profile',
        menuLink: '/merchant/account-profile',
        privilege: 'default-merchant',
      },
      {
        menuType: 'Submenu',
        menuName: 'Balance Inquiry',
        menuLink: '/merchant/balance-inquiry',
        privilege: 'default-merchant',
      },
      {
        menuType: 'Submenu',
        menuName: 'Account History',
        menuLink: '/merchant/account-history',
        privilege: 'default-merchant',
      },
    ],
  },
  {
    menuType: 'Menu',
    menuName: 'User Management',
    menuIcon: 'SupervisorAccount',
    menuLink: '/merchant/user-management',
    privilege: 'default-merchant',
  },
  {
    menuType: 'Menu',
    menuName: 'Cash Out Merchant',
    menuIcon: 'Payments',
    menuLink: '/merchant/cashout-merchant',
    privilege: 'default-merchant',
  },
  {
    menuType: 'Menu',
    menuName: 'Create QR',
    menuIcon: 'QrCodeScanner',
    menuLink: '/merchant/create-qr',
    privilege: 'default-merchant-dynamic',
  },
  {
    menuType: 'Header',
    menuName: 'Dashboard Settings',
    privilege: 'default-merchant',
  },
  {
    menuType: 'Menu',
    menuName: 'Change Password',
    menuIcon: 'Lock',
    menuLink: '/merchant/change-password',
    privilege: 'default-merchant',
  },
  {
    menuType: 'Header',
    menuName: 'Dashboard Settings',
    privilege: 'default',
  },
  {
    menuType: 'Menu',
    menuName: 'Change Password',
    menuIcon: 'Lock',
    menuLink: '/change-password',
    privilege: 'default',
  },
];

export function generateMenu(role: Role | null) {
  if (role === 'Admin') return adminMenu;
  return [];
}

export function entryPointMenuByRole(role: Role | null) {
  if (role === 'Admin') return '/';
  return null;
}
