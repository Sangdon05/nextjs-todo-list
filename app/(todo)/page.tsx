import TodoDashBoard from '@/domains/todo/components/TodoDashBoard';
import { getTodos } from '@/domains/todo/queries/getTodos.query';
import { connection } from 'next/server';

export const instant = false;

export default async function TodoPage(): Promise<React.JSX.Element> {
  // 요청 시점에 동적으로 연결되도록 선언
  await connection();
  const initialItems = await getTodos();

  return <TodoDashBoard initialItems={initialItems} />;
}
