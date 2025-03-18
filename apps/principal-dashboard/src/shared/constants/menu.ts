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
  //   menuName: 'Dashboard Home',
  //   menuIcon: 'Home',
  //   menuLink: '/',
  //   privilege: 'default',
  // },
  {
    menuType: 'Menu',
    menuName: 'Bank Management',
    menuIcon: 'AccountBalance',
    menuLink: '/bank-management',
    privilege: 'bank',
  },
  {
    menuType: 'Menu',
    menuName: 'CO Account Management',
    menuIcon: 'Key',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'CO Account Management',
        menuLink: '/co-account-management',
        privilege: 'co',
      },
      {
        menuType: 'Submenu',
        menuName: 'Sub CO Account Management',
        menuLink: '/sub-co-account-management',
      },
    ]
  },
  {
    menuType: 'Menu',
    menuName: 'Member Management',
    menuIcon: 'AccountBox',
    menuLink: '/member-management',
    privilege: 'member',
  },
  {
    menuType: 'Menu',
    menuName: 'Merchant Management',
    menuIcon: 'ShoppingBasket',
    menuLink: '/merchant-management',
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
        menuName: 'Lookup Management',
        menuLink: '/lookup-management',
      },
      {
        menuType: 'Submenu',
        menuName: 'Transaction Type Management',
        menuLink: '/transaction-type-management',
        privilege: 'transaction-type',
      },
      {
        menuType: 'Submenu',
        menuName: 'Account Rule Management',
        menuLink: '/account-rule-management',
        privilege: 'account-rule',
      },
      {
        menuType: 'Submenu',
        menuName: 'Account Rule Value Management',
        menuLink: '/account-rule-value-management',
        privilege: 'account-rule-value',
      },
      {
        menuType: 'Submenu',
        menuName: 'Country Management',
        menuLink: '/country-management',
      },
      {
        menuType: 'Submenu',
        menuName: 'System Parameter',
        menuLink: '/sys-param',
        privilege: 'sys-param'
      },
      {
        menuType: 'Submenu',
        menuName: 'Event Management',
        menuLink: '/event-management',
      },
      {
        menuType: 'Submenu',
        menuName: 'Function',
        menuLink: '/function',
      },
      {
        menuType: 'Submenu',
        menuName: 'Bank FAQ Screen',
        menuLink: '/bank-faq-screen',
        privilege: 'bank-faq'
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
        menuName: 'App Customization',
        menuLink: '/app-customization',
        privilege: 'app-customization',
      },
      {
        menuType: 'Submenu',
        menuName: 'Content Management',
        menuLink: '/content-management',
        privilege: 'content',
      },
      {
        menuType: 'Submenu',
        menuName: 'Layering Approval',
        menuLink: '/layering-approval',
        privilege: 'approval-layer',
      }
    ],
  },
  {
    menuType: 'Menu',
    menuName: 'Report',
    menuIcon: 'FactCheck',
    menuLink: '/report',
  },
  {
    menuType: 'Menu',
    menuName: 'User Maintenance',
    menuIcon: 'Person',
    menuLink: '/user-maintenance',
  },
  {
    menuType: 'Menu',
    menuName: 'Biller Management',
    menuIcon: 'ShoppingBag',
    menuLink: '/biller-management',
  },
  {
    menuType: 'Menu',
    menuName: 'KYC Management',
    menuIcon: 'StarOutline',
    children: [
      {
        menuType: 'Submenu',
        menuName: 'KYC Request History',
        menuLink: '/kyc-request-history',
        privilege: 'kyc',
      },
    ]
  },
  {
    menuType: 'Menu',
    menuName: 'Activity History',
    menuIcon: 'History',
    menuLink: '/activity-history',
  },
  {
    menuType: 'Menu',
    menuName: 'Co Brand',
    menuIcon: 'Sell',
    menuLink: '/co-brand',
  },
  {
    menuType: 'Menu',
    menuName: 'White List',
    menuIcon: 'Summarize',
    menuLink: '/white-list',
  },
  {
    menuType: 'Menu',
    menuName: 'Merchant Master',
    menuIcon: 'Storefront',
    menuLink: '/merchant-master',
  },
  {
    menuType: 'Menu',
    menuName: 'Activity Member History',
    menuIcon: 'WorkHistory',
    menuLink: '/activity-member-history',
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
