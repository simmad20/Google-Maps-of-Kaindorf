import {useEffect, useRef, useState} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const navigate = useNavigate();
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        const token = searchParams.get('token');
        if (!token) { setStatus('error'); return; }

        authService.verifyEmail(token)
            .then(() => {
                setStatus('success');
                setTimeout(() => navigate('/auth'), 3000);
            })
            .catch(() => setStatus('error'));
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
                {status === 'loading' && <p className="text-gray-500">Verifying your email...</p>}
                {status === 'success' && (
                    <>
                        <div className="text-green-500 text-5xl mb-4">✓</div>
                        <h1 className="text-lg font-semibold text-gray-900 mb-2">Email verified!</h1>
                        <p className="text-sm text-gray-500">Redirecting to login...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-5xl mb-4">✗</div>
                        <h1 className="text-lg font-semibold text-gray-900 mb-2">Invalid or expired link</h1>
                        <button onClick={() => navigate('/auth')}
                                className="mt-4 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}