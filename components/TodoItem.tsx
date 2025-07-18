"use client";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toJSTISOString } from '@/lib/utils';

// page.tsxと同じTodo型を定義
interface Todo {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  deadline: Date | null;
}

interface TodoItemProps {
  todo: Todo;
  onComplete?: (id: number) => void; // 未完了リスト用
  onRebase?: (id: number) => void;   // 完了リスト用
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onComplete, onRebase, onDelete }: TodoItemProps) {
  return (
    <Row className="align-items-center">
      <Col>{todo.title}</Col>
      <Col>{todo.content}</Col>
      <Col>{todo.deadline ? toJSTISOString(todo.deadline) : 'N/A'}</Col>
      <Col>
        {todo.completed ? (
          <Button onClick={() => onRebase?.(todo.id)} variant="warning" size="sm" className="me-2">戻す</Button>
        ) : (
          <Button onClick={() => onComplete?.(todo.id)} variant="success" size="sm" className="me-2">完了</Button>
        )}
        <Button onClick={() => onDelete(todo.id)} variant="danger" size="sm">削除</Button>
      </Col>
    </Row>
  );
}