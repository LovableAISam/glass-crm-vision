declare module '@woi/privilege' {

  export type PRIVILEGE_ACCESS = 'get' | 'create' | 'update' | 'delete';

  export type MENU_ACCESS =
    | 'default' // only used for FE
    | 'principal'
    | 'transaction-type'
    | 'co'
    | 'role'
    | 'bank'
    | 'app-customization'
    | 'member'
    | 'sms-content'
    | 'email-content'
    | 'account-rule'
    | 'account-rule-value'
    | 'kyc'
    | 'approval-layer'
    | 'activity-member-history'
    | 'content'
    | 'content-management'
    | 'merchant'
    | 'system-parameter'
    | 'amla-holiday'
    | 'co-va-member-summary'
    | 'co-fee-summary'
    | 'co-transaction-summary'
    | 'user-fund-balance'
    | 'daily-channel-reliability'
    | 'daily-report'
    | 'bank-account-summary'
    | 'activity-history'
    | 'balance-correction'
    | 'p2p-outgoing-report';
}
