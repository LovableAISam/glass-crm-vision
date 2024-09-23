// import the original type declarations
import 'react-i18next';
// import all namespaces (for the default language, only)
import common from '../../../../packages/translation/en/common.json';
import auth from '../../../../packages/translation/en/auth.json';
import form from '../../../../packages/translation/en/form.json';
import co from '../../../../packages/translation/en/co.json';
import bank from '../../../../packages/translation/en/bank.json';
import member from '../../../../packages/translation/en/member.json';
import user from '../../../../packages/translation/en/user.json';
import role from '../../../../packages/translation/en/role.json';
import transactionType from '../../../../packages/translation/en/transactionType.json';
import accountRule from '../../../../packages/translation/en/accountRule.json';
import accountRuleValue from '../../../../packages/translation/en/accountRuleValue.json';
import bankFAQ from '../../../../packages/translation/en/bankFAQ.json';
import emailContent from '../../../../packages/translation/en/emailContent.json';
import smsContent from '../../../../packages/translation/en/smsContent.json';
import appCustomization from '../../../../packages/translation/en/appCustomization.json';
import changePassword from '../../../../packages/translation/en/changePassword.json';
import merchant from '../../../../packages/translation/en/merchant.json';
import content from '../../../../packages/translation/en/content.json';
import layeringApproval from '../../../../packages/translation/en/layeringApproval.json';
import kyc from '../../../../packages/translation/en/kyc.json';
import activityMember from '../../../../packages/translation/en/activityMember.json';
import report from '../../../../packages/translation/en/report.json';
import balanceCorrection from '../../../../packages/translation/en/balanceCorrection.json';
import amlaHoliday from '../../../../packages/translation/en/amlaHoliday.json';

interface TranslationResource {
  common: typeof common;
  auth: typeof auth;
  form: typeof form;
  co: typeof co;
  bank: typeof bank;
  member: typeof member;
  user: typeof user;
  role: typeof role;
  transactionType: typeof transactionType;
  accountRule: typeof accountRule;
  accountRuleValue: typeof accountRuleValue;
  bankFAQ: typeof bankFAQ;
  emailContent: typeof emailContent;
  smsContent: typeof smsContent;
  appCustomization: typeof appCustomization;
  changePassword: typeof changePassword;
  merchant: typeof merchant;
  content: typeof content;
  layeringApproval: typeof layeringApproval;
  kyc: typeof kyc;
  activityMember: typeof activityMember;
  report: typeof report;
  balanceCorrection: typeof balanceCorrection;
  amlaHoliday: typeof amlaHoliday;
}

// react-i18next versions lower than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface Resources extends TranslationResource { }
}

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: 'common';
    // custom resources type
    resources: TranslationResource;
  };
};