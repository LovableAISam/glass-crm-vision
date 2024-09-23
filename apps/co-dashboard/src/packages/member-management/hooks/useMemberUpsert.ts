import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import { useMemberDetailFetcher, useMemberActivationFetcher, useMemberKYCDetailFetcher } from "@woi/service/co";

// Hooks
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from 'notistack';
import { MemberData } from '@woi/service/co/idp/member/memberList';
import { useEffect, useState } from "react";
import { MemberDetailData, MemberDetailPremium } from "@woi/service/co/idp/member/memberDetail";
import { UploadDocumentData } from "@woi/uploadDocument";
import { useTranslation } from "react-i18next";
import { MemberKYCDetailData } from "@woi/service/co/idp/member/memberKYCDetail";

interface MemberUpsertProps {
  selectedData: MemberData;
  onHide: () => void;
  fetchMemberList: () => void;
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
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();
  const [memberDetail, setMemberDetail] = useState<MemberDetailForm | null>(null);
  const [memberKYCDetail, setMemberKYCDetail] = useState<MemberKYCDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { t: tCommon } = useTranslation('common');

  const fetchMemberDetail = async (memberData: MemberData) => {
    setLoading(true);
    const { result, error } = await useMemberDetailFetcher(baseUrl, {
      memberSecureId: memberData.id,
      phoneNumber: memberData.phoneNumber,
    });

    if (result && !error) {
      setMemberDetail({
        ...result,
        premiumMemberDetail: null,
      });
    }
    setLoading(false);
  };

  const fetchMemberKYCDetail = async (memberData: MemberData) => {
    setLoading(true);
    const { result, error } = await useMemberKYCDetailFetcher(baseUrl, {
      phoneNumber: memberData.phoneNumber,
    });

    if (result && !error) {
      setMemberKYCDetail({
        ...result,
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
      fetchMemberKYCDetail(selectedData);
    }
  }, [selectedData]);

  return {
    memberDetail,
    loading,
    handleCancel,
    handleLockUnlock,
    memberKYCDetail
  };
}

export default useMemberUpsert;