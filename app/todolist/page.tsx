"use client";

import { useState, ChangeEvent } from "react";
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
              value={todoText}
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
              value={todoDeadline.toISOString().slice(0, 10)}
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
                  <Col>{todo.text}</Col>
                  <Col>{todo.content}</Col>
                  <Col>{todo.deadline.toLocaleDateString()}</Col>
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
                    <Col>{todo.text}</Col>
                    <Col>{todo.content}</Col>
                    <Col>{todo.deadline.toLocaleDateString()}</Col>
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
