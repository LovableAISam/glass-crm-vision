
/**
 * Login and Refresh Token
 * usage for login and refresh token
 * Contract: auth/login.ts and auth/refreshToken.ts
 */
export const apiAuth = '/auth/api/oauth/token';

/**
 * Logout
 * usage for logout
 * Contract: auth/logout.ts
 */
export const apiLogout = '/auth/api/oauth/logout';

/**
 * Upload Temp
 * usage for upload temp
 * Contract: setting/uploadTemp
 */
export const apiUploadTemp = '/setting/api/v1/upload/temp';

/**
 * Update App Customization
 * usage for update app customization
 * Contract: setting/appCustomization
 */
export const apiAppCustomization = '/setting/api/v1/appCustomization';

/**
 * Transaction Type
 * usage for transaction type
 * Contract: admin/transactionType/*
 */
export const apiTransactionType = '/admin/api/v1/transaction-type';

/**
 * Transaction Type
 * usage for Transaction Type
 * Contract: admin/transactionType/transactionTypeOptionList
 */
export const apiTransactionTypeNames = '/admin/api/v1/transaction-type/names';

/**
 * Email Content 
 * usage for email content 
 * Contract: admin/emailContent
 */
export const apiEmailContent = '/admin/api/v1/email-content';

/**
 * Content Management
 * usage for content management 
 * Contract: admin/contentManagement
 */
export const apiContentManagement = '/admin/api/v1/content-management';

/**
 * SMS Content 
 * usage for sms content 
 * Contract: admin/smsContent
 */
export const apiSMSContent = '/admin/api/v1/sms-content';

/**
 * Member 
 * usage for member
 * Contract: idp/member/*
 */
export const apiMember = '/idp/api/v1/member';

/**
 * Member Lock 
 * usage for member lock
 * Contract: admin/memberLock/*
 */
export const apiMemberLock = '/admin/api/v1/member/allMemberLocked';

/**
 * Balance Correction 
 * usage for create balance correction
 * Contract: admin/balancecorrection/*
 */
export const apiCreateBalanceCorrection = '/admin/api/v1/balancecorrection/create';

/**
 * Balance Correction Approval
 * usage for balance correction approval
 * Contract: admin/balancecorrectionapproval/*
 */
export const apiBalanceCorrectionApproval = '/admin/api/v1/balancecorrection/approval';

/**
 * Balance Correction History
 * usage for history balance correction
 * Contract: admin/balancecorrectionhistory/*
 */
export const apiBalanceCorrectionHistory = '/admin/api/v1/balancecorrection/getHistory';

/**
 * Member Activation
 * usage for member activation
 * Contract: idp/member/memberActivation
 */
export const apiMemberActivation = '/idp/api/v1/member/activation';

/**
 * Member Status Type
 * usage for member status type
 * Contract: idp/member/memberStatusType
 */
export const apiMemberStatusType = '/idp/api/v1/member/status-type';

/**
 * Member Detail
 * usage for member detail
 * Contract: idp/member/memberDetail
 */
export const apiMemberDetail = '/idp/api/v1/member/details';

/**
 * Member Detail
 * usage for member detail
 * Contract: idp/member/memberKYCDetail
 */
export const apiMemberKYCDetail = '/admin/api/v1/member/kycDetail';


/**
 * Get List Menu
 * usage for Get List Menu
 * Contract: menu/*
 */
export const apiMenu = '/idp/api/v1/menu';

/**
 * Get List Menu Approval Layer
 * usage for Get List Menu
 * Contract: menu/*
 */
export const apiMenuApprovalLayer = '/idp/api/v1/menu/approval-layer';

/**
 * Get CRUD Role
 * usage for Get CRUD Role
 * Contract: role/*
 */
export const apiRole = '/idp/api/v1/role';

/**
 * Get List User Role
 * usage for Get List User Role
 * Contract: role/*
 */
export const apiRoleUsers = '/idp/api/v1/role/:id/users';

/**
 * CRUD User
 * usage for CRUD user
 * Contract: user/*
 */
export const apiUser = '/idp/api/v1/principal';

/**
 * User Activation
 * usage for user activation
 * Contract: user/userActivation
 */
