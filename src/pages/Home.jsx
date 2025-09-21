import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { logoutUser } from "../features/auth/authSlice";
import TodoList from "../components/TodoList";

const { Title } = Typography;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // nothing while redirecting
  }

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <Title level={2}>
          Welcome, {user.displayName ? user.displayName : user.email}!
        </Title>

        <Button
          type="primary"
          danger
          onClick={() => {
            dispatch(logoutUser());
            navigate("/login");
          }}
        >
          Logout
        </Button>
        <TodoList />
      </div>
    </>
  );
}
