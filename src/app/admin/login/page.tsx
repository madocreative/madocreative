'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh(); // Refresh to ensure layout uses the new cookie state
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a08] px-6">
            <div className="bg-[#1a1812] p-10 rounded-xl border border-white/10 shadow-2xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#ffc000] rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[#0a0a08] text-3xl">lock</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white">Admin Access</h1>
                    <p className="text-slate-500 mt-2 text-sm text-center">Restricted area. Please enter the master password to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#ffc000] text-[#0a0a08] py-4 rounded-lg font-bold text-lg uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex justify-center mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
