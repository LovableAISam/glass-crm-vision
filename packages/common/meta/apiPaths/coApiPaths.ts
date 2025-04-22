
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
 * AllCountry
 * usage for Allcountry
 * Contract: admin/Allcountry/*
 */
export const apiAllCountry = '/admin/api/v1/country/all-country';

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
 * City
 * usage for city
 * Contract: admin/city/*
 */
export const apiCityByCode = '/admin/api/v1/city/code';

/**
 * Customer Profile
 * usage for Customer Profile
 * Contract: admin/CustomerProfile/*
 */
export const apiCustomerProfile = '/admin/api/v1/customer-profile/all-customer-profile';

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
export const apiKycPremiumMemberHistoryDetail = '/kyc/api/v1/premium-member-history/detail';

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
 * Transaction Summary 
 * usage for Transaction Summary
 * Contract: report/allTransaction
 */
export const apiQRISReportAllTransaction = '/report/v1/report/qrisReport/alltransaction';

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
export const apiMerchant = '/merchant/api/v1/merchant';

/**
 * System Parameter 
 * usage for System Parameter
 * Contract: admin/System Parameter
 */
export const apiSystemParameter = '/admin/api/v1/system-parameter';

/**
 * CRUD Premium Member Detail
 * usage for CRUD Premium Member Detail
 * Contract: kyc/apiKycPremiumMemberDetail/*
 */
export const apiKycPremiumMemberDetail = '/kyc/api/v1/premium-member-history/detail/member';

/**
 * Approval Layer List
 * usage for Approval Layer List
 * Contract: admin/approvalLayer/list/*
 */
export const apiApprovalLayerList = '/admin/api/v1/approval-layer/list';

/**
 * Create QR Dynamic
 * usage for Create QR
 * Contract: merchant/Create-QR
 */
export const apiCreateQR = '/merchant/api/v1/merchant/qr/dynamic';

/**
 * QR Dynamic Status
 * usage for QR Dynamic Status
 * Contract: merchant/QRDynamic/Status
 */
export const apiQRDynamicStatus = '/merchant/api/v1/merchant/qr/dynamic-status';

/**
 * QR Dynamic Update
 * usage for QR Dynamic Update
 * Contract: merchant/QRDynamic/Update
 */
export const apiQRDynamicUpdate = '/merchant/api/v1/merchant/qr-dynamic-update-status';

/**
 * Merchant Detail
 * usage for Merchant Detail
 * Contract: merchant/Merchant-Detail
 */
export const apiMerchantDetail = '/merchant/api/v1/merchant/detail';

/**
 * Merchant Profile
 * usage for Merchant Profile
 * Contract: merchant/Merchant-Profile
 */
export const apiMerchantProfile = '/merchant/api/v1/merchant/profile';

/**
 * Merchant Create
 * usage for Merchant Create
 * Contract: admin/Merchant-create
 */
export const apiMerchantCreate = '/merchant/api/v1/merchant/create';

/**
 * List Merchant
 * usage for List Merchant
 * Contract: merchant/Merchant/get-list
 */
export const apiMerchantList = '/merchant/api/v1/merchant/get-list';

/**
 * List Merchant Transaction History
 * usage for List Merchant Transaction History
 * Contract: merchant/Merchant/bookledger
 */
export const apiMerchantTransactionHistory = '/report/v1/bookledger/merchant';

/**
 * List Merchant Transaction History Export
 * usage for List Merchant Transaction History Export
 * Contract: merchant/Merchant/bookledger/merchant
 */
export const apiMerchantTransactionHistoryExport = '/report/v1/bookledger/merchant/download-merchant';

/**
 * List Merchant User List
 * usage for List Merchant User List
 * Contract: merchant/api/v1/user/getlist
 */
export const apiMerchantUserList = '/merchant/api/v1/user/getlist';

/**
 * Merchant User Create
 * usage for Merchant User Create
 * Contract: merchant/api/v1/user/create
 */
export const apiMerchantUserCreate = '/merchant/api/v1/user/create';

/**
 * Merchant User Detail
 * usage for Merchant User Detail
 * Contract: merchant/api/v1/user
 */
export const apiMerchantUserDetail = '/merchant/api/v1/user';

/**
 * Merchant User Update
 * usage for Merchant User Update
 * Contract: merchant/api/v1/user/update
 */
