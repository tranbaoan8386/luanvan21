import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import ButtonCustom from "../../components/Button";
import Input from "../../components/Input";
import authApi from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc")
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema)
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await authApi.forgotPassword(data);
      console.log("Response from API:", response); // Kiểm tra phản hồi từ API

      if (response.status === 200) {
        toast.success(response.message); // Hiển thị thông báo thành công
        navigate("/reset-password");
      } else {
        console.error("Error: Invalid response format", response);
        throw new Error("Có lỗi, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error caught:", error); // In ra lỗi để gỡ lỗi

      if (error.response?.data?.message) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi
        const formErrors = error.response.data.errors;
        if (formErrors) {
          Object.keys(formErrors).forEach((key) => {
            setError(key, {
              type: "manual",
              message: formErrors[key]
            });
          });
        }
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            alignItems: "center",
            textAlign: "center",
            marginTop: "220px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h4" gutterBottom>
            Quên mật khẩu
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
              marginTop: "50px"
            }}
          >
            <Input
              name="email"
              register={register}
              errors={errors}
              label="Email"
            />
            {errors.email && (
              <Typography color="error">{errors.email.message}</Typography>
            )}

            <ButtonCustom type="submit" sx={{ mt: 2 }}>
              Gửi yêu cầu
            </ButtonCustom>
          </Box>
        </Box>
      </form>
      <ToastContainer />
    </>
  );
}

export default ForgotPassword;
