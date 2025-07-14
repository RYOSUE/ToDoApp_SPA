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
                <div>
                    <Button
                        onClick={() => router.push('/todolist')}
                        variant='dark' className='m-2' size='lg'>
                        ログイン
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={() => router.push('/todolist')}
                        variant='dark' size='lg'>
                        新規アカウント登録
                    </Button>
                </div>
            </div >
        </>
    )
}