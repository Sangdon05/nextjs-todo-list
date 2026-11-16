'use client';

import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import type { Todo, TodoStatus } from '../types/todo.types';

export const TODO_STATUS_MAP: Record<TodoStatus, string> = {
  READY: '준비중',
  PROGRESS: '진행중',
  DONE: '완료',
} as const;

const STATUS_ENTRIES = Object.entries(TODO_STATUS_MAP) as [
  TodoStatus,
  string,
][];

interface TodoItemsProps {
  status?: TodoStatus;
  items?: Todo[];
  pinnedItem?: boolean;
  onClick?: (id: string, status: TodoStatus) => void;
}

type TodoItemProps = {
  item: Todo;
  onClickAction?: (id: string, status: TodoStatus) => void;
};

export default function TodoItems({
  status,
  items = [],
  onClick,
}: TodoItemsProps) {
  const filteredItems = status
    ? items.filter((item) => item.status === status)
    : items;

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div>
      {filteredItems.map((item) => (
        <TodoItem key={item.id} item={item} onClickAction={onClick} />
      ))}
    </div>
  );
}

export function TodoItem({ item, onClickAction }: TodoItemProps) {
  const { id, status, title } = item;

  return (
    <div className="mb-2 rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between gap-2 font-medium">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="shrink-0 text-gray-500">
            [{TODO_STATUS_MAP[status]}]
          </span>
          <Link href={`/todo/${id}/view`} className="truncate hover:underline">
            {title}
          </Link>
        </div>

        <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-gray-200" />
      </div>

      <div className="flex gap-2">
        {STATUS_ENTRIES.map(([s, label]) => {
          const isCurrentStatus = s === status;
          return (
            <Button
              key={`${id}_${s}`}
              size="sm"
              variant={isCurrentStatus ? 'default' : 'outline'}
              disabled={isCurrentStatus}
              onClick={() => onClickAction?.(id, s)}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
