import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../services/api/authApi';
import { getApiErrorMessage } from '../../../services/api/http';

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  flatNo: '',
  wing: '',
};

const useResidentProfile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => {
        if (!active) return;
        const details = user?.profile || {};
        setProfile({
          name: details.name || user?.name || '',
          email: user?.email || '',
          phone: details.phone || '',
          flatNo: details.flatNo || '',
          wing: details.wing || '',
        });
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return {
    profile,
    isLoading,
    error,
    reload: () => {
      setIsLoading(true);
      setError('');
      setReloadKey((key) => key + 1);
    },
  };
};

export default useResidentProfile;
