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
      timeout: 10000, // Default timeout in milliseconds (10 seconds)
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options, // allows override of timeout and other options
    });

    return response.data as T;
  } catch (error: any) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out!');
    } else {
      console.error('Axios error:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
  throw error;
}
}
