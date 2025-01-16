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
  staff: UserDTO | null;
  setStaff: Dispatch<SetStateAction<UserDTO | null>>;
}

const StaffContext = createContext<StaffContextProps>({
  staff: null,
  setStaff: () => {},
});

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const [staff, setStaff] = useState<UserDTO | null>(null);

  useEffect(() => {
    const getAccount = async () => {
      const response = await userService.getAccount();
      if (response.success) {
        setStaff(response?.data?.user || null);
      }
    };

    getAccount();
  }, [userService]);

  return (
    <StaffContext.Provider value={{ staff, setStaff }}>
      {children}
    </StaffContext.Provider>
  );
};

export default StaffContext;
