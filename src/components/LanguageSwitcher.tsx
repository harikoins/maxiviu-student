import React from 'react';
import { Button, Space } from 'antd';
import useCustomTranslation from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const { changeLanguage } = useCustomTranslation();

  return (
    <Space>
      <Button 
        onClick={() => changeLanguage('en')} 
        type="primary" 
        shape="round"
      >
        English
      </Button>
      <Button 
        onClick={() => changeLanguage('hi')} 
        type="default" 
        shape="round"
      >
        हिंदी
      </Button>
    </Space>
  );
};

export default LanguageSwitcher;

