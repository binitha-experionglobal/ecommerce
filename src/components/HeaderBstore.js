import React from "react";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function HeaderBstore() {
  const navigate = useNavigate();
  const myProfile = (event) => {
    event.preventDefault();
    navigate("/home/my-profile");
  };
  const user = localStorage.getItem("name");
  return (
    <div className="content">
      <div className=" bstore">
        Hi, {user}
        <Space />
        <a onClick={myProfile}>
          {" "}
          <Avatar
            style={{ backgroundColor: "#87cefa" }}
            icon={<UserOutlined />}
          />
        </a>
      </div>
    </div>
  );
}
export default HeaderBstore;