export const apiUserActivation = '/idp/api/v1/principal/activation';

/**
 * Reset Password
 * usage for reset password
 * Contract: auth/resetPassword
 */
export const apiPasswordReset = '/idp/api/v1/principal/password/reset';

/**
 * Change Password
 * usage for change password
 * Contract: auth/changePassword
 */
export const apiPassword = '/idp/api/v1/principal/password';

/**
 * Password Verification
 * usage for password verification
 * Contract: auth/passwordVerification
 */
export const apiPasswordVerification = '/idp/api/v1/principal/password/verification';

/**
 * Password Changed Activity
 * usage for password changed activity
 * Contract: auth/passwordChangedActivity
 */
export const apiPasswordChangedActivity = '/idp/api/v1/principal/password-changed-activity';

/**
 * CRUD Bank
 * usage for CRUD Bank
 * Contract: bank/*
 */
export const apiBank = '/admin/api/v1/bank';

/**
 * Country
 * usage for country
 * Contract: admin/country/*
 */
export const apiCountry = '/admin/api/v1/country';

/**
 * Province
 * usage for province
 * Contract: admin/province/*
 */
export const apiProvince = '/admin/api/v1/province';

/**
 * City
 * usage for city
 * Contract: admin/city/*
 */
export const apiCity = '/admin/api/v1/city';

/**
 * Currency
 * usage for currency
 * Contract: admin/currency/*
 */
export const apiCurrency = '/admin/api/v1/currency';

/**
 * Referral
 * usage for referral
 * Contract: admin/referral/*
 */
export const apiReferral = '/admin/api/v1/referral';

/**
 * SCP
 * usage for scp
 * Contract: admin/scp/*
 */
export const apiSCP = '/admin/api/v1/scp';

/**
 * SMTP
 * usage for smtp
 * Contract: admin/smtp/*
 */
export const apiSMTP = '/admin/api/v1/smtp';

/**
 * Community Owner
 * usage for community owner
 * Contract: admin/communityOwner/*
 */
export const apiCommunityOwner = '/admin/api/v1/community-owner';

/**
 * Community Owner
 * usage for community owner
 * Contract: admin/communityOwner/*
 */
export const apiCommunityOwnerDetail = '/admin/api/v1/community-owner/detail';

/**
 * Community Owner Activation
 * usage for community owner activation
 * Contract: admin/communityOwner/communityOwnerActivationList
 */
export const apiCommunityOwnerActivation = '/admin/api/v1/community-owner/:id/activation';

/**
 * Community Owner Activation Resume
 * usage for community owner activation resume
 * Contract: admin/communityOwner/communityOwnerActivationResume
 */
export const apiCommunityOwnerActivationResume = '/admin/api/v1/community-owner/:id/activation/resume';

/**
 * Community Owner Deactivate
 * usage for community owner Deactivate
 * Contract: admin/communityOwner/communityOwnerDeactivate
 */
export const apiCommunityOwnerDeactivate = '/admin/api/v1/community-owner/deactivate';

/**
 * Community Owner PIC Lock
 * usage for community owner PIC Lock
 * Contract: admin/communityOwner/communityOwnerPICLock
 */
export const apiCommunityOwnerPICLock = '/admin/api/v1/community-owner/pic-lock';

/**
 * Community Owner Status
 * usage for community owner status
 * Contract: admin/communityOwner/communityOwnerStatusList
 */
export const apiCommunityOwnerStatusType = '/admin/api/v1/community-owner/status-type';

/**
 * CRUD Account Rule Value
 * usage for CRUD Account Rule Value
 * Contract: admin/accountRuleValue/*
 */
export const apiAccountRuleValue = '/admin/api/v1/account-rule-value';

/**
 * CRUD Account Rule
 * usage for CRUD Account Rule
 * Contract: admin/accountRule/*
 */
export const apiAccountRule = '/admin/api/v1/account-rule';

/**
 * CRUD Account Rule
 * usage for CRUD Account Rule
 * Contract: admin/accountRule/accountRuleOptionList
 */
export const apiAccountRuleNames = '/admin/api/v1/account-rule/names';