export const apiMerchantUserUpdate = '/merchant/api/v1/user/update';

/**
 * Merchant Account History
 * usage for Merchant Account History
 * Contract: report/api/v1/report/accounthistory
 */
export const apiMerchantAccountHistory = '/report/api/v1/accounthistory';

/**
 * Merchant Account History Detail
 * usage for Merchant Account History Detail
 * Contract: report/api/v1/report/accounthistory/detail
 */
export const apiMerchantAccountHistoryDetail = '/report/api/v1/report/accounthistory/detail';

/**
 * Merchant Account History Export
 * usage for Merchant Account History Export
 * Contract: report/api/v1/report/accounthistory/download
 */
export const apiMerchantAccountHistoryExport = '/report/api/v1/accounthistory/download';

/**
 * Merchant Balance Inquiry
 * usage for Merchant Balance Inquiry
 * Contract: report/api/v1/balanceinquiry
 */
export const apiMerchantBalanceInquiry = '/report/api/v1/balanceinquiry';

/**
 * Merchant Fee Rate Type List
 * usage for Merchant Fee Rate Type List
 * Contract: merchant/api/v1/cashout/fee-rate-type/get-list
 */
export const apiMerchantFeeRateType = '/merchant/api/v1/cashout/fee-rate-type/get-list';

/**
 * Merchant Cashout Inquiry
 * usage for Merchant Cashout Inquiry
 * Contract: merchant/api/v1/cashout/inquiry
 */
export const apiMerchantCashoutInquiry = '/merchant/api/v1/cashout/inquiry';

/**
 * Merchant Cashout Payment
 * usage for Merchant Cashout Payment
 * Contract: merchant/api/v1/cashout/payment
 */
export const apiMerchantCashoutPayment = '/merchant/api/v1/cashout/payment';

/**
 * FDS History
 * usage for FDSHistory
 * Contract: report/fds-history/*
 */
export const apiFDSHistory = '/report/api/v1/fraud-detection-system/get';

/**
 * Export FDS History
 * usage for Export FDS History
 * Contract: report/FDSHistory/download
 */
export const apiDownloadFDSHistory = '/report/api/v1/report/fds/download';

/**
 * Filter Fee Rate Type
 * usage for Filter Fee Rate Type
 * Contract: admin/feeRateType/*
 */
export const apiFeeRateTypeList = '/admin/api/v1/feeratetype/filter';

/**
 * CRUD Fee Rate Type
 * usage for CRUD Fee Rate Type
 * Contract: admin/feeRateType/*
 */
export const apiFeeRateType = '/admin/api/v1/feeratetype';

/**
 * CRUD Bank FAQ
 * usage for CRUD Bank FAQ
 * Contract: bankFAQ/*
 */
export const apiBankFAQ = '/admin/api/v1/bank-faq';

/**
 * Bulk Top Up Upload Csv
 * usage for upload csv
 * Contract: admin/uploadCsvBulkTopUp
 */
export const apiUploadCsvBulkTopUp = '/admin/api/v1/upload-csv-bulk-topup';

/**
 * Bulk Top Up Save
 * usage for save bulk top up
 * Contract: admin/BulkTopUpSave
 */
export const apiBulkTopUpSave = '/admin/api/v1/bulk-topup-save';

/**
 * Bulk Top Up List
 * usage for get list bulk top up
 * Contract: admin/BulkTopUpList
 */
export const apiBulkTopUpList = '/admin/api/v1/get-bulk-topup-list';

/**
 * Download Bulk Top Up List
 * usage for download bulk top up
 * Contract: admin/DownloadBulkTopUpList
 */
export const apiDownloadBulkTopUpList = '/admin/api/v1/download-bulk-topup-list';

/**
 * Member Summary Header List
 * usage for member summary
 * Contract: admin/MemberSummaryList
 */
export const apiMemberSummaryList = '/report/api/v1/report/membersummary/header';

/**
 * QRIS Report
 * usage for QRIS Report
 * Contract: report/qrisReport
 */
// export const apiQRISReport = '/report/api/v1/report/qrisReport';
export const apiQRISReport = '/report/v1/report/qrisReport';

/**
 * QRIS Report
 * usage for Qris Report Dropdown List
 * Contract: admin/kycType/*
 */
export const apiKycType = '/admin/api/v1/city/city-list';

