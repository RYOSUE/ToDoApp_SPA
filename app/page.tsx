"use client";

import { useState, ChangeEvent } from "react";

// Todo型を定義
interface Todo {
  id: number;
  text: string;
  content: string;
  completed: boolean;
  deadline: Date;
}

export default function TodoApp() {
  const [todoText, setTodoText] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [todoDeadline, setTodoDeadline] = useState<Date>(new Date());
  const [incompleteTodos, setIncompleteTodos] = useState<Todo[]>([]);
  const [completeTodos, setCompleteTodos] = useState<Todo[]>([]);
  const [nextId, setNextId] = useState(1);

  // 入力フィールドの変更を処理
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

// コンテンツ入力フィールドの変更を処理
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  setTodoContent(e.target.value);
};

  // 締め切りの変更を処理
  const handleDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoDeadline(new Date(e.target.value));
  };

  // 登録ボタンのクリックを処理
  const handleAdd = () => {
    if (!todoText.trim()) return;
    setIncompleteTodos([
      ...incompleteTodos,
      {
        id: nextId,
        text: todoText,
        content: todoContent,
        completed: false,
        deadline: todoDeadline,
      },
    ]);
    // 入力フィールドのリセット
    setNextId(nextId + 1);
    setTodoText("");
    setTodoContent("");
    setTodoDeadline(new Date());
  };

  // 削除ボタンのクリックを処理
  const handleDelete = (id: number) => {
    setIncompleteTodos(incompleteTodos.filter((todo) => todo.id !== id));
  };

  const handleComplete = (id: number) => {
    const todo = incompleteTodos.find((t) => t.id === id);
    if (!todo) return;
    setIncompleteTodos(incompleteTodos.filter((t) => t.id !== id));
    setCompleteTodos([
      ...completeTodos,
      { ...todo, completed: true },
    ]);
  };

  const handleRebase = (id: number) => {
    const todo = completeTodos.find((t) => t.id === id);
    if (!todo) return;
    setCompleteTodos(completeTodos.filter((t) => t.id !== id));
    setIncompleteTodos([...incompleteTodos, todo]);
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <button className="btn btn-primary">押してくれ</button>
      <div className="input-area list-row mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Todo"
          value={todoText}
          onChange={handleTextChange}
          className="border rounded px-2 py-1 flex-1"
        />
        <textarea
          placeholder="Content"
          value={todoContent}
          onChange={handleContentChange}
          className="border rounded px-2 py-1 flex-1"
        />
        <input
          type="date"
          value={todoDeadline.toISOString().slice(0, 10)}
          onChange={handleDeadlineChange}
          className="border rounded px-2 py-1"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={false}
            disabled
            className="accent-blue-500"
          />
          完了
        </label>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1 rounded">登録</button>
      </div>
      <section className="incomplete-area mb-8">
        <p className="title font-bold mb-2">Yet Todo</p>
        <div className="grid grid-cols-5 gap-2 font-bold border-b pb-1 mb-2">
          <span>ToDo</span>
          <span>内容</span>
          <span>締切</span>
          <span>完了</span>
          <span>操作</span>
        </div>
        <ul className="space-y-2">
          {incompleteTodos.map((todo) => (
            <li key={todo.id}>
              <div className="grid grid-cols-5 gap-2 items-center">
                <span className="font-bold">{todo.text}</span>
                <span>{todo.content}</span>
                <span>{todo.deadline.toLocaleDateString()}</span>
                <span>{todo.completed ? "済" : "未"}</span>
                <span className="flex gap-2">
                  <button onClick={() => handleComplete(todo.id)} className="bg-green-500 text-white px-2 py-1 rounded">完了</button>
                  <button onClick={() => handleDelete(todo.id)} className="bg-red-500 text-white px-2 py-1 rounded">削除</button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="complete-area">
        <p className="title font-bold mb-2">Done Todo</p>
        <div className="grid grid-cols-5 gap-2 font-bold border-b pb-1 mb-2">
          <span>ToDo</span>
          <span>内容</span>
          <span>締切</span>
          <span>完了</span>
          <span>操作</span>
        </div>
        <ul className="space-y-2">
          {completeTodos.map((todo) => (
            <li key={todo.id}>
              <div className="grid grid-cols-5 gap-2 items-center">
                <span className="font-bold">{todo.text}</span>
                <span>{todo.content}</span>
                <span>{todo.deadline.toLocaleDateString()}</span>
                <span>{todo.completed ? "済" : "未"}</span>
                <span>
                  <button onClick={() => handleRebase(todo.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">戻す</button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
