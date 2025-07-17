"use client";

import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import TodoForm from "@/components/TodoForm"; // 作成したコンポーネントをインポート
import { toJSTISOString } from "@/lib/utils"; // utilsをインポート

// Todo型を定義
interface Todo {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  deadline: Date | null; // nullを許容
}

export default function TodoApp() {
  const [incompleteTodos, setIncompleteTodos] = useState<Todo[]>([]);
  const [completeTodos, setCompleteTodos] = useState<Todo[]>([]);

  // fetchTodos関数をuseEffectの外に定義して再利用
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

  // 初期データの取得
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (newTodo: { title: string; content: string; deadline: string }) => {
    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newTodo,
        completed: false,
      }),
    });
    // ToDoリストを再取得
    await fetchTodos();
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
        {/* フォーム部分をコンポーネントに置き換え */}
        <TodoForm onAddTodo={handleAdd} />
        
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
