import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  App as AppComp,
} from "antd";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../services/firebase";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const { Title } = Typography;

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    const { email, password, displayName } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName,
      });

      const user = userCredential.user;
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );

      messageApi.open({
        type: "success",
        content: "Registration has succesfuly done!",
        style: { marginTop: "20vh" },
        duration: 1, // seconds
        onClose: () => {
          navigate("/"); // navigate after message closes
        },
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || "Registration Failed, something went wrong",
        className: "custom-class",
        style: {
          marginTop: "20vh",
        },
      });
    }
  };

  return (
    <AppComp>
      {contextHolder}
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} style={{ textAlign: "center" }}>
            Register
          </Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="displayName"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your E-mail" },
                { type: "email", message: "Wrong E-mail format!" },
              ]}
            >
              <Input placeholder="E-mail" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please create a password" },
                {
                  min: 6,
                  message: "The password should be longer than 5 symbols",
                },
              ]}
            >
              <Input.Password placeholder="Enter Your Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppComp>
  );
}
