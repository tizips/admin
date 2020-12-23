import { request } from 'umi';

export async function query() {
  // return request<API.CurrentUser[]>('/api/users');
}

export async function doUserinfo() {
  return request<API.Response>('/api/userinfo');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
