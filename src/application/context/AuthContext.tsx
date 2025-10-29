/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getUser } from "../../service/http/storage";
import type { TUserProps } from "../../domain/types/users";

interface AuthContextProps {
  isAuth: boolean;
  user: TUserProps | null;
  role: string | null;
  loading: boolean; // 1. ADICIONE O ESTADO DE LOADING
  handleSetAuth: (auth: boolean) => void;
  generateToken: () => string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<TUserProps | null>(null);
  const [loading, setLoading] = useState(true); // 2. INICIE COMO TRUE

  const handleSetAuth = (auth: boolean) => setIsAuth(auth);
  const generateToken = () => crypto.randomUUID();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const currentUser = getUser();
      if (currentUser) {
        setIsAuth(true);
        setUser(currentUser);
      } else {
        setIsAuth(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    } else {
      setIsAuth(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        role: user?.role || null,
        loading,
        handleSetAuth,
        generateToken,
      }}
    >
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
