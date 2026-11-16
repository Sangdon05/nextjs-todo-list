'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import Link from 'next/link';
import { FiMoreVertical } from 'react-icons/fi';
import type { Todo, TodoStatus } from '../types/todo.types';

export const TODO_STATUS_MAP: Record<TodoStatus, string> = {
  READY: '준비중',
  PROGRESS: '진행중',
  DONE: '완료',
} as const;

export const TODO_STATUS_VARIANT: Record<
  TodoStatus,
  'outline' | 'secondary' | 'default'
> = {
  READY: 'outline',
  PROGRESS: 'secondary',
  DONE: 'default',
} as const;

const STATUS_ENTRIES = Object.entries(TODO_STATUS_MAP) as [
  TodoStatus,
  string,
][];

interface TodoItemsProps {
  status?: TodoStatus;
  items?: Todo[];
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
    <div className="space-y-2">
      {filteredItems.map((item) => (
        <TodoItem key={item.id} item={item} onClickAction={onClick} />
      ))}
    </div>
  );
}

export function TodoItem({ item, onClickAction }: TodoItemProps) {
  const { id, status, title } = item;

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border p-3">
      <div className="flex min-w-0 items-center gap-2">
        <Badge variant={TODO_STATUS_VARIANT[status]}>
          {TODO_STATUS_MAP[status]}
        </Badge>
        <Link href={`/todo/${id}/view`} className="truncate hover:underline">
          {title}
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="상태 변경 메뉴"
            />
          }
        >
          <FiMoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {STATUS_ENTRIES.filter(([s]) => s !== status).map(([s, label]) => (
            <DropdownMenuItem key={s} onClick={() => onClickAction?.(id, s)}>
              {label}로 변경
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
