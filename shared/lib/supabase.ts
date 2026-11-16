import {
  createBrowserClient,
  createServerClient as createSSRServerClient,
} from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseURL || !supabasePublishableKey) {
  console.warn(
    'NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경 변수가 설정되지 않았습니다. 환경 설정을 확인해 주세요.',
  );
}

export function createServerClient(): SupabaseClient {
  return createSSRServerClient(supabaseURL, supabasePublishableKey, {
    cookies: {
      async getAll() {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        try {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Actions 및 Proxy에서 쿠기 갱신 처리 필요
        }
      },
    },
  });
}

export const supabse = createBrowserClient(supabaseURL, supabasePublishableKey);
