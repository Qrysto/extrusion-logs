import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function get(url: string, params?: object, nextCache?: object) {
  return call('GET', url, params, nextCache);
}

export function post(url: string, params?: object, nextCache?: object) {
  return call('POST', url, params, nextCache);
}

async function call(
  method: 'GET' | 'POST',
  url: string,
  params?: object,
  nextCache?: object
) {
  const res = await fetch(
    `${url}${method === 'GET' ? toQueryString(params) : ''}`,
    {
      cache: nextCache ? undefined : 'no-store',
      next: nextCache || undefined,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(params) : undefined,
    }
  );
  const json = await res.json();

  if (res.ok) {
    return json?.result;
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
