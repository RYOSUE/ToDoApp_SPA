"use client";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TodoItem from './TodoItem';

// page.tsxと同じTodo型を定義
interface Todo {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  deadline: Date | null;
}

interface TodoListProps {
  title: string;
  todos: Todo[];
  onComplete?: (id: number) => void;
  onRebase?: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ title, todos, onComplete, onRebase, onDelete }: TodoListProps) {
  return (
    <section className="mb-8">
      <h2>{title}</h2>
      <Container className="text-center mb-3">
        <Row className="fw-bold">
          <Col>タイトル</Col>
          <Col>内容</Col>
          <Col>締切</Col>
          <Col>操作ボタン</Col>
        </Row>
      </Container>
      <ul className="space-y-2 list-unstyled">
        {todos.map((todo) => (
          <li key={todo.id} className="p-2 border-bottom">
            <TodoItem
              todo={todo}
              onComplete={onComplete}
              onRebase={onRebase}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}