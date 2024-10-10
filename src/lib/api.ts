'use client';

import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export function get(
  url: string,
  params?: object,
  nextCache?: RequestInit['next']
) {
  return call('GET', url, params, nextCache);
}

export function post(
  url: string,
  params?: object,
  nextCache?: RequestInit['next']
) {
  return call('POST', url, params, nextCache);
}

export function del(
  url: string,
  params?: object,
  nextCache?: RequestInit['next']
) {
  return call('DELETE', url, params, nextCache);
}

export function patch(
  url: string,
  params?: object,
  nextCache?: RequestInit['next']
) {
  return call('PATCH', url, params, nextCache);
}

async function call(
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  url: string,
  params?: object,
  nextCache?: RequestInit['next']
) {
  const res = await fetch(
    `${url}${method === 'GET' ? toQueryString(params) : ''}`,
    {
      cache: nextCache ? undefined : 'no-store',
      next: nextCache,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && params ? JSON.stringify(params) : undefined,
    }
  );
  const json = await res.json();

  if (res.ok) {
    return json;
  } else {
    console.log(json);
    throw json?.error || json;
  }
}

function toQueryString(params?: object) {
  if (!params) return '';
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  if (!query) return '';

  return `?${query}`;
}
