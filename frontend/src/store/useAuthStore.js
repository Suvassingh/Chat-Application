import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp:false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally{
        set({isCheckingAuth:false})
    }
  },
  signup:async(data)=>{
    set({isSigningUp:true })
    try{
        const res = await axiosInstance.post("/auth/signup",data);
        set({authUser:res.data});
console.log(res)
        // toastify
        toast.success("Account created successfully!")
    }catch(error){
            if (error.response) {
              // Server responded with an error status
              toast.error(error.response.data.message);
            } else {
              // Network or unexpected error
              toast.error(error.message || "Something went wrong");
            }


    }finally{
          set({isSigningUp:false })

    }
  }
}));
