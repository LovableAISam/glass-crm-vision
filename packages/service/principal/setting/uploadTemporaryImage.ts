import { constructFormData } from '@woi/core/api';
import { apiSettingUploadTemporaryImage } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type UploadTemporaryImageResponse = {
  url: string;
}

export type UploadTemporaryImageRequest = {
  upload: File;
  type?: 'KTP' | 'SELFIE' | 'SIGNATURE' | 'APP_CUSTOMIZATION' | 'MERCHANT';
}

function useUploadTemporaryImageFetcher(baseUrl: string, payload: UploadTemporaryImageRequest) {
  return apiPost<UploadTemporaryImageResponse>({
    baseUrl,
    path: `${apiSettingUploadTemporaryImage}`,
    payload: constructFormData(payload),
  });
}

export default useUploadTemporaryImageFetcher;
