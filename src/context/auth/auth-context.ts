import { createContext } from 'react';

type AuthContextT = {
  token: string;
  id: string;
  onLogout: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  isLoggedIn?: boolean;
  //   onRegister: ({ email, password, balang_id, name }: RegistrationType) => void;
};

export const AuthContext = createContext<AuthContextT | null>({
  id: '',
  isLoggedIn: false,
  onLogout: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLogin: async (email: string, password: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   onRegister: ({ balang_id, name, email }) => void {},
  token: '',
  isLoading: false
});
