import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    dispatch(login(data));
    navigate("/");
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
