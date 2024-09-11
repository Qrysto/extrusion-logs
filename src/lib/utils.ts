import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function memoize<T, P extends Array<any>, R>(
  resultFn: (this: T, ...args: P) => R,
  isEqual = areInputsEqual
) {
  let lastThis: T;
  let lastArgs: P | never[] = [];
  let lastResult: R;
  let calledOnce = false;

  // breaking cache when context (this) or arguments change
  function memoized(this: T, ...newArgs: P) {
    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult;
    }

    // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
    // Doing the lastResult assignment first so that if it throws
    // nothing will be overwritten
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }

  return memoized;
}

function areInputsEqual<P extends Array<any>>(
  newInputs: P,
  lastInputs: P | never[]
) {
  // no checks needed if the inputs length has changed
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  // Using for loop for speed. It generally performs better than array.every
  // https://github.com/alexreardon/memoize-one/pull/59
  for (let i = 0; i < newInputs.length; i++) {
    // using shallow equality check
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }
  return true;
}

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

async function call(
  method: 'GET' | 'POST',
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
      body: method === 'POST' && params ? JSON.stringify(params) : undefined,
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
