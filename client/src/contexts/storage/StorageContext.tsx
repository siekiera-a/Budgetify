import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { Profile } from "../../libs";

export interface StorageContext {
  saveProfile(profile: Profile): Promise<void>;
  clearProfile(): Promise<void>;
  loadProfile(): Promise<void>;
  profile?: Profile;
}

export interface StorageContextProps {
  children?: React.ReactNode;
}

const defaultValue: StorageContext = {
  saveProfile: () => new Promise((resolve) => resolve()),
  clearProfile: () => new Promise((resolve) => resolve()),
  loadProfile: () => new Promise((resolve) => resolve()),
};

const storageContext = createContext<StorageContext>(defaultValue);

const { Provider } = storageContext;

const PROFILE_PERSISTANCE_KEY = "PROFILE";

export function StorageContextProvider({ children }: StorageContextProps) {
  const [profile, setProfile] = useState<Profile>();

  const loadProfile = useCallback(async () => {
    const data = await getItemAsync(PROFILE_PERSISTANCE_KEY);
    if (data) {
      const profile = JSON.parse(data) as Profile;
      setProfile(profile);
    }
  }, [setProfile]);

  const saveProfile = useCallback(
    async (profile: Profile) => {
      setProfile(profile);
      await setItemAsync(PROFILE_PERSISTANCE_KEY, JSON.stringify(profile));
    },
    [setProfile]
  );

  const clearProfile = useCallback(async () => {
    setProfile(undefined);
    await deleteItemAsync(PROFILE_PERSISTANCE_KEY);
  }, [setProfile]);

  return (
    <Provider value={{ profile, saveProfile, clearProfile, loadProfile }}>
      {children}
    </Provider>
  );
}

export function useStorage() {
  return useContext(storageContext);
}
