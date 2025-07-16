"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import toJSTISOString from "@/components/ToJSTISOString";

// Todo型を定義
interface Todo {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  deadline: Date | null; // nullを許容
}

export default function TodoApp() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [todoDeadline, setTodoDeadline] = useState<Date>(new Date());
  const [incompleteTodos, setIncompleteTodos] = useState<Todo[]>([]);
  const [completeTodos, setCompleteTodos] = useState<Todo[]>([]);

  // 初期データの取得
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos');
      const todos = await res.json();
      const todoArray = Array.isArray(todos) ? todos : [];
      const mappedTodos = todoArray.map((t: Todo) => ({
        ...t,
        deadline: t.deadline ? new Date(t.deadline) : null,
      }));
      setIncompleteTodos(mappedTodos.filter((t: Todo) => !t.completed));
      setCompleteTodos(mappedTodos.filter((t: Todo) => t.completed));
    };
    fetchTodos();
  }, []);

  // 入力フィールドの変更を処理
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  // コンテンツ入力フィールドの変更を処理
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTodoContent(e.target.value);
  };

  // 締め切りの変更を処理
  const handleDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoDeadline(new Date(e.target.value));
  };

  const handleAdd = async () => {
    if (!todoTitle.trim()) return;  // 空のToDoは登録しない
    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todoTitle,
        content: todoContent,
        completed: false,
        deadline: toJSTISOString(todoDeadline), // JSTで送信
      }),
    })
    setTodoTitle("");
    setTodoContent("");
    setTodoDeadline(new Date());
    // ToDoリストを再取得
    const res = await fetch('/api/todos');
    const todos = await res.json();
    const todoArray = Array.isArray(todos) ? todos : [];
    const mappedTodos = todoArray.map((t: Todo) => ({
      ...t,
      deadline: t.deadline ? new Date(t.deadline) : null,
    }));
    setIncompleteTodos(mappedTodos.filter((t: Todo) => !t.completed));
    setCompleteTodos(mappedTodos.filter((t: Todo) => t.completed));
  };

  // 削除ボタンのクリックを処理
  const handleDelete = async (id: number) => {
    await fetch(`/api/todos/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    // ToDoリストを再取得
    const res = await fetch('/api/todos');
    const todos = await res.json();
    const todoArray = Array.isArray(todos) ? todos : [];
    const mappedTodos = todoArray.map((t: Todo) => ({
      ...t,
      deadline: t.deadline ? new Date(t.deadline) : null,
    }));
    setIncompleteTodos(mappedTodos.filter((t: Todo) => !t.completed));
    setCompleteTodos(mappedTodos.filter((t: Todo) => t.completed));
  };

  // 完了ボタンのクリックを処理
  const handleComplete = async (id: number) => {
    const todo = incompleteTodos.find((t) => t.id === id);
    if (!todo) return;
    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...todo,
        completed: true,
        deadline: todo.deadline ? toJSTISOString(todo.deadline) : null,
      }),
    });
    // 再取得
    const res = await fetch('/api/todos');
    const todos = await res.json();
    const todoArray = Array.isArray(todos) ? todos : [];
    const mappedTodos = todoArray.map((t: Todo) => ({
      ...t,
      deadline: t.deadline ? new Date(t.deadline) : null,
    }));
    setIncompleteTodos(mappedTodos.filter((t: Todo) => !t.completed));
    setCompleteTodos(mappedTodos.filter((t: Todo) => t.completed));
  };

  // 完了したToDoを未完了に戻す処理
  const handleRebase = async (id: number) => {
    const todo = completeTodos.find((t) => t.id === id);
    if (!todo) return;
    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...todo,
        completed: false,
        deadline: todo.deadline ? toJSTISOString(todo.deadline) : null,
      }),
    });
    // 再取得
    const res = await fetch('/api/todos');
    const todos = await res.json();
    const todoArray = Array.isArray(todos) ? todos : [];
    const mappedTodos = todoArray.map((t: Todo) => ({
      ...t,
      deadline: t.deadline ? new Date(t.deadline) : null,
    }));
    setIncompleteTodos(mappedTodos.filter((t: Todo) => !t.completed));
    setCompleteTodos(mappedTodos.filter((t: Todo) => t.completed));
  };

  return (
    <>
      <Container className="mx-auto p-4">
        <h1 className="mb-4">ToDoリスト</h1>
        <p className=" lead text-muted mb-4">以下の登録フォームから新しいToDoを追加してください</p>
        <hr />
        <div>
          <h3>登録フォーム</h3>
          <FloatingLabel controlId="floatingInput" label="Todo" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Todo"
              value={todoTitle}
              onChange={handleTextChange}
              required
              autoFocus />
          </FloatingLabel>
          <FloatingLabel controlId="floatingTextarea" label="Content" className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Content"
              value={todoContent}
              onChange={handleContentChange}
              style={{ height: '100px' }}
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingDate" label="Deadline" className="mb-3">
            <Form.Control
              type="date"
              value={toJSTISOString(todoDeadline)}
              onChange={handleDeadlineChange}
            />
          </FloatingLabel>
          <Button variant="primary" onClick={handleAdd} className="mb-3">登録</Button>
          <hr />
        </div>
        <section className="incomplete-area mb-8">
          <p className="title font-bold mb-2">未完了のToDo</p>
          <Container className="text-center mb-3">
            <Row>
              <Col>ToDo</Col>
              <Col>内容</Col>
              <Col>締切</Col>
              <Col>操作ボタン</Col>
            </Row>
          </Container>
        </section>
        <ul className="space-y-2">
          {incompleteTodos.map((todo) => (
            <li key={todo.id}>
              <Container className="text-center mb-2">
                <Row>
                  <Col>{todo.title}</Col>
                  <Col>{todo.content}</Col>
                  <Col>{todo.deadline ? toJSTISOString(todo.deadline) : null}</Col>
                  <Col>
                    <Button onClick={() => handleComplete(todo.id)} variant="success" size="sm">完了</Button>
                    <Button onClick={() => handleDelete(todo.id)} variant="danger" size="sm">削除</Button>
                  </Col>
                </Row>
              </Container>
            </li>
          ))}
        </ul>
        <section className="complete-area">
          <hr />
          <p className="title font-bold mb-2">完了したTodo</p>
          <Container className="text-center mb-3">
            <Row>
              <Col>ToDo</Col>
              <Col>内容</Col>
              <Col>締切</Col>
              <Col>操作ボタン</Col>
            </Row>
          </Container>
          <ul className="space-y-2">
            {completeTodos.map((todo) => (
              <li key={todo.id}>
                <Container className="text-center mb-2">
                  <Row>
                    <Col>{todo.title}</Col>
                    <Col>{todo.content}</Col>
                    <Col>{todo.deadline ? toJSTISOString(todo.deadline) : null}</Col>
                    <Col>
                      <Button onClick={() => handleRebase(todo.id)} variant="info" size="sm">戻す</Button>
                    </Col>
                  </Row>
                </Container>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
