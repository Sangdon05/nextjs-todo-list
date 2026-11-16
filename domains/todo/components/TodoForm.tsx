'use client';

import TiptabEditor from '@/shared/components/TiptabEditor';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { ChangeEvent, useActionState, useLayoutEffect, useState } from 'react';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import { addTodoAction } from '../actions/todo.action';

interface FormState {
  title: string;
  content: string;
}

const initialState: FormState = {
  title: '',
  content: '',
};

export default function TodoForm() {
  const [formKey, setFormKey] = useState(0);

  // Activity로 숨겨질 때 폼을 리마운트해 입력값·액션 결과를 초기화
  useLayoutEffect(() => {
    return () => {
      setFormKey((key) => key + 1);
    };
  }, []);

  return <TodoFormContent key={formKey} />;
}

function TodoFormContent() {
  const [state, formAction, isPending] = useActionState(
    addTodoAction,
    INITIAL_ACTION_STATE,
  );

  const [form, setForm] = useState(initialState);
  const onChange = (e: ChangeEvent<HTMLInputElement> | string) => {
    setForm((prev) => {
      const [key, value] =
        typeof e === 'string'
          ? (['content', e] as const)
          : ([e.target.name, e.target.value] as const);
      return { ...prev, [key]: value };
    });
  };

  return (
    <div>
      {state.message && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive mb-6 flex items-center gap-2 rounded-2xl border p-3.5 text-xs font-medium">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}
      <form action={formAction} noValidate autoComplete="off">
        <input type="hidden" name="content" value={form.content} />
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-[6rem_1fr]">
          <label className="text-sm font-medium md:leading-9">할일</label>
          <div>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="할일을 입력하세요..."
            />
            {state.errors?.title && (
              <p className="text-destructive mt-1.5 flex items-center gap-1.5 text-xs">
                <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                {state.errors.title}
              </p>
            )}
          </div>

          <label className="text-sm font-medium">내용</label>
          <div>
            <TiptabEditor content={form.content} onChange={onChange} />
            {state.errors?.content && (
              <p className="text-destructive mt-1.5 flex items-center gap-1.5 text-xs">
                <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                {state.errors.content}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <FiLoader className="h-4 w-4 animate-spin" />}
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
