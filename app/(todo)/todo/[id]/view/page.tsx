import TodoDetails from '@/domains/todo/components/TodoDetails';
import { getTodoById } from '@/domains/todo/queries/getTodoById.query';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
interface ParamsProps {
  id: string;
}

export const instant = false;

export default async function TodoViewPage({
  params,
}: {
  params: Promise<ParamsProps>;
}): Promise<React.JSX.Element> {
  await connection();
  const { id } = await params;
  const todo = await getTodoById(id);
  if (!todo) {
    notFound();
  }

  return <TodoDetails todo={todo} />;
}
