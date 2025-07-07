import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { CgProfile } from "react-icons/cg";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import userApi from "../../../../apis/user";
import { BASE_URL_IMAGE } from "../../../../constants";
import { AppContext } from "../../../../contexts/App";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});

export default function Profile() {
  const { setProfile } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userApi.getMe()
  });

  const profile = profileData?.data?.profile;

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name || "");
      setValue("email", profile.email || "");
      setValue("phone", profile.phone || "");
    }
  }, [profile, setValue]);

  const updateProfileMutation = useMutation({
    mutationFn: (body) => userApi.update(body),
    onSuccess: (data) => {
      setProfile(data.data.profile);
      alert("Cập nhật thông tin thành công!");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      alert("Cập nhật thất bại!");
    }
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (file) {
      formData.append("avatar", file);
    }
    updateProfileMutation.mutate(formData);
  });

  const onFileChange = (e) => {
    const fileFromLocal = e.target.files?.[0];
    setFile(fileFromLocal);
  };

  return (
    <Box onSubmit={onSubmit} component="form" method="POST">
      <Grid
        alignItems="center"
        sx={{ backgroundColor: "#fff", pb: 4 }}
        container
        spacing={3}
      >
        <Grid order={{ xs: 2, md: 1 }} item xs={12} md={7.5}>
          <Box sx={{ mb: 4, display: { xs: "none", md: "block" } }}>
            <Typography
              sx={{
                textTransform: "capitalize",
                fontSize: "18px",
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
              component="p"
            >
              Thông tin cá nhân
              <CgProfile fontSize="28px" />
            </Typography>
            <Typography sx={{ fontSize: "15px" }} component="p">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </Typography>
          </Box>
          <Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Họ tên
              </Typography>
              <TextField
                {...register("name", { required: true })}
                fullWidth
                size="small"
              />
              {errors.name && <span className="error">Họ tên là bắt buộc</span>}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Email
              </Typography>
              <TextField
                {...register("email", { required: true })}
                disabled
                inputProps={{ readOnly: true }}
                fullWidth
                size="small"
              />
              {errors.email && (
                <span className="error">Email là bắt buộc</span>
              )}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Số điện thoại
              </Typography>
              <TextField
                {...register("phone", { required: true })}
                type="tel"
                fullWidth
                size="small"
              />
              {errors.phone && (
                <span className="error">Số điện thoại là bắt buộc</span>
              )}
            </Box>
          </Box>
          <Button
            type="submit"
            sx={{ mt: 5, width: "150px" }}
            variant="contained"
          >
            Lưu
          </Button>
        </Grid>
        <Grid order={{ xs: 1, md: 2 }} item xs={12} md={4.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={previewImage || BASE_URL_IMAGE + profile?.avatar}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              sx={{ mt: 2 }}
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Chọn ảnh
              <VisuallyHiddenInput
                onChange={onFileChange}
                accept="image/*"
                type="file"
              />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