/**
 * Setting Upload Temp
 * usage for setting upload temp
 * Contract: setting/uploadTemporaryImage
 */
export const apiSettingUploadTemporaryImage = '/setting/api/v1/upload/temporary/image';

/**
 * CRUD Premium Member
 * usage for CRUD Premium Member
 * Contract: kyc/premiumMember/*
 */
export const apiKycPremiumMember = '/kyc/api/v1/premium-member';

/**
 * CRUD Premium Member History
 * usage for CRUD Premium Member History
 * Contract: kyc/premiumMember/*
 */
export const apiKycPremiumMemberHistory = '/kyc/api/v1/premium-member-history';

/**
 * Premium Member Verification
 * usage for Premium Member Verification
 * Contract: kyc/premiumMember/*
 */
export const apiKycPremiumMemberVerification = '/kyc/api/v1/premium-member/verification';

/**
 * Premium Member History Export to XLS
 * usage for Premium Member History Export to XLS
 * Contract: kyc/premiumMember/*
 */
export const apiKycPremiumMemberHistoryExportToXLS = '/kyc/api/v1/premium-member-history/export-to-xls';

/**
 * Premium Member DTTOT
 * usage for Premium Member DTTOT
 * Contract: kyc/premiumMember/*
 */
export const apiKycPremiumMemberSetDttot = '/kyc/api/v1/premium-member/set-dttot';

/**
 * CRUD Premium Member History Detail
 * usage for CRUD Premium Member History Detail
 * Contract: kyc/apiKycPremiumMemberHistoryDetail/*
 */
export const apiKycPremiumMemberHistoryDetail =
  '/kyc/api/v1/premium-member-history/detail';

/**
 * CRUD Approval Layer 
 * usage for CRUD Approval Layer
 * Contract: admin/approvalLayer/*
 */
export const apiApprovalLayer = '/admin/api/v1/approval-layer';

/**
 * CRUD Approval Layer Menu 
 * usage for CRUD Approval Layer Menu
 * Contract: admin/approvalLayer/*
 */
export const apiApprovalLayerMenu = '/admin/api/v1/approval-layer/menu';

/**
 * Transaction History List 
 * usage for Transaction History List
 * Contract: admin/memberTransaction
 */
export const apiTransactionHistory = '/admin/api/v1/report/bookledger/membertransaction';

/**
 * Member Activity 
 * usage for Member Activity
 * Contract: admin/memberActivity
 */
export const apiMemberActivity = '/admin/api/v1/report/memberactivity';

/**
 * Admin Activity 
 * usage for Admin Activity
 * Contract: admin/adminActivity
 */
export const apiAdminActivity = '/admin/api/v1/report/adminactivity';

/**
 * Member Summary Detail 
 * usage for Member Summary Detail
 * Contract: admin/memberSummaryDetail
 */
export const apiMemberSummaryDetail = '/admin/api/v1/report/membersummary/detail';

/**
 * Fee Summary 
 * usage for Fee Summary
 * Contract: admin/reportFeeSummary
 */
export const apiFeeSummary = '/admin/api/v1/report/feesummary';

/**
 * Fund Balance 
 * usage for Fund Balance
 * Contract: admin/reportFundBalance
 */
export const apiFundBalance = '/admin/api/v1/report/fundbalance';

/**
 * Channel Reliability 
 * usage for Channel Reliability
 * Contract: admin/reportChannelReliability
 */
export const apiChannelReliability = '/admin/api/v1/channelreliability/getChannelReliability';

/**
 * Export Transaction History 
 * usage for Export Transaction History
 * Contract: transaction/transactionHistory/transactionHistoryExport
 */
export const apiTransactionHistoryExport = '/transaction/api/v1/transaction-history/export';

/**
 * Export Transaction History 
 * usage for Export Transaction History
 * Contract: transaction/transactionHistory/transactionHistoryExport
 */
export const apiDownloadMemberTransactionExport = '/admin/api/v1/report/bookledger/download-membertransaction';

/**
 * Export Member Summary Transaction 
 * usage for Export Member Summary Transaction
 * Contract: report/memberSummary/transactionExport
 */
