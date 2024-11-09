import { useEffect, useState } from "react";
import { useKycPremiumMemberDetailFetcher, useKycPremiumMemberDttotUpdateFetcher, useKycPremiumMemberHistoryDetailFetcher, useKycPremiumMemberVerificationFetcher, useMemberDetailFetcher, useProvinceListFetcher } from "@woi/service/co";
import { useSnackbar } from "notistack";
import { KycPremiumMemberDetailData } from "@woi/service/co/kyc/premiumMember/premiumMemberDetail";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useConfirmationDialog } from "@woi/web-component";
import useModal from "@woi/common/hooks/useModal";
import { UploadDocumentData } from "@woi/uploadDocument";
import { VerifyForm } from "../components/ViewKYCRequestVerifyModal";
import { MemberDetailData, MemberDetailPremium } from "@woi/service/co/idp/member/memberDetail";
import { useTranslation } from "react-i18next";
import { KycPremiumMemberHistoryDetailData } from "@woi/service/co/kyc/premiumMember/premiumMemberHistoryDetail";
import { ProvinceListResponse } from "@woi/service/co/admin/province/provinceList";
import { CityListResponse } from "@woi/service/co/admin/city/cityList";
import { useCityListFetcher } from "@woi/service/principal";
import useCountryListFetcher, { CountryListResponse } from "@woi/service/co/admin/country/countryList";
import { TextGetter } from "@woi/core";

export interface KycPremiumMemberDetailForm extends KycPremiumMemberDetailData {
  identityCardUpload: UploadDocumentData;
  selfie: UploadDocumentData;
  signature: UploadDocumentData;
}

export interface KycPremiumMemberDetailHistoryForm extends KycPremiumMemberHistoryDetailData {
  identityCardUpload: UploadDocumentData;
  selfie: UploadDocumentData;
  signature: UploadDocumentData;
}

type useKycRequestUpsertProps = {
  selectedId: string | null;
  onHide: () => void;
  fetchKycRequestList: () => void;
  isHistory: boolean;
  phoneNumber: string | null;
  memberSecureId: string | null;
};

export interface MemberDetailPremiumForm extends MemberDetailPremium {
  identityCard: UploadDocumentData;
  selfie: UploadDocumentData;
  signature: UploadDocumentData;
}

export interface MemberDetailForm extends MemberDetailData {
  premiumMemberDetail: MemberDetailPremiumForm | null;
}

