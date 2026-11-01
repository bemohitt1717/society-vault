import { residentProfile } from './mockResidentData';

const RESIDENT_PROFILE_STORAGE_KEY = 'societyVault.residentProfile';

export const getResidentProfile = () => {
  try {
    const storedProfile = window.localStorage.getItem(RESIDENT_PROFILE_STORAGE_KEY);
    if (!storedProfile) return residentProfile;

    const parsedProfile = JSON.parse(storedProfile);
    if (!parsedProfile || typeof parsedProfile !== 'object' || typeof parsedProfile.name !== 'string') {
      throw new Error('Stored resident profile has an invalid shape.');
    }

    return {
      name: parsedProfile.name,
      email: parsedProfile.email || '',
      phone: parsedProfile.phone || '',
      flatNo: parsedProfile.flatNo || '',
      wing: parsedProfile.wing || '',
    };
  } catch (error) {
    console.error('[Resident profile] Failed to load saved profile:', error);
    return residentProfile;
  }
};

export const saveResidentProfile = (profile) => {
  const essentialDetails = {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    flatNo: profile.flatNo,
    wing: profile.wing,
  };
  window.localStorage.setItem(RESIDENT_PROFILE_STORAGE_KEY, JSON.stringify(essentialDetails));
};
