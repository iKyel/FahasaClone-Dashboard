import { UserService } from "@/services/user.service";
import { UserDTO } from "@/types/user.type";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const useEmployees = (search: string) => {
  const userService = useMemo(() => UserService.getInstance(), []);
  const [employees, setEmployees] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = search
          ? await userService.search({ searchUser: search, loaiTK: "NV" })
          : await userService.getEmployees();

        if (response.success) {
          setEmployees(response.data?.user || []);
        } else {
          toast.error(response.error?.message || "Failed to fetch employees");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred while fetching employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [userService, search]);

  return { employees, setEmployees, loading };
};

export default useEmployees;
