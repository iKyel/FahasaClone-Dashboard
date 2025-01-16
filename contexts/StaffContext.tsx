import { UserService } from "@/services/user.service";
import { UserDTO } from "@/types/user.type";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

interface StaffContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  staff: UserDTO | null;
  setStaff: Dispatch<SetStateAction<UserDTO | null>>;
}

const StaffContext = createContext<StaffContextProps>({
  staff: null,
  setStaff: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const [staff, setStaff] = useState<UserDTO | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const getAccount = async () => {
      const response = await userService.getAccount();
      if (response.success) {
        setStaff(response?.data?.user || null);
        setIsAuthenticated(true);
      }
    };

    getAccount();
  }, [userService]);

  return (
    <StaffContext.Provider
      value={{ staff, setStaff, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export default StaffContext;
