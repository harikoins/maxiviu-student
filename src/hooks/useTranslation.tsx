import { useTranslation } from 'react-i18next';

const useCustomTranslation = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return { t, changeLanguage };
};

export default useCustomTranslation;
