'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? 'Something went wrong. Try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('Something went wrong. Try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="rounded-card border border-border bg-surface px-4 py-3 text-sm font-medium text-win">
        You're on the list -- check your inbox for a confirmation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-card border border-border bg-surface px-4 py-3 text-base text-text-primary outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-card bg-primary px-5 py-3 text-base font-semibold text-white transition-opacity disabled:opacity-50"
      >
        {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
      </button>
      {status === 'error' && errorMessage ? <p className="text-sm text-loss sm:basis-full">{errorMessage}</p> : null}
    </form>
  );
}
