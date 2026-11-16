'use client';

import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptimistic, useState, useTransition } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { changeTodoStatus } from '../actions/todo.action';
import type { Todo, TodoStatus } from '../types/todo.types';
import TodoItems from './TodoItems';

interface TodoDashBoardProps {
  initialItems: Todo[];
}

interface OptimisticUpdateType {
  id: string;
  nextStatus: TodoStatus;
}

const COLUMNS: { status: TodoStatus; label: string }[] = [
  { status: 'READY', label: '준비중' },
  { status: 'PROGRESS', label: '진행중' },
  { status: 'DONE', label: '완료' },
];

export default function TodoDashBoard({
  initialItems,
}: TodoDashBoardProps): React.JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialItems,
    (currentItems, { id, nextStatus }: OptimisticUpdateType) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
  );

  const onClick = (id: string, status: TodoStatus) => {
    const currentItem = optimisticItems.find((item) => item.id === id);
    if (currentItem && currentItem.status === status) {
      return;
    }

    startTransition(async () => {
      setError(null);
      setOptimisticItems({ id, nextStatus: status });
      try {
        await changeTodoStatus(id, status);
        router.refresh();
      } catch {
        setError('할일 상태 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end border-b pb-3">
        <Link href="/todo/new">
          <Button>할일 등록하기</Button>
        </Link>
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-2xl border p-3.5 text-xs font-medium">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isPending && (
        <span className="text-muted-foreground animate-pulse text-sm">
          서버와 동기화 중...
        </span>
      )}

      {optimisticItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            등록된 할일이 없습니다.
          </p>
          <Link href="/todo/new">
            <Button size="sm">첫 할일 등록하기</Button>
          </Link>
        </div>
      ) : (
        COLUMNS.map(({ status, label }) => {
          const columnItems = optimisticItems.filter(
            (item) => item.status === status,
          );
          return (
            <section key={status} className="rounded-2xl border p-4">
              <h2 className="text-muted-foreground mb-3 text-sm font-semibold">
                {label} ({columnItems.length})
              </h2>
              {columnItems.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  할일이 없습니다.
                </p>
              ) : (
                <TodoItems items={columnItems} onClick={onClick} />
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
