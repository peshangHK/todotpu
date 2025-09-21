import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { FloatButton, ConfigProvider, Layout, theme } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todo from "./pages/Todo.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";

const { Header, Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ color: "#fff" }}>Perfect ToDo</Header>
        <FloatButton
          type="primary"
          icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => setDarkMode(!darkMode)}
          tooltip={<span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          style={{ top: 70, right: 40 }}
        />
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* ProtectedRoute: защита от постаронных входов */}
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <Todo />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
