import DisabledVisibleOutlinedIcon from "@mui/icons-material/DisabledVisibleOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Box, Button, Link, TextField } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import useLogin from "../../application/Hooks/useLogin";
import { LOGIN_FIELDS } from "../../domain/fieldsForms/login";
import { Logo } from "../../shared/components";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { control, onSubmit, errors } = useLogin();
  return (
    <Box
      bgcolor={"secondary.light"}
      width={"100%"}
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        bgcolor={"secondary.main"}
        width={"350px"}
        height={"auto"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={"8px"}
        padding={"32px 12px"}
        flexDirection={"column"}
        boxShadow={"4px 4px 8px #10101080"}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"8px"}
          flexDirection={"column"}
          mb={"24px"}
        >
          <Logo type="complete" color="blue" size="md" />
        </Box>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "12px",
            width: "100%",
          }}
        >
          <Controller
            control={control}
            name={LOGIN_FIELDS.email}
            render={({ field }) => (
              <TextField
                {...field}
                type="email"
                required
                id="outlined-basic"
                label="E-mail"
                variant="outlined"
                error={!!errors?.email}
                helperText={errors?.email ? errors?.email?.message : ""}
              />
            )}
          />
          <Controller
            control={control}
            name={LOGIN_FIELDS.password}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-basic"
                label="Senha"
                required
                variant="outlined"
                error={!!errors.password}
                helperText={errors?.password ? errors?.password?.message : ""}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? (
                        <DisabledVisibleOutlinedIcon color={"primary"} />
                      ) : (
                        <RemoveRedEyeOutlinedIcon color={"primary"} />
                      )}
                    </Box>
                  ),
                }}
              />
            )}
          />

          <Link href="/home" my={"16px"} width={"fit-content"}>
            Esqueci a senha
          </Link>
          <Button variant="contained" size="large" onClick={onSubmit}>
            Entrar
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
