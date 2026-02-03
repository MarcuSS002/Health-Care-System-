import { createContext, useEffect, useState } from "react";
import { doctors as assetsDoctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Initialize with static assets doctors so UI has images immediately
  const [doctors, setDoctors] = useState(assetsDoctors || []);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem("userData");
      return stored ? JSON.parse(stored) : false;
    } catch (e) {
      return false;
    }
  });

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        // Only replace assets doctors if backend returned non-empty list
        if (data.doctors && data.doctors.length > 0) setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  // Keep localStorage in sync so profile is available on revisit
  useEffect(() => {
    try {
      if (userData) localStorage.setItem("userData", JSON.stringify(userData));
      else localStorage.removeItem("userData");
    } catch (e) {
      console.log("Failed to sync userData to localStorage", e);
    }
  }, [userData]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
