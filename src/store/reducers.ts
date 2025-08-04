import { combineReducers } from "redux"

// Layout
import Layout from "./layout/reducer";

//login
import login from "./auth/login/reducer";

//register
import register from "./auth/register/reducer";

// User Profile 
import profile from "./auth/profile/reducer";

// Forget Password
import forgetPassword from "./auth/forgetpwd/reducer";


const rootReducer = combineReducers({
  // public
  Layout,
  login,
  register,
  profile,
  forgetPassword
})

export default rootReducer
