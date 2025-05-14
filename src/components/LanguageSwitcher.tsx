import React from 'react';
import useCustomTranslation from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const { changeLanguage } = useCustomTranslation();

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('hi')}>हिंदी</button>
    </div>
  );
};

export default LanguageSwitcher;
