import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
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

      message.success("Регистрация прошла успешно! идёт загрузка профиля...");
      navigate("/");
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} style={{ textAlign: "center" }}>
          Register
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="displayName"
            rules={[
              { required: true, message: "Пожалйста, введите ваше имя!" },
            ]}
          >
            <Input placeholder="Ваше Имя" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Пожалйста, введите вашу э.почту!" },
              { type: "email", message: "не правильный формат э. почты!" },
            ]}
          >
            <Input placeholder="э. почта" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Пожалйста, придумайте пароль" },
              { min: 6, message: "пароль дожна быть минимум 6 символов" },
            ]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Регистрироваться
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
