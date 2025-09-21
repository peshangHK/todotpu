import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  // если нет пользователя, возврашаемся на страницу авторизация
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