/**
 * Qris Report
 * usage for Qris export List
 * Contract: admin/qrisReport/*
 */
export const apiQRISExport = '/report/v1/report/qrisReport/download';

/**
 * QRIS Settlement
 * usage for QRIS Settlement
 * Contract: admin/reportQRISSettlement
 */
export const apiQRISSettlement = '/report/api/v1/report/qrisSettelement';

/**
 * QRIS Settlement Detail
 * usage for QRIS Settlement Detail
 * Contract: admin/reportQRISSettlementDetail
 */
export const apiQRISSettlementDetail = '/report/api/v1/report/qrisSettelementDetail';

/**
 * Refund Reason List
 * usage for Account Profile dropdown refund reason Function List
 * Contract: merchant/Merchant/Function-list
 */
export const apiRefundReason = '/merchant/api/v1/merchant/refund-reason';

/**
 * Refund
 * usage for Post refund
 * Contract: merchant/Merchant/Function-list
 */
export const apiTransactionRefund = '/merchant/api/v1/transaction/refund';

/**
 * Merchant Account History Print
 * usage for Merchant Account History Print
 * Contract: report/api/v1/accounthistory/download-receipt
 */
export const apiMerchantAccountHistoryPrint = '/report/api/v1/accounthistory/download-receipt';

/**
 * QR Generator
 * usage for Show QR Generate Account Profile
 * Contract: merchant/Merchant/Function-list
 */
export const apiQrGenerate = '/merchant/api/v1/merchant/qr/static';

/**
 * Kecamatan
 * usage for kecamatan
 * Contract: admin/kecamatan/*
 */
export const apiKecamatan = '/admin/api/v1/kecamatan';

/**
 * Kelurahan
 * usage for kelurahan
 * Contract: admin/kelurahan/*
 */
export const apiKelurahan = '/admin/api/v1/kelurahan';

/**
 * Export QRIS Settlement
 * usage for Export QRIS Settlement
 * Contract: report/qrisSettlement/export
 */
export const apiDownloadQRISSettlementExport = '/report/api/v1/report/qrisSettelement/download';

/**
 * Detail Direct Debit Settlement
 * usage for detail Direct Debit Settlement
 * Contract: report/diretctDebitSettlement
 */
export const apiDirectDebitSettlementDetail = '/report/api/v1/report/direct-debit-settlement';

/**
 * Detail Direct Debit Settlement Export
 * usage for detail Direct Debit Settlement Export
 * Contract: report/diretctDebitSettlement
 */
export const apiDirectDebitSettlementExport = '/report/api/v1/report/direct-debit-settlement-download';

/**
 * Merchant Function List
 * usage for Merchant Function List
 * Contract: merchant/Merchant/Function-list
 */
export const apiMerchantFunctionList = '/merchant/api/v1/merchant/function-list';

/**
 * List Merchant Get List Type
 * usage for List Merchant Get List Type
 * Contract: merchant/Merchant/bookledger
 */
export const apiMerchantGetListType = '/merchant/api/v1/merchant/type/get-list';

/**
 * Merchant Category List
 * usage for Merchant Category List
 * Contract: merchant/Merchant/Category/Get-List
 */
export const apiMerchantCategoryList = '/merchant/api/v1/merchant/criteria/get-list';

/**
 * QRIS Report
 * usage for Qris Report Dropdown List
 * Contract: admin/merchantCriteriaType/*
 */
export const apiMerchantCriteriaType = '/merchant/api/v1/merchant/criteria/get-list';

/**
 * Merchant Category List
 * usage for Merchant Category List
 * Contract: merchant/Merchant/Category-Code/Get-List
 */
export const apiMerchantCategoryCodeList = '/merchant/api/v1/merchant/category-code/get-list';

/**
 * Merchant Location List
 * usage for Merchant Location List
 * Contract: merchant/Merchant/location-list
 */
export const apiMerchantLocationList = '/merchant/api/v1/merchant/location-list';

/**
 * Merchant QR Type
 * usage for Merchant QR Type
 * Contract: merchant/Merchant/QR/Get-Type
 */
export const apiMerchantQRISType = '/merchant/api/v1/merchant/qris-type';

/**
 * Merchant QR Type
 * usage for Merchant QR Type
 * Contract: merchant/Merchant/QR/Get-Type
 */
export const apiMerchantQRType = '/merchant/api/v1/merchant/qr-type';