'use client';

import { useEffect } from 'react';

export default function DisableNumberInputScroll() {
  useEffect(() => {
    document.addEventListener('wheel', () => {
      // @ts-ignore
      if (document.activeElement?.type === 'number') {
        // @ts-ignore
        document.activeElement.blur();
      }
    });
  }, []);
  return null;
}
