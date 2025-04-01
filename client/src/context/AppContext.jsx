import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.withCredentials = true; // ✅ Move outside component

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        if (!isLoggedin) { // ✅ Only update if state changes
          setIsLoggedin(true);
          getUserData();
        }
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setIsLoggedin(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data');
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getAuthState();
  }, [backendUrl]); // ✅ Add backendUrl as a dependency

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
