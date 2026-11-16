'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { validateSignInInput } from '../utils/authValidation';

export async function signInAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = (formData.get('email') as string) || '';
  const password = (formData.get('password') as string) || '';

  const errors = validateSignInInput({ email, password });
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const supabase = createServerClient();

  const { data: authData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

  if (signInError || !authData.user) {
    return {
      success: false,
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (!profile || profile.deleted_at) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: '탈퇴 처리되었거나 프로필이 존재하지 않는 계정입니다.',
    };
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    message: '로그인에 성공하였습니다.',
  };
}
