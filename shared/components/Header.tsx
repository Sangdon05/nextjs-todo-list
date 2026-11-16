import SignOutButton from '@/domains/auth/components/SignOutButton';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { connection } from 'next/server';

export default async function Header(): Promise<React.JSX.Element> {
  await connection();
  const { user } = await getCurrentUser();

  return (
    <header className="mb-6 flex items-center justify-between border-b py-4">
      <Link href="/" className="text-lg font-bold">
        TODO
      </Link>

      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{user.name}</span>
          <SignOutButton />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/sign_in">
            <Button variant="outline" size="sm">
              로그인
            </Button>
          </Link>
          <Link href="/sign_up">
            <Button size="sm">회원가입</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
