import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { setItemAsync, deleteItemAsync } from "expo-secure-store";
import { Profile } from "../../libs";

export interface StorageContext {
  saveProfile(profile: Profile): Promise<void>;
  clearProfile(): Promise<void>;
  profile?: Profile;
}

export interface StorageContextProps {
  children?: React.ReactNode;
}

const defaultValue: StorageContext = {
  saveProfile: () => new Promise((resolve) => resolve()),
  clearProfile: () => new Promise((resolve) => resolve()),
};

const storageContext = createContext<StorageContext>(defaultValue);

const { Provider } = storageContext;

const PROFILE_PERSISTANCE_KEY = "PROFILE";

export function StorageContextProvider({ children }: StorageContextProps) {
  const [profile, setProfile] = useState<Profile>();

  const saveProfile = useCallback(
    async (profile: Profile) => {
      await setItemAsync(PROFILE_PERSISTANCE_KEY, JSON.stringify(profile));
      setProfile(profile);
    },
    [setProfile]
  );

  const clearProfile = useCallback(async () => {
    await deleteItemAsync(PROFILE_PERSISTANCE_KEY);
    setProfile(undefined);
  }, [setProfile]);

  return (
    <Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </Provider>
  );
}

export function useStorage() {
  return useContext(storageContext);
}
