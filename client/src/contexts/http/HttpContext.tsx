import React, { createContext, useCallback, useContext, useState } from "react";
import { HttpClient } from "../../libs";

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

export function HttpContextProvider({ children }: HttpContextProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [client, setClient] = useState(new HttpClient(""));

  const setToken = useCallback(
    (token: string) => {
      setLoggedIn(token.length > 0);
      setClient(new HttpClient(token));
    },
    [setClient, setLoggedIn]
  );

  return <Provider value={{ client, loggedIn, setToken }}>{children}</Provider>;
}

export function useHttp() {
  return useContext(context);
}
