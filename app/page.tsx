"use client";

import { useState, ChangeEvent } from "react";

// Todo型を定義
interface Todo {
  id: number;
  text: string;
}

export default function TodoApp() {
  const [todoText, setTodoText] = useState("");
  const [incompleteTodos, setIncompleteTodos] = useState<Todo[]>([]);
  const [completeTodos, setCompleteTodos] = useState<Todo[]>([]);
  const [nextId, setNextId] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  const handleAdd = () => {
    if (!todoText.trim()) return;
    setIncompleteTodos([...incompleteTodos, { id: nextId, text: todoText }]);
    setNextId(nextId + 1);
    setTodoText("");
  };

  const handleDelete = (id: number) => {
    setIncompleteTodos(incompleteTodos.filter((todo) => todo.id !== id));
  };

  const handleComplete = (id: number) => {
    const todo = incompleteTodos.find((t) => t.id === id);
    if (!todo) return;
    setIncompleteTodos(incompleteTodos.filter((t) => t.id !== id));
    setCompleteTodos([...completeTodos, todo]);
  };

  const handleRebase = (id: number) => {
    const todo = completeTodos.find((t) => t.id === id);
    if (!todo) return;
    setCompleteTodos(completeTodos.filter((t) => t.id !== id));
    setIncompleteTodos([...incompleteTodos, todo]);
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <div className="input-area list-row mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Todo"
          value={todoText}
          onChange={handleChange}
          className="border rounded px-2 py-1 flex-1"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1 rounded">add</button>
      </div>
      <section className="incomplete-area mb-8">
        <p className="title font-bold mb-2">Yet Todo</p>
        <ul className="space-y-2">
          {incompleteTodos.map((todo) => (
            <li key={todo.id}>
              <div className="list-row flex gap-2 items-center">
                <p className="todo-item flex-1">{todo.text}</p>
                <button onClick={() => handleComplete(todo.id)} className="bg-green-500 text-white px-2 py-1 rounded">Done</button>
                <button onClick={() => handleDelete(todo.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="complete-area">
        <p className="title font-bold mb-2">Done Todo</p>
        <ul className="space-y-2">
          {completeTodos.map((todo) => (
            <li key={todo.id}>
              <div className="list-row flex gap-2 items-center">
                <p className="todo-item flex-1">{todo.text}</p>
                <button onClick={() => handleRebase(todo.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">rebase</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
