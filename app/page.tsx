'use client';

import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    return (
        <>
            <div className="text-center my-4">
                <h1>ToDoApp_SPAへようこそ</h1>

                <Button
                    onClick={() => router.push('/todolist')}
                    variant='dark' className='my-3' size='lg'>
                    ログイン
                </Button>
                <Button
                    onClick={() => router.push('/todolist')}
                    variant='dark' className='my-3' size='lg'>
                    新規アカウント登録
                </Button>
            </div>
        </>
    )
}