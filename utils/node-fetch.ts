import fetch from 'node-fetch';
import { toQueryString } from './index';

export interface APIResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}

export interface QueryParams {
  limit?: number;
  page?: number;
}

class NodeFetch<T = void> {
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private endpoint: string;

  private request = async (url: string, body?: string, method?: string) => {
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const isValidBody = body && Object.keys(body).length > 0;
      const fetchOptions = {
        headers,
        body: isValidBody ? body : null,
        method: method || 'GET',
      };
      const request = await fetch(url, fetchOptions);
      if (request.headers.get('content-type').includes('text')) {
        return {
          content: {
            status: request.status,
            statusText: request.statusText,
          },
        };
      }
      const response = await request.json();
      if (typeof response.error === 'object') {
        const { error, message } = response.error;
        return {
          error,
          message,
        };
      }
      return response;
    } catch (e) {
      return {
        error: e,
        message: e.message,
      };
    }
  };

  getAll = async (queryParams?: QueryParams): Promise<APIResponse<T[]>> => {
    const queryString =
      queryParams && Object.values(queryParams).length
        ? '?' + toQueryString(queryParams)
        : '';
    const url =
      process.env.NEXT_PUBLIC_NFT_ENDPOINT + this.endpoint + queryString;
    return this.request(url, null);
  };
}

export default NodeFetch;
