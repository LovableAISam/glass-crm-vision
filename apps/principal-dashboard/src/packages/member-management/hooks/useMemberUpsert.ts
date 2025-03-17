// Core
import { useEffect, useState } from "react";

// Hooks
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useKycPremiumDetailMemberFetcher, useMemberActivationFetcher } from "@woi/service/co";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from 'notistack';
import { useTranslation } from "react-i18next";
import { useCityListFetcher, useCountryListFetcher, useMemberDetailFetcher, useProvinceListFetcher } from "@woi/service/principal";

// Const & Types
import { CityListResponse } from "@woi/service/co/admin/city/cityList";
import { CountryListResponse } from "@woi/service/co/admin/country/countryList";
import { ProvinceListResponse } from "@woi/service/co/admin/province/provinceList";
import { MemberDetailData, MemberDetailPremium } from "@woi/service/co/idp/member/memberDetail";
import { MemberData } from '@woi/service/co/idp/member/memberList';
import { KycPremiumMemberHistoryDetailData } from "@woi/service/co/kyc/premiumMember/premiumMemberHistoryDetail";
import { UploadDocumentData } from "@woi/uploadDocument";

interface MemberUpsertProps {
  selectedData: MemberData;
  onHide: () => void;
  fetchMemberList: () => void;
}
export interface KycPremiumMemberDetailHistoryForm extends KycPremiumMemberHistoryDetailData {
  identityCardUpload: UploadDocumentData;
  selfie: UploadDocumentData;
  signature: UploadDocumentData;
}

export interface MemberDetailPremiumForm extends MemberDetailPremium {
  identityCard: UploadDocumentData;
  selfie: UploadDocumentData;
  signature: UploadDocumentData;
}

export interface MemberDetailForm extends MemberDetailData {
  premiumMemberDetail: MemberDetailPremiumForm | null;
}

