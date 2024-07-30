import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  Secret,
  SignOptions,
  SignCallback,
  GetPublicKeyOrSecret,
  VerifyOptions,
  VerifyCallback,
} from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SignResult = Parameters<SignCallback>[1];
export function jwtSign(
  payload: string | Buffer | object,
  secretOrPrivateKey: Secret,
  options?: SignOptions & { algorithm: 'none' }
) {
  return new Promise<SignResult>((resolve, reject) => {
    const callback: SignCallback = (err, encoded) => {
      if (err) reject(err);
      resolve(encoded);
    };
    if (options) {
      sign(payload, secretOrPrivateKey, options, callback);
    } else {
      sign(payload, secretOrPrivateKey, callback);
    }
  });
}

type VerifyResult = Parameters<VerifyCallback>[1];
export function jwtVerify(
  token: string,
  secretOrPublicKey: Secret | GetPublicKeyOrSecret,
  options?: VerifyOptions & { complete?: boolean }
) {
  return new Promise<VerifyResult>((resolve, reject) => {
    const callback: VerifyCallback = (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    };
    verify(token, secretOrPublicKey, options, callback);
  });
}
