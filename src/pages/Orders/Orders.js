import Sidebar from "../../components/Sidebar";
import React, { useState, useEffect } from "react";
import HeaderBstore from "../../components/HeaderBstore";
import "react-confirm-alert/src/react-confirm-alert.css";
import instance from "../../components/Axios-Instance";
import {
  RiCheckLine,
  RiEdit2Fill,
  RiShoppingCartFill,
  RiCloseFill,
} from "react-icons/ri";
import { FcSearch } from "react-icons/fc";
import {
  Modal,
  Select,
  Result,
  Table,
  Input,
  Button,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  message,
} from "antd";
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

function Orders() {
  const [allData, setAllData] = useState(null);
  const [filteredData, setFilteredData] = useState(allData);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [details, setDetails] = useState([
    {
        "orderId": "83",
        "price": "32900",
        "quantity": "1",
        "productName": "Lenovo Ideapad Flex 5 Core i3 ",
        "orderDetailsId": "110"
    },
    {
        "orderId": "83",
        "price": "54844",
        "quantity": "2",
        "productName": "Beats Solo 3 ",
        "orderDetailsId": "111"
    }
]);

  const showModal = (record) => {
    setIsModalVisible(true);
    //console.log(record.orderId)
    const idData = { orderId: record.orderId };
    console.log(JSON.stringify(idData));
    instance
      .post("Orders/details.php", JSON.stringify(idData))
      .then((response) => {
        console.log(response.data);
        setDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSearch = (event) => {
    let value = event.target.value;
    let result = [];
    console.log(value);
    result = allData.filter((data) => {
      return data.orderId.search(value) != -1;
    });
    setFilteredData(result);
  };

  useEffect(() => {
    instance
      .get("Orders/orders.php")
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

  const isEditing = (record) => record.orderId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      orderId: "",
      customerName: "",
      orderdate: "",
      ...record,
    });
    console.log("Record" + JSON.stringify(record));
    setEditingKey(record.orderId);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const save = async (record) => {
    const row = await form.validateFields();
    console.log(row.orderStatus);
    console.log(record.orderId);
    const data = { orderId: record.orderId, orderStatus: row.orderStatus };
    console.log(JSON.stringify(data));

    instance.put("Orders/edit-orders.php", JSON.stringify(data)).then(
      (response) => {
        if (response.data.message === "Status was updated.") {
          setEditingKey("");
          message.success(response.data.message);
          setRefresh(refresh + 1);
          console.log(refresh);
          console.log("success");
        } else {
          message.error("Error updating status");
          console.log("error");
        }
      },
      (error) => {
        console.log(error);
        message.error("Unable to update order status !!");
      }
    );
  };


  const dataSource = filteredData;

  const columns = [
    {
      title: "Id",
      dataIndex: "orderId",
      key: "orderId",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.orderId - b.orderId,
      width: "8%",
    },
    {
      title: "customer Id",
      dataIndex: "customerId",
      key: "customerId",
      width: "15%",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: "20%",
    },
    {
      title: "Date",
      dataIndex: "orderdate",
      key: "orderdate",
      width: "20%",
      width: "17%",
      editable: false,
    },
    {
      title: "Total",
      dataIndex: "totalprice",
      key: "totalprice",
      width: "10%",
      render: (totalprice) => "₹" + totalprice,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      editable: true,
      width: "15%",
    },
    {
      title: "Action",
      dataIndex: "orderId",
      width: "15%",

      render: (text, record, index) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link id={record.orderId} onClick={() => save(record)}>
              {/* onClick={save}> */}

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
          <RiShoppingCartFill /> Orders
        </div>
        <div className="row">
          <div className="col-2 menu">
            <Sidebar />
          </div>
          <div className="col-10">
            <div className="row">
              <div className="col-6">
                <h1 className="headerheading ">&nbsp;</h1>
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
                    rowKey={(record) => record.orderId}
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
export default Orders;