function useMemberUpsert(props: MemberUpsertProps) {
  const { selectedData, onHide, fetchMemberList } = props;
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCommon } = useTranslation('common');

  const [loading, setLoading] = useState<boolean>(false);
  const [memberDetail, setMemberDetail] = useState<MemberDetailForm | null>(null);
  const [memberKYCDetail, setMemberKYCDetail] = useState<KycPremiumMemberDetailHistoryForm | null>(null);
  const [listCountryResidence, setListCountryResidence] = useState<CountryListResponse | null>(null);
  const [listCountryDomicile, setListCountryDomicile] = useState<CountryListResponse | null>(null);
  const [listProvinceResidence, setListProvinceResidence] = useState<ProvinceListResponse | null>(null);
  const [listProvinceDomicile, setListProvinceDomicile] = useState<ProvinceListResponse | null>(null);
  const [listCityResidence, setListCityResidence] = useState<CityListResponse | null>(null);
  const [listCityDomicile, setListCityDomicile] = useState<CityListResponse | null>(null);

  const fetchListCountryResidence = async () => {
    setLoading(true);
    const { result, error } = await useCountryListFetcher(baseUrl, { limit: 100 });

    if (result && !error) {
      setListCountryResidence(result);
    }
    setLoading(false);
  };

  const fetchListCountryDomicile = async () => {
    setLoading(true);
    const { result, error } = await useCountryListFetcher(baseUrl, { limit: 100 });

    if (result && !error) {
      setListCountryDomicile(result);
    }
    setLoading(false);
  };

  const fetchListProvinceResidence = async (countryId: string) => {
    setLoading(true);
    const { result, error } = await useProvinceListFetcher(baseUrl, { "country-id": countryId, limit: 100 });

    if (result && !error) {
      setListProvinceResidence(result);
    }
    setLoading(false);
  };

  const fetchListProvinceDomicile = async (countryId: string) => {
    setLoading(true);
    const { result, error } = await useProvinceListFetcher(baseUrl, { "country-id": countryId, limit: 100 });

    if (result && !error) {
      setListProvinceDomicile(result);
    }
    setLoading(false);
  };

  const fetchListCityResidence = async (provinceId: string) => {
    setLoading(true);
    const { result, error } = await useCityListFetcher(baseUrl, { "province-id": provinceId, limit: 100 });

    if (result && !error) {
      setListCityResidence(result);
    }
    setLoading(false);
  };

  const fetchListCityDomicile = async (provinceId: string) => {
    setLoading(true);
    const { result, error } = await useCityListFetcher(baseUrl, { "province-id": provinceId, limit: 100 });

    if (result && !error) {
      setListCityDomicile(result);
    }
    setLoading(false);
  };

  const fetchMemberDetail = async (memberData: MemberData) => {
    setLoading(true);
    const { result, error } = await useMemberDetailFetcher(baseUrl, {
      memberSecureId: memberData.id,
      phoneNumber: memberData.phoneNumber,
      coSecureId: memberData.coId
    });

    if (result && !error) {
      setMemberDetail({
        ...result,
        premiumMemberDetail: null,
      });
    }
    setLoading(false);
  };

  const fetchMemberKYCHistoryDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useKycPremiumDetailMemberFetcher(baseUrl, id);

    if (result && !error) {
      setMemberKYCDetail({
        ...result,
        identityCardUpload: { docPath: result.identityCard.identityCardUrl },
        selfie: { docPath: result.premiumMember.selfieUrl },
        signature: { docPath: result.premiumMember.signatureUrl },
      });
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'Update Member' }),
      message: tCommon('confirmationCancelCreateDescription'),
      primaryText: tCommon('confirmationCancelCreateYes'),
      secondaryText: tCommon('confirmationCancelCreateNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error'
    });

    if (confirmed) {
      onHide();
    }
  };

  const handleLockUnlock = async () => {
    const isLocked = memberDetail?.activationStatus === 'LOCK';

    const confirmed = await getConfirmation(isLocked ? {
      title: tCommon('confirmationUnlockTitle', { text: 'Member' }),
      message: tCommon('confirmationUnlockDescription', { text: 'Member' }),
      primaryText: tCommon('confirmationUnlockYes'),
      secondaryText: tCommon('confirmationUnlockNo'),
    } : {
      title: tCommon('confirmationLockTitle', { text: 'Member' }),
      message: tCommon('confirmationLockDescription', { text: 'Member' }),
      primaryText: tCommon('confirmationLockYes'),
      secondaryText: tCommon('confirmationLockNo'),
    });

    if (confirmed) {
      const { error } = await useMemberActivationFetcher(baseUrl, selectedData.phoneNumber, {
        activationStatus: isLocked ? 'ACTIVE' : 'LOCK',
      });
      if (!error) {
        enqueueSnackbar(isLocked
          ? tCommon('successUnlock', { text: 'Member' })
          : tCommon('successLock', { text: 'Member' }
          ), { variant: 'info' });
        fetchMemberDetail(selectedData);
        fetchMemberList();
      } else {
        enqueueSnackbar(isLocked
          ? tCommon('failedUnlock', { text: 'Member' })
          : tCommon('failedLock', { text: 'Member' }
          ), { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (selectedData) {
      fetchMemberDetail(selectedData);
      fetchMemberKYCHistoryDetail(selectedData.id);
    }
  }, [selectedData]);


  useEffect(() => {
    const isRegistered = selectedData?.status === 'REGISTERED';
    if (isRegistered && memberKYCDetail) {
      fetchListCountryResidence();
      fetchListCountryDomicile();

      fetchListProvinceResidence(memberKYCDetail?.premiumMember.nationalityId);
      fetchListProvinceDomicile(memberKYCDetail?.premiumMember.nationalityId);

      fetchListCityResidence(memberKYCDetail?.memberResidence.provinceId);
      fetchListCityDomicile(memberKYCDetail?.identityCard.provinceId);
    }
  }, [memberKYCDetail]);

  return {
    memberDetail,
    loading,
    handleCancel,
    handleLockUnlock,
    memberKYCDetail,
    listCountryResidence,
    listCountryDomicile,
    listProvinceResidence,
    listProvinceDomicile,
    listCityResidence,
    listCityDomicile,
    fetchMemberKYCHistoryDetail
  };
}

export default useMemberUpsert;