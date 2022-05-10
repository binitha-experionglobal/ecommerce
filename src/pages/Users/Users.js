import Sidebar from "../../components/Sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/HeaderBstore";
import "react-confirm-alert/src/react-confirm-alert.css";
import instance from "../../components/Axios-Instance";
import {
  RiCheckLine,
  RiTeamLine,
  RiDeleteBin6Line,
  RiEdit2Fill,
  RiCloseFill,
} from "react-icons/ri";
import { FcSearch } from "react-icons/fc";
import {
  Card,
  Select,
  Result,
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

function Users() {
  const [allData, setAllData] = useState(null);
  const [filteredData, setFilteredData] = useState(allData);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onFinish = (values) => {
    instance
      .post("Users/create-user.php", JSON.stringify(values))
      .then((response) => {
        if (response.data.message === "User was created.") {
          message.success(response.data.message);
          form.resetFields();
          setRefresh(refresh + 1);
        } else {
          message.error(response.data.message);
        }
        console.log();
      });
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleSearch = (event) => {
    let value = event.target.value;
    let result = [];
    console.log(value);
    result = allData.filter((data) => {
      return data.userName.search(value) != -1;
    });
    setFilteredData(result);
  };

  useEffect(() => {
    instance
      .get("Users/display-user.php")
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

  const isEditing = (record) => record.userId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      userId: "",
      userName: "",
      phoneNumber: "",
      ...record,
    });
    console.log(record.userId);
    setEditingKey(record.userId);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const save = async () => {
    try {
      const row = await form.validateFields();
      instance.put("Users/edit-user.php", JSON.stringify(row)).then(
        (response) => {
          if (response.data.message === "User was updated.") {
            setEditingKey("");
            message.success(response.data.message);
            setRefresh(refresh + 1);
            console.log(refresh);
          } else {
            message.error(response.data.message);
          }
        },
        (error) => {
          console.log(error);
          message.error("Unable to update customer !!");
        }
      );
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const dataSource = filteredData;

  const columns = [
    {
      title: "Id",
      dataIndex: "userId",
      key: "userId",
      editable: true,
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.userId - b.userId,
      width: "8%",
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      editable: true,
      width: "13%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      editable: true,
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      editable: true,
      width: "15%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      editable: true,
      width: "9%",
    },
    {
      title: "Action",
      dataIndex: "userId",
      width: "15%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link id={record.userId} onClick={save}>
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
            <Typography.Link id={record.userId}>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  instance
                    .delete("Users/delete-user.php", {
                      data: { userId: record.userId },
                    })
                    .then((response) => {
                      console.log(
                        response.data + "Deleted user Id =" + record.userId
                      );
                      setRefresh(refresh + 1);
                      setEditingKey("");
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
        <RiTeamLine /> Users
      </div>
      <div className="row">
        <div className="col-2 menu">
          <Sidebar />
        </div>
        <div className="col-10">
          <div className="row">
            <div className="col-6">
              <h1 className="headerheading ">
                <Popup
                  trigger={<Button className="button"> Add User </Button>}
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <button className="close" onClick={close}>
                        &times;
                      </button>
                      <Card title=" Add User" className="card">
                        <Form
                          form={form}
                          layout="vertical"
                          onFinish={onFinish}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
                          <Form.Item
                            label="Name"
                            name="userName"
                            rules={[
                              {
                                required: true,
                                message: "Please input User Name",
                              },
                              {
                                type: "string",
                                min: 3,
                                message: "Please input valid values ",
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
                            ]}
                          >
                            <Input placeholder="eg. john@gmail.com" />
                          </Form.Item>
                          <Form.Item label="Phone Number" name="phoneNumber">
                            <Input placeholder="eg. 98986xxxx" />
                          </Form.Item>
                          <Form.Item name="gender" label="Gender">
                            <Select placeholder="select your gender">
                              <Option value="male">Male</Option>
                              <Option value="female">Female</Option>
                              <Option value="other">Other</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                              {
                                required: true,
                                message: "Please input your password!",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input.Password />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button type="primary" htmlType="submit">
                                Submit
                              </Button>
                              <Button htmlType="button" onClick={onReset}>
                                Reset
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </Card>
                      <div className="actions"></div>
                    </div>
                  )}
                </Popup>
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
                  rowKey={(record) => record.userId}
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
export default Users;
