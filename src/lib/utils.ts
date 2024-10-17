import { memo } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const genId = (() => {
  let count = 0;
  return () => {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
  };
})();

export const genericMemo: <T>(component: T) => T = memo;

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

export function toMinutes(time: string) {
  const hours = parseInt(time.substring(0, 2)) || 0;
  const minutes = parseInt(time.substring(3)) || 0;
  return hours * 60 + minutes;
}
