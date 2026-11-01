import { useState } from 'react';

const useSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('society');
  return { activeSection, setActiveSection };
};

export default useSettingsPage;
