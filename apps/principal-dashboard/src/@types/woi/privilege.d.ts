declare module '@woi/privilege' {

  export type PRIVILEGE_ACCESS = 'get' | 'create' | 'update' | 'delete';

  export type MENU_ACCESS =
    | 'default' // only used for FE
    | 'principal'
    | 'transaction-type'
    | 'co'
    | 'role'
    | 'bank'
    | 'bank-faq'
    | 'app-customization'
    | 'member'
    | 'sms-content'
    | 'email-content'
    | 'account-rule'
    | 'account-rule-value'
    | 'kyc'
    | 'content'
    | 'approval-layer'
    | 'sys-param';
}
