# nextjs-todo-list

Supabase 인증과 연동된 Next.js 할일 관리 앱입니다. 로그인한 유저별로 할일을 등록하고, 준비중/진행중/완료 상태를 관리할 수 있습니다.

## 개발 환경

| 구분       | 기술                                   | 비고                                           |
| ---------- | -------------------------------------- | ---------------------------------------------- |
| 프레임워크 | Next.js 16.4.6 (App Router, Turbopack) | Cache Components / Partial Prefetching 활성화  |
| 런타임     | Node.js 20+                            | `package.json` `engines` 참고                  |
| 언어       | TypeScript 5.x                         | strict 모드                                    |
| UI         | React 19.3.0                           | React 19 Server Actions / `useOptimistic` 사용 |
| 스타일     | Tailwind CSS 4.3.3                     | shadcn 스타일 토큰 + tw-animate-css            |
| 컴포넌트   | shadcn (base-ui 기반)                  | `shared/components/ui/`                        |
| 에디터     | Tiptap 3.x                             | 할일 본문 리치 텍스트 에디터                   |
| 인증/DB    | Supabase (`@supabase/ssr` 0.12.x)      | SSR 쿠키 기반 세션, RLS 적용                   |
| 아이콘     | react-icons (Feather), lucide-react    |                                                |

### 주요 스크립트

```bash
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드 (빌드 전 테스트 실행)
npm run test      # node:test 기반 유닛 테스트
npm run lint      # ESLint 검사
npm run format    # Prettier 포맷 적용
```

### 프로젝트 구조

```
app/(todo)/          # 라우트 (홈, sign_in, sign_up, todo/[id]/view, todo/new)
domains/
  auth/              # 인증 도메인: actions(서버 액션), queries, components, utils, types
  todo/              # 할일 도메인: actions, queries, components, utils, types
shared/
  components/        # Header, TiptabEditor, shadcn ui 컴포넌트
  lib/               # supabase.ts(서버/브라우저 클라이언트), supabaseProxy.ts(프록시 세션 갱신)
  hooks/             # 폼 입력 훅
  types/             # 공용 타입 (ActionState 등)
proxy.ts             # Next.js proxy (구 middleware) — 세션 갱신 + 인증 리다이렉트
```

## 환경 변수 (.env.example)

`.env.example` 파일을 복사해 `.env`를 만들고 값을 채웁니다:

```bash
cp .env.example .env
```

| 변수                                   | 설명                                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase 프로젝트 URL. Dashboard → Settings → API 에서 확인                                                                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable Key (구 anon key). 브라우저에 노출되어도 안전한 공개 키로, 데이터 접근은 DB의 RLS 정책으로 제어됩니다 |

두 값은 `NEXT_PUBLIC_` 접두사 때문에 클라이언트 번들에 포함됩니다. 비밀 키(service role key)는 이 프로젝트에 사용하지 않으며, 절대 `.env`에 넣어 커밋하지 마세요.

## Supabase DB 스키마

적용된 스키마입니다. Supabase Dashboard → SQL Editor에서 실행합니다:

```sql
create type todo_status as enum ('READY', 'PROGRESS', 'DONE');

create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create table todos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  user_name   text not null,
  status      todo_status not null default 'READY',
  title       text not null,
  content     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index idx_todos_user_id on todos (user_id);
create index idx_todos_user_not_deleted on todos (user_id, deleted_at);
```

### 테이블 설명

**profiles** — 유저 프로필. Supabase Auth의 `auth.users`와 1:1 매핑(`id` 공유)

| 컬럼                        | 타입        | 설명                                       |
| --------------------------- | ----------- | ------------------------------------------ |
| `id`                        | uuid PK     | `auth.users.id` 참조, ON DELETE CASCADE    |
| `name`                      | text        | 회원명 (닉네임)                            |
| `created_at` / `updated_at` | timestamptz | 생성/수정 시각                             |
| `deleted_at`                | timestamptz | 탈퇴(soft delete) 시각. NULL이면 활성 유저 |

**todos** — 할일. 유저별 소유, soft delete 적용

| 컬럼                        | 타입        | 설명                                         |
| --------------------------- | ----------- | -------------------------------------------- |
| `id`                        | uuid PK     | `gen_random_uuid()` 자동 생성                |
| `user_id`                   | uuid FK     | 소유 유저 (`profiles.id` 참조)               |
| `user_name`                 | text        | 생성 시점 회원명 (표시용 스냅샷)             |
| `status`                    | todo_status | `READY` → `PROGRESS` → `DONE`                |
| `title`                     | text        | 할일 제목                                    |
| `content`                   | text        | 할일 본문 (Tiptap HTML)                      |
| `created_at` / `updated_at` | timestamptz | 생성/수정 시각                               |
| `deleted_at`                | timestamptz | 삭제(soft delete) 시각. NULL이면 활성 데이터 |

### 인덱스

- `idx_todos_user_id` — 유저별 할일 조회 기본 인덱스
- `idx_todos_user_not_deleted` — `(user_id, deleted_at)` 복합 인덱스. 앱이 항상 `user_id = ? AND deleted_at IS NULL` 조건으로 조회하므로 이 패턴에 최적화되어 있습니다

## 시작하기

```bash
npm install
cp .env.sample .env    # 값 채우기
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다. 첫 접속 시 로그인 페이지로 리다이렉트되며, 회원가입 후 할일을 등록할 수 있습니다.
