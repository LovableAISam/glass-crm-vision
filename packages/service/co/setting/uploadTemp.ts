import { constructFormData } from '@woi/core/api';
import { apiUploadTemp } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type UploadTempResponse = {
  fileKey: string;
  fileUrl: string;
}

export type UploadTempRequest = {
  fileName: string;
  file: File;
}

function useUploadTempFetcher(baseUrl: string, payload: UploadTempRequest) {
  return apiPost<UploadTempResponse>({
    baseUrl,
    path: `${apiUploadTemp}`,
    payload: constructFormData(payload),
  });
}

export default useUploadTempFetcher;
