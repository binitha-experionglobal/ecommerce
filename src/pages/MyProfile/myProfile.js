import Sidebar from "../../components/Sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/HeaderBstore";
import "react-confirm-alert/src/react-confirm-alert.css";
import instance from "../../components/Axios-Instance";
import "./MyProfile.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineUser } from "react-icons/ai";
import { Modal, message, Select } from "antd";
import profilepic from "../../assets/images/common_profile_pic.png";
import { ValidatePassword } from "./validatePassword";
import { yupToFormErrors } from "./yupToFormErrors";
import { Form, Input, Button } from "antd";
import { Formik, validateYupSchema } from "formik";

import Buttons from "@mui/material/Button";
import { ChangePasswordForm } from "./changePasswordForm";

const { Option } = Select;
function MyProfile() {
  const [isVisible, setVisible] = useState(false);

  const [form] = Form.useForm();
  // const [isVisible, setVisible] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState(0);

  

  //show,cancel modal for update password
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    //formik.resetForm();
    setVisible(false);
  };



  const onCreate = (values) => {
    console.log("Received values of form: ");
    console.log("Received values of form: ", values);
    instance
      .post(
        "MyProfile/change-password.php",
        JSON.stringify(values)
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
  
  
  };

  //show,canccel for update details
  const showModals = () => {
    setIsModalVisible(true);
  };
  const handleCancelled = () => {
    console.log("Clicked cancels button");
    setRefresh(refresh + 1);
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
  const [formData, setFormData] = useState(null);

  const validateYupSchemaMultiErrors = async (values, schema) => {
    if (values && values.oldPassword) {
      setFormData({
        oldPassword: values.oldPassword,
        passwords: values.passwords,
        newPassword: values.newPassword,
      });
    }
    try {
      await validateYupSchema(values, schema);
      return {};
    } catch (e) {
      return yupToFormErrors(e, { showMultipleFieldErrors: true });
    }
  };

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

                {/* <Button className="button-m" onClick={showModal}>
                  Change Password
                </Button> */}
                <Button
                className="button-m"
                  onClick={() => {
                    setVisible(true);
                    console.log("set to true");
                  }}
                >
                  Change Password
                </Button>
               
       
       

                <ChangePasswordForm
                  visible={isVisible}
                 // onOk={onCreate}
                  onCancel={handleCancel}
                  
                />

                {/* <ChangePasswordForm

                                isVisible={isVisible}
                                onCreate={onCreate}
                                onCancel={() => {
                                    setVisible(false);
                                }}
                            /> */}
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
            <br />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
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







































