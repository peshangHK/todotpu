// src/components/TodoList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  Select,
  List,
  Checkbox,
  Modal,
  Form,
  Radio,
} from "antd";
import {
  fetchTodos,
  createTodo,
  updateTodoAction,
  deleteTodoAction,
} from "../features/todos/todoSlice";
import { auth } from "../services/firebase";
import classes from "./TodoList.module.css";

const { Option } = Select;

export default function TodoList() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.todos);
  const userId = auth.currentUser?.uid;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  //setting modal visibillity
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    if (userId) dispatch(fetchTodos(userId));
  }, [dispatch, userId]);

  const handleAdd = () => {
    if (title.trim()) {
      dispatch(
        createTodo({
          title,
          description,
          priority,
          userId,
        })
      ).then(() => dispatch(fetchTodos(userId)));

      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  };

  const handleToggleCompleted = (todo) => {
    dispatch(
      updateTodoAction({
        id: todo.id,
        updates: { completed: !todo.completed },
      })
    );
  };

  // --- OPEN UPDATE MODAL ---
  const handleOpenUpdate = (todo) => {
    setCurrentTodo(todo);
    setIsModalVisible(true);
  };

  // --- SUBMIT UPDATE ---
  const handleUpdateSubmit = (values) => {
    dispatch(
      updateTodoAction({
        id: currentTodo.id,
        updates: {
          ...values,
        },
      })
    ).then(() => dispatch(fetchTodos(userId)));

    setIsModalVisible(false);
    setCurrentTodo(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteTodoAction(id));
  };

  //Filtering + Searching
  const filteredItems = items
    .filter((item) => {
      if (filter === "active") return !item.completed;
      if (filter === "done") return item.completed;
      return true;
    })
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className={classes.container}>
      <h2>Todo List</h2>
      {/* Add Form */}
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Input.TextArea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Select
        value={priority}
        onChange={setPriority}
        style={{ width: "100%", marginBottom: 8 }}
      >
        <Option value="low">Low</Option>
        <Option value="medium">Medium</Option>
        <Option value="high">High</Option>
      </Select>
      <Button type="primary" onClick={handleAdd} block>
        Add Todo
      </Button>
      {/* Filters + Search */}
      <div style={{ marginTop: "1rem" }}>
        <Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="active">Active</Radio.Button>
          <Radio.Button value="done">Done</Radio.Button>
        </Radio.Group>

        <Input.Search
          placeholder="Search todos"
          allowClear
          style={{ width: 200, marginLeft: "1rem" }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Todo List */}
      <List
        style={{ marginTop: 20 }}
        bordered
        loading={status === "loading"}
        dataSource={filteredItems}
        pagination={{
          pageSize: 20, // show only 20 items per page agiast heavy loading
        }}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button
                key="update"
                onClick={() => handleOpenUpdate(todo)}
                size="small"
              >
                Update
              </Button>,
              <Button
                key="delete"
                danger
                onClick={() => handleDelete(todo.id)}
                size="small"
              >
                Delete
              </Button>,
            ]}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo)}
              style={{ marginRight: 8 }}
            />
            <div>
              <strong>{todo.title}</strong> — {todo.description}{" "}
              <span style={{ color: "#888" }}>[{todo.priority}]</span>
            </div>
          </List.Item>
        )}
      />
      {/* {updaing modal and form} */}
      <Modal
        title="Update Todo"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateSubmit}
          initialValues={{
            title: currentTodo?.title,
            description: currentTodo?.description,
            priority: currentTodo?.priority,
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Priority" name="priority">
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
