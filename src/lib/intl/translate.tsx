import vi from './vi.json';
import kr from './kr.json';

export function translateEn(text: string, interpolations?: Interpolations) {
  const baseText = text;
  return interpolations ? interpolate(baseText, interpolations) : baseText;
}

export function translateVi(text: string, interpolations?: Interpolations) {
  const baseText = (vi as Record<string, string>)[text] || text;
  return interpolations ? interpolate(baseText, interpolations) : baseText;
}

export function translateKr(text: string, interpolations?: Interpolations) {
  const baseText = (kr as Record<string, string>)[text] || text;
  return interpolations ? interpolate(baseText, interpolations) : baseText;
}

function interpolate(text: string, params: Interpolations) {
  let finalText = text;
  for (const key in params) {
    finalText = finalText.replaceAll(`%${key}%`, String(params[key]));
  }
  return finalText;
}

type Interpolations = { [key: string]: any };
