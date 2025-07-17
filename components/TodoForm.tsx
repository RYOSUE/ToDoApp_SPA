"use client";

import { useState, ChangeEvent } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toJSTISOString } from "@/lib/utils"; // 先ほど作成したutilsをインポート

interface TodoFormProps {
  onAddTodo: (newTodo: { title: string; content: string; deadline: string }) => Promise<void>;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState<Date>(new Date());

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onAddTodo({
      title,
      content,
      deadline: toJSTISOString(deadline),
    });
    // フォームをリセット
    setTitle("");
    setContent("");
    setDeadline(new Date());
  };

  return (
    <div>
      <h3>登録フォーム</h3>
      <FloatingLabel controlId="floatingInput" label="Todo" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Todo"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingTextarea" label="Content" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Content"
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          style={{ height: '100px' }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingDate" label="Deadline" className="mb-3">
        <Form.Control
          type="date"
          value={toJSTISOString(deadline)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDeadline(new Date(e.target.value))}
        />
      </FloatingLabel>
      <Button variant="primary" onClick={handleSubmit} className="mb-3">登録</Button>
      <hr />
    </div>
  );
}