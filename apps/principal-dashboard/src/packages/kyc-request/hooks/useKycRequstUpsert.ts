import { useEffect, useState } from "react";
import { useKycPremiumMemberDetailFetcher, useKycPremiumMemberDttotUpdateFetcher, useKycPremiumMemberVerificationFetcher, useMemberDetailFetcher } from "@woi/service/co";
import { useSnackbar } from "notistack";
import { KycPremiumMemberDetailData } from "@woi/service/principal/kyc/premiumMember/premiumMemberDetail";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useConfirmationDialog } from "@woi/web-component";
import useModal from "@woi/common/hooks/useModal";
import { UploadDocumentData } from "@woi/uploadDocument";
import { VerifyForm } from "../components/ViewKYCRequestVerifyModal";
import { MemberDetailData, MemberDetailPremium } from "@woi/service/co/idp/member/memberDetail";
import { useTranslation } from "react-i18next";

export interface KycPremiumMemberDetailForm extends KycPremiumMemberDetailData {
  identityCard: UploadDocumentData;
  selfie: UploadDocumentData;
  signature: UploadDocumentData;
}

type useKycRequestUpsertProps = {
  selectedId: string | null;
  onHide: () => void;
  fetchKycRequestList: () => void;
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
  const { selectedId, onHide, fetchKycRequestList } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState<boolean>(false);
  const [kycDetail, setKycDetail] = useState<KycPremiumMemberDetailForm | null>(null);
  const [isActiveView, showModalView, hideModalView] = useModal();
  const [memberDetail, setMemberDetail] = useState<MemberDetailForm | null>(null);
  const [touched, setTouched] = useState<boolean>(false);
  const { t: tKYC } = useTranslation('kyc');

  const fetchMemberDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useMemberDetailFetcher(baseUrl, { kycId: id });

    if (result && !error) {
      setMemberDetail({
        ...result,
        // premiumMemberDetail: result.premiumMemberDetail ? {
        //   ...result.premiumMemberDetail,
        //   identityCard: { docPath: result.premiumMemberDetail.identityCardUrl },
        //   selfie: { docPath: result.premiumMemberDetail.selfieUrl },
        //   signature: { docPath: result.premiumMemberDetail.signatureUrl },
        // } : null,
        premiumMemberDetail: null,
      });
    }
    setLoading(false);
  };

  const fetchKYCDetail = async (id: string) => {
    setLoading(true);
    const { result, error } = await useKycPremiumMemberDetailFetcher(baseUrl, id);

    if (result && !error) {
      setKycDetail({
        ...result,
        identityCard: { docPath: result.identityCardUrl },
        selfie: { docPath: result.selfieUrl },
        signature: { docPath: result.signatureUrl },
      });
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
      isDttot: !confirmed
    });
    if (!error) {
      enqueueSnackbar(`${confirmed ? tKYC('successUnregisteredDTTOT') : tKYC('successRegisteredDTTOT')} `, { variant: 'info' });
      fetchKYCDetail(selectedId!);
      fetchMemberDetail(selectedId!);
    } else {
      enqueueSnackbar(`${confirmed ? tKYC('failedUnregisteredDTTOT') : tKYC('failedRegisteredDTTOT')}`, { variant: 'error' });
    }
  };

  const handleShowVerify = () => {
    if (typeof kycDetail?.isDttot !== 'boolean') {
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
      fetchMemberDetail(selectedId);
    }
  }, [selectedId]);

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
  };
}

export default useKycRequestUpsert;
