import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      console.log(res);
      // toastify
      toast.success("Account created successfully!");
    } catch (error) {
      if (error.response) {
        // Server responded with an error status
        toast.error(error.response.data.message);
      } else {
        // Network or unexpected error
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      console.log(res);
      // toastify
      toast.success("Loggedin  successfully!");
    } catch (error) {
      if (error.response) {
        // Server responded with an error status
        toast.error(error.response.data.message);
      } else {
        // Network or unexpected error
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logged out");
      console.log("Logout error:", error);
    }
  },
  // updateProfile:async(data)=>{
  //   try{
  //     const res= await axiosInstance.put("/auth/update-profile",data)
  //     set({authUser:res.data})
  //     toast.success("Profile updated successfully")
  //   }catch(error){
  //     console.log("Error in update profil:",error);
  //     toast.error(error.responce.data.message);
  //   }
  // }

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);

      if (error.response) {
        // Server responded with an error
        toast.error(error.response.data.message);
      } else if (error.request) {
        // Request made but no response (server down, CORS, etc.)
        toast.error("No response from server. Please try again.");
      } else {
        // Other errors (like internet disconnected)
        toast.error("Network error: " + error.message);
      }
    }
  },
}));
