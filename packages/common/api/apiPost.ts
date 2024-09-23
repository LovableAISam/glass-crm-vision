import axios, { AxiosRequestConfig } from 'axios';
import handleResponse, { APIResult } from '@woi/core/api/handleResponse';
import { wrapPayload } from '@woi/core/api';
import useInterceptorAPI from './useInterceptorAPI';

type apiPostProps = {
  path: string,
  baseUrl: string,
  payload?: Object,
  config?: AxiosRequestConfig,
}

async function apiPost<T>(props: apiPostProps): Promise<APIResult<T>> {
  const { path, baseUrl, payload, config } = props;
  const url = `${baseUrl}` + path;
  const payloadData = wrapPayload(payload, undefined);
  const instance = useInterceptorAPI(axios, baseUrl);
  
  return await handleResponse<T>(
    instance.post<APIResult<T>>(url, payloadData, config)
  );
}

export default apiPost;
