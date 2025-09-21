import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  App as AppComp,
} from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useState } from "react";
import { loginUser } from "../features/auth/authSlice";

const { Title } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      // Dispatch our Redux that calls signInWithEmailAndPassword
      await dispatch(loginUser({ email, password })).unwrap();
      messageApi.open({
        type: "success",
        content: "Login is successful!",
        style: { marginTop: "20vh" },
        duration: 1, // seconds
        onClose: () => {
          navigate("/"); // navigate after message closes
        },
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content:
          error.message || "Login Failed, wrong user name and/or password",
        className: "custom-class",
        style: {
          marginTop: "20vh",
        },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AppComp>
      {contextHolder}
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} style={{ textAlign: "center" }}>
            Login
          </Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: "center" }}>
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </Card>
      </div>
    </AppComp>
  );
}
