/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
    const isAuthenticated = () => {
        if(localStorage.getItem('token') !== null) {
            return children
        } else {
            return <Navigate to ="/login"/>
        }
    }   

    return isAuthenticated();
  
}



//this is nothing but a function you were simply not returning anything
 