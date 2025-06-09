import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import sizeApi from "../../../../../../apis/size";
import TitleManager from "../../../../../../components/Admin/TitleManager";
import Input from "../../../../../../components/Input";
import { createProductSizeSchema } from "../../../../../../validation/productSize";

export default function CreateProductSize() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: ""
    },
    resolver: yupResolver(createProductSizeSchema)
  });

  const createProductSizeMutation = useMutation({
    mutationFn: (body) => sizeApi.create(body),
    onSuccess: () => {
      navigate("/admin/size");
    }
  });

  const onSubmit = handleSubmit((data) => {
    createProductSizeMutation.mutate(data);
  });
  return (
    <Box>
      <TitleManager>Thêm size</TitleManager>
      <Box
        onSubmit={onSubmit}
        component="form"
        sx={{ backgroundColor: "#fff", pb: 8, py: 4, px: { xs: 1, md: 4 } }}
      >
        <Grid container>
          <Grid item md={6} xs={12}>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Tên size
              </Typography>
              <Input
                name="name"
                register={register}
                errors={errors}
                fullWidth
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
        <Button
          type="submit"
          sx={{ width: "200px", mt: 2 }}
          variant="contained"
        >
          Thêm size
        </Button>
      </Box>
    </Box>
  );
}
