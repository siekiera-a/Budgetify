import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStorage } from "../storage/StorageContext";
import { HttpClient, revokeToken } from "../../libs";

interface HttpContext {
  client: HttpClient;
  loggedIn: boolean;
  setToken: (token: string) => void;
}

interface HttpContextProps {
  children?: React.ReactNode;
}

const defaultValue: HttpContext = {
  client: new HttpClient(""),
  loggedIn: false,
  setToken: () => void 0,
};

const context = createContext(defaultValue);

const { Provider } = context;

const TOKEN_PERSISTENT_KEY = "LANGUAGE_KEY";

export function HttpContextProvider({ children }: HttpContextProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [client, setClient] = useState(new HttpClient(""));
  const { clearProfile, saveProfile } = useStorage();

  const setToken = useCallback(
    async (token: string) => {
      const logIn = token.length > 0;
      if (logIn) {
        await setItemAsync(TOKEN_PERSISTENT_KEY, token);
      } else {
        await deleteItemAsync(TOKEN_PERSISTENT_KEY);
        await clearProfile();
      }
      setLoggedIn(logIn);
      setClient(new HttpClient(token));
    },
    [setClient, setLoggedIn, clearProfile]
  );

  useEffect(() => {
    const func = async () => {
      const token = await getItemAsync(TOKEN_PERSISTENT_KEY);
      if (!token) {
        return;
      }
      const client = new HttpClient(token);
      try {
        const response = await revokeToken(client, { token: token });
        await setItemAsync(TOKEN_PERSISTENT_KEY, response.token);
        await setToken(response.token);
        await saveProfile(response.profile);
      } catch (e) {
        await deleteItemAsync(TOKEN_PERSISTENT_KEY);
        await clearProfile();
      }
    };
    func();
  }, [setToken, clearProfile, saveProfile]);

  return <Provider value={{ client, loggedIn, setToken }}>{children}</Provider>;
}

export function useHttp() {
  return useContext(context);
}
