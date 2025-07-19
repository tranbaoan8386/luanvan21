import React from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import { Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import authApi from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const onSubmit = async (data) => {
    try {
      await authApi.resetPasswords(data);
      toast.success("Mật khẩu đã được thay đổi thành công.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Mã xác thực sai hoặc đã hết hạn!"); 
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      marginTop="300px"
    >
      <Box sx={{ display: "flex", width: "350px", flexDirection: "column" }}>
        <Input
          register={register}
          errors={errors}
          name="token"
          label="Mã xác thực"
          {...register("token", { required: "token là bắt buộc" })}
          sx={{ marginBottom: "20px" }}
        />

        <Input
          register={register}
          errors={errors}
          name="newPassword"
          label="Mật khẩu mới"
          type="password"
          {...register("newPassword", { required: "Mật khẩu là bắt buộc" })}
          sx={{ marginBottom: "40px" }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="success"
        sx={{ width: "250px", height: "45px" }}
      >
        <Box sx={{ fontSize: "19px" }}>Thay đổi mật khẩu</Box>
      </Button>
    </Box>
  );
};

export default FormComponent;
