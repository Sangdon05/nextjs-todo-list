'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { signInAction } from '../actions/login.action';
import { useInputs } from '@/shared/hooks/formUtil';

interface FormType {
  email: string;
  password: string;
}

const initialForm: FormType = {
  email: '',
  password: '',
};
Object.freeze(initialForm);

export default function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get('redirectURL') || '/';

  const [state, formAction, isPending] = useActionState(
    signInAction,
    INITIAL_ACTION_STATE,
  );

  const [form, onChange] = useInputs<FormType>(initialForm);

  useEffect(() => {
    if (state.success) {
      router.push(redirectURL);
      router.refresh();
    }
  }, [state.success, redirectURL, router]);

  return (
    <div>
      {state.message && !state.success && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive mb-6 flex items-center gap-2 rounded-2xl border p-3.5 text-xs font-medium">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} noValidate autoComplete="off">
        <div className="mb-2">
          <Input
            type="email"
            name="email"
            placeholder="이메일"
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
        <div className="mb-2">
          <Input type="password" name="password" placeholder="비밀번호" />
        </div>
        {state.errors?.password && (
          <p className="text-destructive mt-1.5 mb-4 flex items-center gap-1.5 text-xs">
            <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {state.errors.password}
          </p>
        )}
        <Button type="submit" disabled={isPending}>
          로그인
        </Button>
      </form>
    </div>
  );
}
