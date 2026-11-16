'use client';

import Link from 'next/link';
import { Todo, TodoStatus } from '../types/todo.types';
import { Button } from '@/shared/components/ui/button';

interface TodoDashBoardProps {
  initialItems: Todo[];
}

interface OptimisticUpdateType {
  id: string;
  nextStatus: TodoStatus;
}

export default function TodoDashBoard({
  initialItems,
}: TodoDashBoardProps): React.JSX.Element {
  return (
    <>
      <div className="pd-3 mb-4 flex justify-between border-b">
        <Link href="">
          <Button>찜 목록</Button>
        </Link>
        <Link href="">
          <Button>할일 등록하기</Button>
        </Link>
      </div>
    </>
  );
}
