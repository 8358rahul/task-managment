import axios, { AxiosRequestConfig, Method } from 'axios';

export async function fetcher<T = any>(
  url: string,
  method: Method = 'GET',
  body?: any,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axios({
      url,
      method,
      data: body, // only used for POST/PUT
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    return response.data as T;
  } catch (error: any) {
    console.error('Axios fetch error:', error?.message || error);
    throw error;
  }
}
