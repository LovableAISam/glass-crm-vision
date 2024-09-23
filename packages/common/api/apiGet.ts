import axios, { AxiosRequestConfig } from 'axios';
import handleResponse, { APIResult } from '@woi/core/api/handleResponse';
import useInterceptorAPI from './useInterceptorAPI';

type apiGetProps = {
  path: string,
  baseUrl: string,
  config?: AxiosRequestConfig,
}

async function apiGet<T>(props: apiGetProps): Promise<APIResult<T>> {
  const { path, baseUrl, config } = props;
  const url = `${baseUrl}` + path;
  const instance = useInterceptorAPI(axios, baseUrl);

  return await handleResponse<T>(
    instance.get<APIResult<T>>(url, config)
  );
}

export default apiGet;
