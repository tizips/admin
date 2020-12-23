import { request } from 'umi';

export async function doLogin(params: ApiLogin.LoginParams) {
  return request<API.Response>('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function doLogout() {
  return request<API.Response>('/api/logout', {
    method: 'POST',
  });
}