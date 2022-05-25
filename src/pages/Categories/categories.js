import Sidebar from "../../components/sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/headerBstore";
import instance from "../../components/axiosInstance";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  RiCheckLine,
  RiDeleteBin6Line,
  RiEdit2Fill,
  RiListCheck2,
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

function Categories() {
  const [allData, setAllData] = useState(null);
  const [filteredData, setFilteredData] = useState(allData);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onFinish = (values) => {
    instance
      .post("category/category.php", JSON.stringify(values))
      .then((response) => {
        if (response.data.message === "Category was created.") {
          message.success(response.data.message);
          form.resetFields();
          setRefresh(refresh + 1);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log("Error in creating category" + error);
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
      return data.categoryName.search(value) != -1;
    });
    setFilteredData(result);
  };

  useEffect(() => {
    instance
      .get("category/display-category.php")
      .then((response) => {
        console.log(response.data);
        setAllData(response.data);
        setFilteredData(response.data);
        setRefresh(refresh + 1);
        setRefresh(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const isEditing = (record) => record.categoryId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      categoryId: "",
      categoryName: "",
      ...record,
    });

    setEditingKey(record.categoryId);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const save = async () => {
    const row = await form.validateFields();
    instance
      .put("category/edit-category.php", JSON.stringify(row))
      .then((response) => {
        if (response.data.message === "Category was updated.") {
          message.success(response.data.message);
          setRefresh(refresh + 1);
          console.log(refresh);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Unable to update customer !!");
      });
    setEditingKey("");
  };

  const dataSource = filteredData;

  const columns = [
    {
      title: "Id",
      dataIndex: "categoryId",
      key: "categoryId",
      editable: true,
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.categoryId - b.categoryId,
      width: "8%",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      editable: true,
      width: "13%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      width: "28%",
    },
    {
      title: "Action",
      dataIndex: "categoryId",
      width: "15%",

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link id={record.categoryId} onClick={save}>
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

            <Typography.Link id={record.categoryId}>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  instance
                    .delete("category/delete-category.php", {
                      data: { categoryId: record.categoryId },
                    })
                    .then((response) => {
                      console.log(
                        response.data + "Deleted user Id =" + record.categoryId
                      );
                      setRefresh(refresh + 1);
                      console.log(refresh);
                      setEditingKey("");
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
        <RiListCheck2 /> Categories
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
                  trigger={<Button className="button"> Add Category </Button>}
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <button className="close" onClick={close}>
                        &times;
                      </button>
                      <Card title=" Add Category" className="card">
                        <Form
                          form={form}
                          layout="vertical"
                          onFinish={onFinish}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
                          <Form.Item
                            label="Name"
                            name="categoryName"
                            rules={[
                              {
                                required: true,
                                message: "Category cannot be empty",
                              },
                              {
                                
                                min: 3,
                                message:"Too short"
                              },
                              {
                                
                                max: 20,
                                message:"Too long"
                              },
                            ]}
                          >
                            <Input placeholder="eg. DSLR" />
                          </Form.Item>
                          <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                              {
                                required: true,
                                message: "Description cannot be empty",
                              },
                              {
                                
                                min: 5,
                                message:"Too short"
                              },
                            ]}
                          >
                            <Input.TextArea placeholder="eg. This product has an amazing finish.." />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button htmlType="submit">Submit</Button>
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
                  rowKey={(record) => record.categoryId}
                  scroll={{ y: 240 }}
                  bordered
                  //rowClassName={(record, index) => (record.amount > 50 ? "red" : "green")}
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

export default Categories;
