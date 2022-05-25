import Sidebar from "../../components/Sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/HeaderBstore";
import "react-confirm-alert/src/react-confirm-alert.css";
import instance from "../../components/Axios-Instance";
import "../Customers/customers.css";

import {
  RiCheckLine,
  RiDeleteBin6Line,
  RiEdit2Fill,
  RiTeamFill,
  RiCloseFill,
} from "react-icons/ri";
import { FcSearch } from "react-icons/fc";
import {
  Avatar,
  Select,
  Modal,
  Space,
  Table,
  Input,
  Button,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  message,
} from "antd";
import Popup from "reactjs-popup";
import { height } from "@mui/system";
const { Option } = Select;
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Customers() {
  const [allData, setAllData] = useState(null);
  const [filteredData, setFilteredData] = useState(allData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const[modalForm]=Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [refresh, setRefresh] = useState(0);

  const imagePath="../../assets/images";

  const onFinish = (values) => {
    
    console.log(JSON.stringify(values));
    instance
      .post("create-customer.php", JSON.stringify(values))
      .then((response) => {
        if (response.data.message === "User was created.") {
          message.success("Customer account created");
          modalForm.resetFields();
          setRefresh(refresh + 1);
        } else {
          message.error(response.data.message);
        }
      });
  };
 

  const onReset = () => {
    modalForm.resetFields();
  };
  const handleCancelled = () => {
    console.log("Clicked cancel button");
    setRefresh(refresh + 1);
    console.log(refresh);
    setIsModalVisible(false);
  };
  const showModals = () => {
    setIsModalVisible(true);
  };
  const handleSearch = (event) => {
    let value = event.target.value;
    let result = [];
    console.log(value);
    result = allData.filter((data) => {
      return data.customerName.search(value) != -1;
    });
    setFilteredData(result);
  };

  useEffect(() => {
    instance
      .get("display-customers.php")
      .then((response) => {
        setAllData(response.data);
        setFilteredData(response.data);
        setRefresh(refresh + 1);
        console.log(refresh);
        setRefresh(false);
      })
      .catch((error) => {
        console.log("Error getting data: " + error);
      });
  }, [refresh]);
  const isEditing = (record) => record.customerId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      customerId: "",
      customerName: "",
      phoneNumber: "",
      ...record,
    });
    console.log(record.customerId);
    setEditingKey(record.customerId);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const save = async () => {
    const row = await form.validateFields();
    instance.put("edit-customer.php", JSON.stringify(row)).then((response) => {
      if (response.data.message === "User was updated.") {
        console.log(response);
        message.success(response.data.message);
        setRefresh(refresh + 1);
        setEditingKey("");
        console.log(refresh);
      } else {
        message.error(response.data.message);
      }
    });
  };

  const dataSource = filteredData;

  const columns = [
    {
      title: "Id",
      dataIndex: "customerId",
      key: "customerId",
      editable: true,
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.customerId - b.customerId,
      width: "6%",
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
      editable: true,
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      editable: true,
      width: "17%",
    },

    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      editable: true,
      width: "15%",
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      editable: true,
      width: "20%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      editable: true,
      width: "9%",
    },
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      editable: true,
      width:"10%", 
      render:profilePicture=>(
        <Avatar src={<img alt={profilePicture} src={(`../../assets/images/${profilePicture}`)}/>} shape="square" size={50} /> ),
      },
    {
      title: "Action",
      dataIndex: "customerId",
      width: "15%",

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link id={record.customerId} onClick={save}>
              <Button>
                <RiCheckLine color="green" size={"16px"} />
              </Button>
            </Typography.Link>
            <Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <Button>
                  <RiCloseFill color="crimson" size={"16px"} />
                </Button>
              </Popconfirm>
            </Typography.Link>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button>
                <RiEdit2Fill color="royalblue" size={"16px"} />
              </Button>
            </Typography.Link>

            <Typography.Link id={record.customerId}>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  instance
                    .delete("delete-customer.php", {
                      data: { customerId: record.customerId },
                    })
                    .then((response) => {
                      console.log(
                        response.data +
                          "Deleted customer Id =" +
                          record.customerId
                      );
                      setRefresh(refresh + 1);
                      console.log(refresh);
                    })
                }
              >
                <Button>
                  <RiDeleteBin6Line color="crimson " size={"16px"} />
                </Button>
              </Popconfirm>
            </Typography.Link>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <HeaderBstore />
      <div className=" bstore-heading">
        {" "}
        <RiTeamFill /> Customers
      </div>
      <div className="row">
        <div className="col-2 menu">
          <Sidebar />
        </div>

        <div className="col-10">
          <div className="row">
            <div className="col-6">
              <h1 className="headerheading ">
                <Button className="button" onClick={showModals}>
                  {" "}
                  Add Customer{" "}
                </Button>
               
              
                <Modal
                  title="Create Customer Account"
                  footer={null}
                  visible={isModalVisible}
                  onSubmit={onFinish}
                  onCancel={handleCancelled}
                >
                  <div className="modal-class-form">
                  <Form
                    form={modalForm}
                    layout="vertical"
                    onFinish={onFinish}
                    //onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Name"
                      name="customerName"
                      rules={[
                        {
                          required: true,
                          message: "Please input Customer Name",
                        },
                        {
                          min: 3,
                          message: "Too short! ",
                        },
                        {
                          type: "string",
                          message: "Name is Invalid",
                        },
                        {
                          max: 15,
                          message: "Too long!",
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
                          message: "Please input Customer E-mail",
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
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[
                        {
                          max: 200,
                          message: "Too long!",
                        },
                        {
                          min: 5,
                          message: "Too short!",
                        },
                      ]}
                    >
                      <Input placeholder="eg. abc house, Netherlands" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender">
                      <Select placeholder="select your gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="passwords"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        {
                          min: 6,
                          message: "Too short!",
                        },
                        {
                          max: 15,
                          message: "Too long!",
                        },
                        {
                          pattern: /[A-Z].*[A-Z]/,
                          message: "Two Uppercase characters required !",
                        },
                        {
                          pattern: /[a-z].*[a-z]/,
                          message: "Two Lowercase characters required !",
                        },
                        // {
                        //   pattern:/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{0,2}/,
                        //   message:"Atmost 2 special characters !"
                        // }
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    




                    <Form.Item>
                      <br/>
                      <Space>
                        <Button type="primary" htmlType="submit " className="submit-form-modal" >
                          Create Account
                        </Button>
                        <Button htmlType="button" onClick={onReset} className="reset-form-modal">
                          Reset
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                  </div>
                </Modal>
              </h1>
            </div>
            <div className="col-6">
              <div className="search">
                <FcSearch />
                <input
                  type="search"
                  onChange={(event) => handleSearch(event)}
                  placeholder="Search here"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="lorem">
              <Form form={form} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  rowKey={(record) => record.customerId}
                  scroll={{ y: 240 }}
                  bordered
                  dataSource={dataSource}
                  columns={mergedColumns}
                  rowClassName="editable-row"
                  pagination={{
                    defaultPageSize: 4,
                    onChange: cancel,
                  }}
                />
              </Form>
            
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default Customers;
