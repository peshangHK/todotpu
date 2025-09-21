import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// CREATE TODO
export const addTodo = async ({
  title,
  description = "",
  priority = "low",
  userId,
}) => {
  if (!userId) throw new Error("User must be logged in");
  if (!title) throw new Error("Title is required");

  const todoData = {
    title,
    description,
    completed: false,
    priority,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "todos"), todoData);

  // Return only serializable fields for Redux
  return {
    id: docRef.id,
    title,
    description,
    completed: false,
    priority,
    userId,
  };
};

// READ TODOS
export const getTodos = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const q = query(collection(db, "todos"), where("userId", "==", userId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description || "",
      completed: data.completed || false,
      priority: data.priority || "low",
      userId: data.userId,
    };
  });
};

// UPDATE TODO
export const updateTodo = async (id, updates) => {
  if (!id) throw new Error("Todo ID is required");

  const todoRef = doc(db, "todos", id);

  await updateDoc(todoRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  return { id, ...updates };
};

// DELETE TODO
export const deleteTodo = async (id) => {
  if (!id) throw new Error("Todo ID is required");

  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);

  return id;
};