export const apiDownloadMemberSummaryTransactionExport = '/admin/api/v1/report/membersummary/download-membersummary';

/**
 * Export Member Activity 
 * usage for Export Member Activity
 * Contract: report/memberactivity/download
 */
export const apiDownloadMemberActivity = '/admin/api/v1/report/memberactivity/download';

/**
 * Export Admin Activity 
 * usage for Export Admin Activity
 * Contract: report/Adminactivity/download
 */
export const apiDownloadAdminActivity = '/admin/api/v1/report/adminactivity/download';

/**
 * Export Fee Summary 
 * usage for Export Fee Summary
 * Contract: report/feeSummary/export
 */
export const apiDownloadFeeSummaryExport = '/admin/api/v1/report/feesummary/download-feesummary';

/**
 * Bank Account Summary 
 * usage for Bank Account Summary
 * Contract: report/bankAccountSummary/export
 */
export const apiDownloadBankAccountSummaryExport = '/admin/api/v1/report/bankaccountsummary/download';

/**
 * Daily Summary 
 * usage for Daily Summary
 * Contract: report/dailyReport/export
 */
export const apiDownloadDailySummaryExport = '/admin/api/v1/report/daily-eonboarding/download';

/**
 * Daily Report Onboarding 
 * usage for Daily Report Onboarding
 * Contract: report/daily-eonboarding
 */
export const apiDailyReport = '/admin/api/v1/report/daily-eonboarding';

/**
 * AMLA Holiday 
 * usage for AMLA Holiday
 * Contract: report/amlaholiday
 */
export const apiAMLAHoliday = '/admin/api/v1/report/amlaholiday/get-all';

/**
 * Delete Holiday 
 * usage for Delete Holiday
 * Contract: report/amlaholiday/delete
 */
export const apiAMLAHolidayDelete = '/admin/api/v1/report/amlaholiday/delete';

/**
 * AMLA Holiday Year List 
 * usage for AMLA Holiday Year List
 * Contract: report/amlaholiday/get-list-year
 */
export const apiAMLAHolidayYearList = '/admin/api/v1/report/amlaholiday/get-list-year';

/**
 * Create AMLA Holiday 
 * usage for Create AMLA Holiday
 * Contract: report/amlaholiday/create
 */
export const apiCreateAMLAHoliday = '/admin/api/v1/report/amlaholiday/create';

/**
 * Bank Account Summary 
 * usage for Bank Account Summary
 * Contract: report/bankaccountsummary
 */
export const apiBankAccountSummary = '/admin/api/v1/report/bankaccountsummary/get-all';

/**
 * Export Transaction Summary 
 * usage for Export Transaction Summary
 * Contract: report/TransactionSummary/export
 */
export const apiDownloadTransactionSummaryExport = '/admin/api/v1/report/alltransaction/download-transactionsummary';

/**
 * Export Transaction P2POutgoing Summary 
 * usage for Export Transaction P2POutgoing Summary
 * Contract: report/TransactionSummaryP2POutgoing/export
 */
export const apiDownloadTransactionP2POutgoingSummaryExport = '/admin/api/v1/report/alltransaction/download-p2poutgoingtransactionsummary';

/**
 * Transaction Summary 
 * usage for Transaction Summary
 * Contract: report/allTransaction
 */
export const apiTransactionSummary = '/admin/api/v1/report/alltransaction';

/**
 * Transaction P2pOutgoing Summary 
 * usage for Transaction P2pOutgoing Summary
 * Contract: report/allTransactionP2pOutgoing
 */
export const apiTransactionP2POutgoingSummary = '/admin/api/v1/report/allp2poutgoingtransaction';

/**
 * Account Statement Balance 
 * usage for Account Statement Balance
 * Contract: transaction/accountStatement/accountStatementBalance
 */
export const apiAccountStatementBalance = '/transaction/api/v1/account-statement/balance';

/**
 * Merchant 
 * usage for Merchant
 * Contract: admin/Merchant
 */
export const apiMerchant = '/admin/api/v1/merchant';

/**
 * System Parameter 
 * usage for System Parameter
 * Contract: admin/System Parameter
 */
export const apiSystemParameter = '/admin/api/v1/system-parameter';