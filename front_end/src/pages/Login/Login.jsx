import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ButtonCustom from "../../components/Button";
import FormAuth from "../../components/FormAuth";
import Input from "../../components/Input";
import InputPassword from "../../components/InputPassword";
import { loginSchema } from "../../validation/auth";
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "../../contexts/App";
import authApi from "../../apis/auth";

import { GoogleLogin } from "@react-oauth/google"; // 👈 Thêm
import { jwtDecode } from "jwt-decode";


function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: (body) => authApi.login(body)
  });

  const googleLoginMutation = useMutation({
    mutationFn: (body) => authApi.googleLogin(body)
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        const { user } = data.data;

        setIsAuthenticated(true);
        setProfile(user);

        const roleName = user.role?.name?.toLowerCase();
        navigate(roleName === "admin" ? "/admin" : "/");
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.data?.message;

        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error("Mật khẩu chưa chính xác");
        }
      }
    });
  });

  const handleGoogleLogin = (credentialResponse) => {
    const token = credentialResponse.credential;
  
    // ✅ Kiểm tra token nhận được từ Google
    console.log("👉 Token từ Google:", token);
  
    if (!token) {
      toast.error("Không nhận được token từ Google");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      console.log("✅ Token decode thành công:", decoded);
    } catch (error) {
      console.error("❌ Lỗi khi decode token:", error);
      toast.error("Token không hợp lệ");
      return;
    }
  
    // Gửi token lên server
    googleLoginMutation.mutate({ token }, {
      onSuccess: (data) => {
        const { user, token } = data.data;
      
        // ✅ Lưu token vào localStorage để các API authenticated dùng được
        localStorage.setItem("access_token", token);
      
        setIsAuthenticated(true);
        setProfile(user);
      
        console.log("🎉 Đăng nhập Google thành công:", user);
      
        const roleName = user.role?.name?.toLowerCase();
        navigate(roleName === "admin" ? "/admin" : "/");
      }
      
    });
  };
  
  

  return (
    <FormAuth onSubmit={onSubmit} title="Đăng Nhập">
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <Input
            name="email"
            register={register}
            errors={errors}
            label="Email"
          />
          <InputPassword
            name="password"
            register={register}
            errors={errors}
            label="Mật khẩu"
          />
        </Box>

        <ButtonCustom type="submit" fullWidth sx={{ mt: 2 }}>
          Đăng nhập
        </ButtonCustom>

        {/* Nút đăng nhập Google */}
        <Box mt={2} textAlign="center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Đăng nhập Google thất bại")}
            width="100%"
          />
        </Box>

        <Typography mt={3}>
          Bạn chưa có tài khoản?
          <Link style={{ color: "rgb(13, 92, 182)" }} to="/register">
            &nbsp;Đăng ký tài khoản
          </Link>
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <Link
            style={{
              color: "rgb(13, 92, 182)",
              borderBottom: "1px solid black"
            }}
            to="/forgot-password"
          >
            Quên mật khẩu?
          </Link>
        </Typography>
      </Box>
    </FormAuth>
  );
}

export default Login;
