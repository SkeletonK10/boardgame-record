'use client';

import styles from './page.module.css';
import { text } from '@/data';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  return (
    <header role='banner' className={styles.header}>
      <div className={styles.headerButton} onClick={() => router.push('/')}>{text.main.title}</div>
      <div className={styles.horizontal}>
        <div className={styles.headerButton} onClick={() => router.push('/signin')}>{text.main.signIn}</div>
        <div className={styles.headerButton} onClick={() => router.push('/register')}>{text.main.register}</div>
      </div>
    </header>
  );
}
