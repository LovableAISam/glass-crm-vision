
/**
 * Login and Refresh Token
 * usage for login and refresh token
 * Contract: auth/login.ts and auth/refreshToken.ts
 */
export const apiAuth = '/auth/api/oauth/token';

/**
 * CRUD Bank
 * usage for CRUD Bank
 * Contract: bank/*
 */
export const apiBank = '/admin/api/v1/bank';

/**
 * Member 
 * usage for member
 * Contract: admin/member/*
 */
export const apiMember = '/admin/api/v1/member';

/**
 * Get CRUD Menu
 * usage for Get CRUD Menu
 * Contract: menu/*
 */
export const apiMenu = '/idp/api/v1/menu';

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
 * Setting Upload Temp
 * usage for setting upload temp
 * Contract: setting/uploadTemporaryImage
 */
export const apiSettingUploadTemporaryImage = '/setting/api/v1/upload/temporary/image';

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
 * Community Owner Status
 * usage for community owner status
 * Contract: admin/communityOwner/communityOwnerStatusList
 */
export const apiCommunityOwnerStatusType = '/admin/api/v1/community-owner/status-type';

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
 * Community Owner
 * usage for community owner
 * Contract: admin/communityOwner/*
 */
export const apiCommunityOwnerDetail = '/admin/api/v1/community-owner/detail';

/**
 * CRUD Application
 * usage for CRUD application
 * Contract: admin/application/*
 */
export const apiApplication = '/admin/api/v1/application';

/**
 * CRUD Provisioning Application
 * usage for CRUD Provisioning application
 * Contract: admin/application/applicationProvisioningList
 */
export const apiApplicationProvisioning = '/admin/api/v1/application/:id/provisioning';

/**
 * CRUD Provisioning Application Resume
 * usage for CRUD provisioning application resume
 * Contract: admin/application/applicationProvisioningResume
 */
export const apiApplicationProvisioningResume = '/admin/api/v1/application/:id/provisioning/resume';

/**
 * CRUD Application Update
 * usage for CRUD Application update
 * Contract: admin/application/applicationUpdate
 */
export const apiApplicationUpdate = '/admin/api/v1/application/:id/update';

/**
 * CRUD Bank FAQ
 * usage for CRUD Bank FAQ
 * Contract: bankFAQ/*
 */
export const apiBankFAQ = '/admin/api/v1/bank-faq';

/**
 * Update App Customization
 * usage for update app customization
 * Contract: setting/appCustomization
 */
export const apiAppCustomization = '/setting/api/v1/appCustomization';

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
 * Premium Member History Export to XLS
 * usage for Premium Member History Export to XLS
 * Contract: kyc/premiumMember/*
 */
export const apiKycPremiumMemberHistoryExportToXLS = '/kyc/api/v1/premium-member-history/export-to-xls';

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
 * Member Detail
 * usage for member detail
 * Contract: admin/member/memberDetail
 */
export const apiMemberDetail = '/admin/api/v1/member/details';