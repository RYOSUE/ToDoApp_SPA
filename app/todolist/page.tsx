"use client";

import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import TodoForm from "@/components/TodoForm"; // 作成したコンポーネントをインポート
import TodoList from '@/components/TodoList'; // 新しくインポート
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
        <TodoForm onAddTodo={handleAdd} />

        {/* 未完了リストをコンポーネントに置き換え */}
        <TodoList
          title="未完了のToDo"
          todos={incompleteTodos}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />

        {/* 完了リストをコンポーネントに置き換え */}
        <TodoList
          title="完了したToDo"
          todos={completeTodos}
          onRebase={handleRebase}
          onDelete={handleDelete}
        />
      </Container>
    </>
  );
}
