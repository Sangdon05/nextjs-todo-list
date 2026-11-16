import { Badge } from '@/shared/components/ui/badge';
import type { Todo } from '../types/todo.types';
import { TODO_STATUS_MAP, TODO_STATUS_VARIANT } from './TodoItems';

interface TodoDetailsProp {
  todo: Todo;
}

export default function TodoDetails({
  todo,
}: TodoDetailsProp): React.JSX.Element {
  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Badge variant={TODO_STATUS_VARIANT[todo.status]}>
            {TODO_STATUS_MAP[todo.status]}
          </Badge>
          <span>{todo.userName}</span>
          <span aria-hidden>·</span>
          <time>
            {new Date(todo.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-xl font-semibold">{todo.title}</h1>
      </header>

      <div
        className="min-h-24 rounded-2xl border p-4 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: todo.content || '<p>내용이 없습니다.</p>',
        }}
      />
    </article>
  );
}
