"use client";

import { useState, ChangeEvent } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    <main className="container mx-auto p-4">
      <div className="">
        <div className=" mb-3 form-floating">
          <input
            type="text"
            placeholder="Todo"
            value={todoText}
            onChange={handleTextChange}
            className="form-control"
            required
            autoFocus
          />
          <label htmlFor="floatingInput">Enter Todo</label>
        </div>
        <div className="mb-3 form-floating">
          <textarea
            placeholder="Content"
            value={todoContent}
            onChange={handleContentChange}
            className="form-control"
            style={{ height: "100px" }}
          />
          <label htmlFor="floatingInput">Enter Content</label>
        </div>
        <div className="mb-3 form-floating">
          <input
            type="date"
            value={todoDeadline.toISOString().slice(0, 10)}
            onChange={handleDeadlineChange}
            className="form-control"
          />
          <label htmlFor="floatingInput">Deadline</label>
        </div>
        <button onClick={handleAdd} className="btn btn-primary mb-3">登録</button>
        <hr />
      </div>
      <section className="incomplete-area mb-8">
        <p className="title font-bold mb-2">未完了のToDo</p>
        <div className="container text-center">
          <div className="row">
            <div className="col">
              ToDo
            </div>
            <div className="col">
              内容
            </div>
            <div className="col">
              締切
            </div>
            <div className="col">
              操作ボタン
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {incompleteTodos.map((todo) => (
            <li key={todo.id}>
              <div className="container text-center">
                <div className="row">
                  <div className="col">
                    {todo.text}
                  </div>
                  <div className="col">
                    {todo.content}
                  </div>
                  <div className="col">
                    {todo.deadline.toLocaleDateString()}
                  </div>
                  <div className="col">
                    <button onClick={() => handleComplete(todo.id)} className="btn btn-success">完了</button>
                    <button onClick={() => handleDelete(todo.id)} className="btn btn-danger">削除</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="complete-area">
        <hr />
        <p className="title font-bold mb-2">完了したTodo</p>
        <div className="container text-center">
          <div className="row">
            <div className="col">
              ToDo
            </div>
            <div className="col">
              内容
            </div>
            <div className="col">
              締切
            </div>
            <div className="col">
              操作ボタン
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {completeTodos.map((todo) => (
            <li key={todo.id}>
              <div className="container text-center">
                <div className="row">
                  <div className="col">
                    {todo.text}
                  </div>
                  <div className="col">
                    {todo.content}
                  </div>
                  <div className="col">
                    {todo.deadline.toLocaleDateString()}
                  </div>
                  <div className="col">
                    <button onClick={() => handleRebase(todo.id)} className="btn btn-info text-white">戻す</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
