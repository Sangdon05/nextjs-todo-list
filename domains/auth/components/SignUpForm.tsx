'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { signUpAction } from '../actions/signup.action';
import { useInputs } from '@/shared/hooks/formUtil';

interface FormType {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

const initialForm: FormType = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
};
Object.freeze(initialForm);

export default function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    signUpAction,
    INITIAL_ACTION_STATE,
  );

  useEffect(() => {
    if (state.success) {
      alert('회원가입이 완료되었습니다.');
      router.push('/');
      router.refresh();
    }
  }, [state.success, router]);

  const [form, onChange] = useInputs<FormType>(initialForm);

  return (
    <div>
      {state.message && !state.success && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive mb-6 flex items-center gap-2 rounded-2xl border p-3.5 text-xs font-medium">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}
      <form action={formAction} noValidate autoComplete="off">
        <div className="mb-2 flex items-center">
          <label className="basis-30">이메일</label>
          <Input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요."
            value={form.email}
            onChange={onChange}
          />
        </div>
        {state.errors?.email && (
          <p className="text-destructive mt-1.5 mb-2 flex items-center gap-1.5 text-xs">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {state.errors.email}
          </p>
        )}

        <div className="mb-2 flex items-center">
          <label className="basis-30">회원명</label>
          <Input
            type="name"
            name="name"
            placeholder="회원명을 입력하세요."
            value={form.name}
            onChange={onChange}
          />
        </div>
        {state.errors?.name && (
          <p className="text-destructive mt-1.5 mb-2 flex items-center gap-1.5 text-xs">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {state.errors.name}
          </p>
        )}
        <div className="mb-2 flex items-center">
          <label className="basis-30">비밀번호</label>
          <Input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요."
          />
        </div>
        {state.errors?.password && (
          <p className="text-destructive mt-1.5 mb-2 flex items-center gap-1.5 text-xs">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {state.errors.password}
          </p>
        )}
        <div className="mb-2 flex items-center">
          <label className="basis-30">비밀번호 확인</label>
          <Input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인을 입력하세요."
          />
        </div>
        {state.errors?.passwordConfirm && (
          <p className="text-destructive mt-1.5 mb-2 flex items-center gap-1.5 text-xs">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {state.errors.passwordConfirm}
          </p>
        )}
        <Button type="submit" disabled={isPending}>
          가입하기
        </Button>
      </form>
    </div>
  );
}
