import { createContext } from 'react';
export type UserType = {
  id: string;
  role: string;
  name: string;
  email: string;
  center?: string;
  staff?: string;
};

export type AuthContextT = {
  token: string;
  id: string;
  user: UserType | null;
  onLogout: () => void;
  onLogin: (
    email: string,
    password: string,
    redirect?: string | undefined | null
  ) => Promise<void>;
  isLoading: boolean;
  isLoggedIn?: boolean;
  //   onRegister: ({ email, password, balang_id, name }: RegistrationType) => void;
};

export const AuthContext = createContext<AuthContextT | null>({
  id: '',
  user: {
    center: '',
    email: '',
    id: '',
    name: '',
    role: '',
    staff: ''
  } as UserType,
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
