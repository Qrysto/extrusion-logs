import dynamic from 'next/dynamic';

const DynamicLanguageSelector = dynamic(() => import('./LanguageSelector'), {
  ssr: false,
});

export default DynamicLanguageSelector;
