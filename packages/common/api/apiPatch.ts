import axios, { AxiosRequestConfig } from 'axios';
import handleResponse, { APIResult } from '@woi/core/api/handleResponse';
import { wrapPayload } from '@woi/core/api';
import useInterceptorAPI from './useInterceptorAPI';

type apiPatchProps = {
  path: string,
  baseUrl: string,
  payload?: Object,
  config?: AxiosRequestConfig,
}

async function apiPatch<T>(props: apiPatchProps): Promise<APIResult<T>> {
  const { path, baseUrl, payload, config } = props;
  const url = `${baseUrl}` + path;
  const payloadData = wrapPayload(payload, undefined);
  const instance = useInterceptorAPI(axios, baseUrl);
  
  return await handleResponse<T>(
    instance.patch<APIResult<T>>(url, payloadData, config)
  );
}

export default apiPatch;
