import React from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (data) => {
    dispatch(register(data));
    navigate("/login");
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
