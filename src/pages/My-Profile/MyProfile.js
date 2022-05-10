import Sidebar from "../../components/Sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/HeaderBstore";
import "react-confirm-alert/src/react-confirm-alert.css";
import instance from "../../components/Axios-Instance";
import "../My-Profile/MyProfile.css";
import { Formik } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineUser } from "react-icons/ai";
import { Modal, Button, Input, message, Select, Space, Form } from "antd";
import profilepic from "../../assets/images/common_profile_pic.png";
import { EditTwoTone } from "@ant-design/icons";
import TextField from "@mui/material/TextField";

const { Option } = Select;
function MyProfile() {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState(0);

  //validations for update password

  const Schema = Yup.object().shape({
    oldPassword: Yup.string("Enter your current password")
      .required("Current Password is required")
      .min(6, "Password invalid")
      .max(15, "Password invalid"),
    passwords: Yup.string("Enter your new password")
      .min(6, "Password should be of minimum 6 characters length")
      .max(15, "Password should be of maximum 15 characters length")
      .required("New password is required")

      .matches(/[A-Z].*[A-Z]/, "must contain two uppercase characters")
      .matches(/[a-z].*[a-z]/, "must contain 2 lowercase characters")
      .test(
        "atMost2SpecialCharacters",
        "Atmost 2 special characters are allowed!",
        function (value) {
          return new Promise((resolve, reject) => {
            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/gi;
            const allFoundCharacters = value.match(specialChars);
            if (allFoundCharacters.length > 2) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        }
      ),
    newPassword: Yup.string("Confirm Password")
      .oneOf([Yup.ref("passwords"), null], "Passwords must match")
      .required("Password is required"),
  });

  //show,cancel modal for update password
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    formik.resetForm();
    setVisible(false);
  };

  //show,canccel for update details
  const showModals = () => {
    setIsModalVisible(true);
  };
  const handleCancelled = () => {
    console.log("Clicked cancel button");
    setRefresh(refresh+1);
    setIsModalVisible(false);
  };

  
  //display profile details
  useEffect(() => {
    instance
      .post("MyProfile/profile-details.php", {
        userId: localStorage.getItem("userId"),
      })
      .then((response) => {
        console.log(response.data);
        const userId = response.data.userId;
        setData(response.data);
        setRefresh(refresh + 1);
        console.log(refresh);
        setRefresh(false);
        form.setFieldsValue({
          userName: data.userName,
          email: data.email,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  //store details for details update
  const handleSubmits = (e) => {
    const data2 = {
      userId: localStorage.getItem("userId"),
      userName: e.userName,
      phoneNumber: e.phoneNumber,
      email: e.email,
      gender: e.gender,
    };
    console.log(data2);

    instance
      .post("MyProfile/edit-details.php", JSON.stringify(data2))
      .then((response) => {
        console.log(response);
        setRefresh(refresh + 1);
        if (response.data.message == "User was updated.") {
          localStorage.setItem("name", response.data.userName);
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log("error");
        message.error("Server Error. Please try again later");
      });
  };
  
//formik---check later
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      passwords: "",
      newPassword: "",
      userId: localStorage.getItem("userId"),
    },
  });

  return (
    <>
      <HeaderBstore />
      <div className=" bstore-heading">
        <AiOutlineUser /> My Profile
      </div>
      <div className="row">
        <div className="col-2 menu">
          <Sidebar />
        </div>
        <div className="col-10">
          <div className="row">
            <div className="col-8">
              <h1 className="headerheading ">
                <Button className="button" onClick={showModals}>
                  Edit Details
                </Button>
                <Button className="button-m" onClick={showModal}>
                  Change Password
                </Button>
                <Modal
                  title="Change Password"
                  visible={visible}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <Formik
                    initialValues={{
                      oldPassword: "",
                      passwords: "",
                      newPassword: "",
                      userId: localStorage.getItem("userId"),
                    }}
                    validationSchema={Schema}
                    onSubmit={(values) => {
                      console.log("checking");
                      setIsSubmitting(true);
                      console.log(JSON.stringify(values, null, 2));
                      instance
                        .post(
                          "MyProfile/change-password.php",
                          JSON.stringify(values, null, 2)
                        )
                        .then((response) => {
                          console.log(response.data.message);
                          if (response.data.message === "Password updated.") {
                            message.success(response.data.message);
                            setIsSubmitting(false);
                          } else {
                            message.error(response.data.message);
                            setIsSubmitting(false);
                          }
                        })
                        .catch((error) => {
                          message.error("Try again later");
                          setIsSubmitting(false);
                        });
                    }}
                  >
                    {({
                      values,
                      errors,
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      resetForm,
                      isValid,
                    }) => {
                      return (
                        <form onSubmit={handleSubmit} className="form">
                          <br />
                          <div className="input-containers">
                            <TextField
                              label="Current Password"
                              id="oldPassword"
                              name="oldPassword"
                              onBlur={handleBlur}
                              type="password"
                              onChange={handleChange}
                              value={values.oldPassword}
                              error={
                                formik.touched.oldPassword &&
                                Boolean(formik.errors.oldPassword)
                              }
                              style={{ width: 350 }}
                            />
                            <br />
                            <span className="error" style={{ color: "red" }}>
                              {errors.oldPassword}
                            </span>
                          </div>
                          <br />
                          <div className="input-containers">
                            <TextField
                              label="New Password"
                              id="passwords"
                              name="passwords"
                              onBlur={handleBlur}
                              type="password"
                              onChange={handleChange}
                              value={values.passwords}
                              error={
                                formik.touched.passwords &&
                                Boolean(formik.errors.passwords)
                              }
                              style={{ width: 350 }}
                            />
                            <br />
                            <span className="error" style={{ color: "red" }}>
                              {errors.passwords}
                            </span>
                          </div>
                          <br />
                          <div className="input-containers">
                            <TextField
                              label="Confirm Password"
                              id="newPassword"
                              name="newPassword"
                              onBlur={handleBlur}
                              type="password"
                              onChange={handleChange}
                              value={values.newPassword}
                              error={
                                formik.touched.newPassword &&
                                Boolean(formik.errors.newPassword)
                              }
                              style={{ width: 350 }}
                            />
                            <br />
                            <span className="error" style={{ color: "red" }}>
                              {errors.newPassword}
                            </span>
                          </div>
                          <div className="button-container">
                            <div className="submit-button">
                              <button
                                type="submit"
                                color="primary"
                                disabled={!isValid || isSubmitting}
                              >
                                Submit
                              </button>
                            </div>
                            <div className="reset-button">
                              <button type="reset" onClick={(e) => resetForm()}>
                                {" "}
                                Reset
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                </Modal>
              </h1>
            </div>
            <div className="col-4">
              <div className="search"></div>
            </div>
          </div>
          <div className="row">
            <div className="lorem-p">
              <div className="details-form">
                <div className="row">
                  <div className="col-5">
                    <img className="profilepic" src={profilepic} />
                  </div>
                  <div className="col-7">
                    <div className="row">
                      <h2 className="details-title">Personal Data</h2>
                    </div>

                    <div className="row">
                      <div className="col-5">
                        <div className="details-row">
                          User Name <br />
                        </div>
                        <div className="details-row">
                          Email <br />
                        </div>
                        <div className="details-row">
                          Phone Number <br />
                        </div>
                        <div className="details-row">
                          Gender <br />
                        </div>
                      </div>
                      <div className="col-7">
                        <form>
                          <div className="details-row">{data.userName}</div>
                          <div className="details-row">{data.email}</div>
                          <div className="details-row">{data.phoneNumber}</div>
                          <div className="details-row">{data.gender}</div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>

      <Modal
        title="Edit User"
        footer={null}
        visible={isModalVisible}
        onSubmit={handleSubmits}
        onCancel={handleCancelled}
      >
        <div class="cont-ed">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmits}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="userName"
              id="userName"
              rules={[
                {
                  required: true,
                  message: "Username cannot be empty",
                },
                {
                  type: "string",
                  min: 3,
                  message: "Too short !",
                },
                {
                  type: "string",
                  max: 15,
                  message: "Too long !",
                },
              ]}
            >
              <Input placeholder="eg. John Doe" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email cannot be empty",
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  max: 50,
                  message: "Too long!",
                },
              ]}
            >
              <Input placeholder="eg. john@gmail.com" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Phone Number cannot be empty",
                },
                {
                  max: 10,
                  message: "Cannot be more than 10 digits",
                },
                {
                  min: 10,
                  message: "Cannot be less than 10 digits",
                },
              ]}
            >
              <Input placeholder="eg. 98986xxxx" />
            </Form.Item>
            <Form.Item name="gender" label="Gender">
              <Select placeholder="select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
<br/>
            <Form.Item>
                <Button type="primary" htmlType="submit"
                className="button-form-update"
                >
                  Update
                </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}
export default MyProfile;
