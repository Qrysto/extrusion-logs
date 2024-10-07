import vi from './vi.json';
import kr from './kr.json';

export function translateEn(text: string) {
  return text;
}

export function translateVi(text: string) {
  return (vi as Record<string, string>)[text] || text;
}

export function translateKr(text: string) {
  return (kr as Record<string, string>)[text] || text;
}
