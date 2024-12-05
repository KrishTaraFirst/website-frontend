"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/CustomInput";
import {
  Grid,
  Card,
  Typography,
  Button,
  Divider,
  Link,
  Container,
  Box,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../constants";
import Factory from "../utils/Factory";
import { useAuth } from "../context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
const LoginPage = () => {
  const router = useRouter();
  const [captcha, setCaptcha] = useState("");
  const { user, tokens, logout, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email_or_phonenumber: "",
      password: "",
      captchaInput: "",
    },
    validationSchema: Yup.object({
      email_or_phonenumber: Yup.string().required(
        "Email or phone number is required"
      ),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const handleLogin = async (data) => {
        try {
          const url = `/token_auth/`;
          const res = await axios.post(`${BASE_URL}${url}`, data);

          if (res.status === 200) {
            const {
              id,
              email,
              mobile_number,
              access,
              refresh,
              user_kyc,
              user_type,
            } = res.data;

            // Call login function from context
            login(
              { id, email, mobile_number, user_kyc, user_type },
              { access, refresh }
            );

            // Navigate based on user_kyc status
            router.push(
              user_kyc === true ? "/tara" : "/tara/registrationtype/selection"
            );
          } else {
            throw new Error("Invalid login credentials.");
          }
        } catch (error) {
          // Handle different error scenarios
          if (error.response && error.response.status === 401) {
            alert("Incorrect email/phone or password. Please try again.");
          } else if (error.response && error.response.status === 500) {
            alert("Server error. Please try again later.");
          } else {
            alert(
              "Something went wrong. Please check your network or try again."
            );
          }
          console.error("Login error:", error);
        }
      };

      // Prepare post data
      const postData = {
        email_or_mobile: values.email_or_phonenumber,
        password: values.password,
      };

      await handleLogin(postData);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  // useEffect(() => {
  //   if (tokens?.access) {
  //     router.push("/tara/registrationtype/selection");
  //   }
  // }, [tokens, router]);
  useEffect(() => {
    if (tokens?.access) {
      // Navigate based on user_kyc value
      const navigateTo = user?.user_kyc
        ? "/tara"
        : "/tara/registrationtype/selection";
      router.push(navigateTo);
    }
  }, [tokens, user, router]);

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f9fafa, #ffffff)",
      }}
    >
      <Grid
        item
        xs={12}
        sm={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          pt: 10,
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2} className="logoLeft">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <img src={"img/L2.png"} alt="Tara" height={42} />
          </Link>
        </Typography>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Hi, Welcome back
        </Typography>
        <Typography variant="body1" color="text.primary" mb={4}>
          More effectively with optimized workflows.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            maxWidth: "80%",
            marginBottom: "20px",
          }}
        >
          <img
            src="img/loginimage.jpg"
            alt="Registration"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Grid>
      {/* Right Section */}
      <Grid
        item
        xs={12}
        sm={7}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          mb={2}
          className="logoRight"
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Need help?
          </Link>
        </Typography>
        <Container maxWidth="xs">
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Sign in to your account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Don’t have an account?&nbsp;
            <Link href="/register" underline="hover">
              Get started
            </Link>
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="on"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Form Fields */}
            <CustomInput
              label="Email or Phone Number"
              id="email_or_phonenumber"
              name="email_or_phonenumber"
              {...getFieldProps("email_or_phonenumber")}
              touched={touched.email_or_phonenumber}
              errors={errors.email_or_phonenumber}
              inputProps={{ autoComplete: "username" }}
            />
            <Typography
              align="right"
              variant="body2"
              color="text.secondary"
              mb={-1}
            >
              <Link href="/forgot-password" underline="hover">
                Forgot password?
              </Link>
            </Typography>
            <CustomInput
              id="password"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              {...getFieldProps("password")}
              touched={touched.password}
              errors={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? "..." : "Sign In"}
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
