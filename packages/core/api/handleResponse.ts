import { DefaultResponse, APIResponse, ErrorResponse } from './types';
import request, { AxiosPromise } from 'axios';
import { apiAuth } from '@woi/common/meta/apiPaths/principalApiPaths';

export const NETWORK_ERROR = 'NETWORK_ERROR';
export const GENERAL_ERROR = 'GENERAL_ERROR';

export function createErrorMessage(httpCode: string, message: string): string {
  return `${httpCode ? httpCode + ': ' : ''}${message}`;
}

export interface APIResult<T> {
  response?: APIResponse<T>;
  result?: T | null;
  error?: Error;
  errorCode?: string | null;
  errorData?: DefaultResponse;
  displayMessage?: string | null;
}

async function handleResponse<T>(
  promise: AxiosPromise
): Promise<APIResult<T>> {
  try {
    const response = await promise;
    const data = response.data;

    // data.state to handle response from help center
    if (response.status >= 300) {
      throw new Error(createErrorMessage(String(response.status), 'Error'));
    }

    return { response: data, result: data };
  } catch (error) {
    if (request.isAxiosError(error) && error.response) {
      if (error.response.config?.url?.includes(apiAuth)) {
        const response = error.response?.data as ErrorResponse;
        if (response) {
          return {
            error,
            displayMessage: response.error_description
          };
        }
      } else {
        const response = error.response?.data as DefaultResponse;
        if (response) {
          return {
            error,
            errorCode: generateErrorCode(response.errorCode),
            errorData: response,
            displayMessage: response.message
          };
        }
      }
    }
    // eslint-disable-next-line no-console
    console.log(`
      Error while trying to connect to 
      ${error}
    `);

    let errorCode = GENERAL_ERROR;

    // @ts-ignore
    if (error.message === 'Network Error') {
      errorCode = NETWORK_ERROR;
    }

    // @ts-ignore
    return { error, errorCode };
  }
}

function generateErrorCode(api_code: number) {
  switch (api_code) {
    case 409: {
      return GENERAL_ERROR;
    }
    default: {
      return GENERAL_ERROR;
    }
  }
}

export default handleResponse;
