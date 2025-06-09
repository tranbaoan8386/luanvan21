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

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        const { user } = data.data;

        console.log("🔑 User login response:", user);
        console.log("🔎 Role:", user.role);
        console.log("🔎 Role name:", user.role?.name);

        setIsAuthenticated(true);
        setProfile(user);

        const roleName = user.role?.name?.toLowerCase();
        if (roleName === "admin") {
          console.log("✅ Navigating to /admin");
          navigate("/admin");
        } else {
          console.log("✅ Navigating to /");
          navigate("/");
        }
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
