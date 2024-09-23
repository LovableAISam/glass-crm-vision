import axios, { AxiosRequestConfig } from 'axios';
import handleResponse, { APIResult } from '@woi/core/api/handleResponse';
import useInterceptorAPI from './useInterceptorAPI';

type apiDeleteProps = {
  path: string,
  baseUrl: string,
  config?: AxiosRequestConfig,
}

async function apiDelete<T>(props: apiDeleteProps): Promise<APIResult<T>> {
  const { path, baseUrl, config } = props;
  const url = `${baseUrl}` + path;
  const instance = useInterceptorAPI(axios, baseUrl);
  
  return await handleResponse<T>(
    instance.delete<APIResult<T>>(url, config)
  );
}

export default apiDelete;
