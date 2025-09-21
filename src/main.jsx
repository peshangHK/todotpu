import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";
import { listenToAuthChanges } from "./features/auth/authSlice";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";
import { App as AntdApp } from "antd";

//слежка за изменениями статуса пользователя.
store.dispatch(listenToAuthChanges());
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {
      // провайдер для Redux, и упрвления все что под App находится.
      // для формата стайла используется prettier;
      // в .env файле хранятся данные в безопасности.
    }
    <Provider store={store}>
      <BrowserRouter>
        <AntdApp>
          <App />
        </AntdApp>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