function useKycRequestUpsert(props: useKycRequestUpsertProps) {
  const { selectedId, onHide, fetchKycRequestList, isHistory, phoneNumber, memberSecureId } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState<boolean>(false);
  const [kycDetail, setKycDetail] = useState<KycPremiumMemberDetailForm | null>(null);
  const [kycDetailHistory, setKycDetailHistory] = useState<KycPremiumMemberDetailHistoryForm | null>(null);
  const [listCountryResidence, setListCountryResidence] = useState<CountryListResponse | null>(null);
  const [listCountryDomicile, setListCountryDomicile] = useState<CountryListResponse | null>(null);
  const [listProvinceResidence, setListProvinceResidence] = useState<ProvinceListResponse | null>(null);
  const [listProvinceDomicile, setListProvinceDomicile] = useState<ProvinceListResponse | null>(null);
  const [listCityResidence, setListCityResidence] = useState<CityListResponse | null>(null);
  const [listCityDomicile, setListCityDomicile] = useState<CityListResponse | null>(null);
  const [isActiveView, showModalView, hideModalView] = useModal();
  const [memberDetail, setMemberDetail] = useState<MemberDetailForm | null>(null);
  const [touched, setTouched] = useState<boolean>(false);
  const { t: tKYC } = useTranslation('kyc');

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

  const fetchMemberDetail = async (secureId: string, phone: string) => {
    setLoading(true);
    const { result, error } = await useMemberDetailFetcher(baseUrl, { memberSecureId: secureId, phoneNumber: phone });

    if (result && !error) {
      setMemberDetail({
        ...result,
        premiumMemberDetail: null,
      });
    }
    setLoading(false);
  };

  const fetchKYCDetail = async (id: string) => {
    setLoading(true);
    if (isHistory) {
      const { result, error } = await useKycPremiumMemberHistoryDetailFetcher(baseUrl, id);
      if (result && !error) {
        setKycDetailHistory({
          ...result,
          identityCardUpload: { docPath: result.identityCard.identityCardUrl },
          selfie: { docPath: result.premiumMember.selfieUrl },
          signature: { docPath: result.premiumMember.signatureUrl },
        });
      }
    }
    if (!isHistory) {
      const { result, error } = await useKycPremiumMemberDetailFetcher(baseUrl, id);
      if (result && !error) {
        setKycDetail({
          ...result,
          identityCardUpload: { docPath: result.identityCard.identityCardUrl },
          selfie: { docPath: result.premiumMember.selfieUrl },
          signature: { docPath: result.premiumMember.signatureUrl },
        });
      }
    }
    setLoading(false);
  };

  const handleRegisterDttot = async () => {
    const confirmed = await getConfirmation({
      title: tKYC('confirmationRegisteredDTTOT'),
      message: tKYC('confirmationRegisteredDTTOTMessage'),
      primaryText: tKYC('confirmationRegisteredDTTOTYes'),
      btnPrimaryColor: 'inherit',
      secondaryText: tKYC('confirmationRegisteredDTTOTNo'),
      btnSecondaryColor: 'primary',
    });

    const { error } = await useKycPremiumMemberDttotUpdateFetcher(baseUrl, selectedId!, {
      id: selectedId!,
      isDttot: confirmed
    });
    if (!error) {
      enqueueSnackbar(`${confirmed ? tKYC('successUnregisteredDTTOT') : tKYC('successRegisteredDTTOT')} `, { variant: 'info' });
      fetchKYCDetail(selectedId!);
      fetchMemberDetail(memberSecureId!, phoneNumber!);
    } else {
      enqueueSnackbar(`${confirmed ? tKYC('failedUnregisteredDTTOT') : tKYC('failedRegisteredDTTOT')}`, { variant: 'error' });
    }
  };

  const handleShowVerify = () => {
    if (typeof kycDetail?.premiumMember.isDttot !== 'boolean') {
      setTouched(true);
      return;
    }
    showModalView();
  };

  const handleVerify = async (form: VerifyForm) => {
    const confirmed = await getConfirmation({
      title: tKYC('confirmationVerifyMember'),
      message: tKYC('confirmationVerifyMemberMessage'),
      primaryText: tKYC('confirmationVerifyMemberYes'),
      secondaryText: tKYC('confirmationVerifyMemberNo'),
    });

    if (confirmed) {
      const { error } = await useKycPremiumMemberVerificationFetcher(baseUrl, selectedId!, {
        id: selectedId!,
        reason: form.reason,
        status: form.status,
        createdDate: TextGetter.getterString(kycDetail?.premiumMember.createdDate),
        modifiedDate: new Date(Date.now()).toISOString()
      });
      if (!error) {
        enqueueSnackbar(tKYC('successVerifyMember'), { variant: 'success' });
        hideModalView();
        onHide();
        fetchKycRequestList();
      } else {
        enqueueSnackbar(tKYC('failedVerifyMember'), { variant: 'error' });
      }

    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchKYCDetail(selectedId);
      fetchMemberDetail(memberSecureId!, phoneNumber!);
    }
  }, [selectedId]);

  useEffect(() => {
    const data = isHistory ? kycDetailHistory : kycDetail;
    if (data) {
      fetchListCountryResidence();
      fetchListCountryDomicile();

      fetchListProvinceResidence(data?.premiumMember.nationalityId);
      fetchListProvinceDomicile(data?.premiumMember.nationalityId);

      fetchListCityResidence(data?.memberResidence.provinceId);
      fetchListCityDomicile(data?.identityCard.provinceId);
    }
  }, [kycDetailHistory, kycDetail]);

  return {
    isActiveView,
    memberDetail,
    kycDetail,
    loading,
    touched,
    showModalView,
    hideModalView,
    handleShowVerify,
    handleVerify,
    handleRegisterDttot,
    kycDetailHistory,
    listCountryResidence,
    listCountryDomicile,
    listProvinceResidence,
    listProvinceDomicile,
    listCityResidence,
    listCityDomicile,
  };
}

export default useKycRequestUpsert;
