import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Spin } from "antd";
import "../Login/login.css";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;
const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Invalid Email")
    .required("Email is required"),
  passwords: yup
    .string("Enter your password")
    .min(6, "Invalid password")
    .max(15, "Invalid password")
    .required("Password is required"),
});

function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      passwords: "",
    },
    validateOnMount: true,
    validationSchema: validationSchema,

    onSubmit: (values) => {
      setIsSubmitting(true);
      console.log(JSON.stringify(values, null, 2));

      let config = {
        method: "post",
        url: "http://localhost/React%20Project/ecommerce-php/api/Auth.php",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(values),
      };

      axios(config)
        .then((response) => {
          console.log("console" + response.data.jwt);

          if (response.data.jwt) {
            const jwtToken = response.data.jwt;
            const user = response.data.data.userName;
            const userId = response.data.data.userId;
            localStorage.setItem("JWT-Token", jwtToken);
            localStorage.setItem("name", user);
            localStorage.setItem("userId", userId);
            localStorage.setItem("isAuthenticated", true);
            navigate("/home");
          } else {
            alert("Invalid Credentials Please try again");
            setIsSubmitting(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  });
  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Login</div>
        <div className="form">
          <form onSubmit={formik.handleSubmit}>
            <div className="input-container">
              <TextField
                className="textfield"
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </div>
            <div className="input-container">
              <TextField
                className="textfield"
                id="passwords"
                name="passwords"
                label="Password"
                type="password"
                value={formik.values.passwords}
                onChange={formik.handleChange}
                error={
                  formik.touched.passwords && Boolean(formik.errors.passwords)
                }
                helperText={formik.touched.passwords && formik.errors.passwords}
              />
            </div>
            <div className="button-container">
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={!formik.isValid || isSubmitting}
              >
                <Spin indicator={antIcon} spinning={isSubmitting} />
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
