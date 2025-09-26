/* eslint-disable react-refresh/only-export-components */
// AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextProps {
  isAuth: boolean;
  handleSetAuth: (auth: boolean) => void;
  generateToken: () => string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);

  const handleSetAuth = (auth: boolean) => setIsAuth(auth);

  const generateToken = () => crypto.randomUUID();

  return (
    <AuthContext.Provider value={{ isAuth, handleSetAuth, generateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro do AuthProvider");
  }
  return context;
};
