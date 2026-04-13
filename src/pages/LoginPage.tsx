import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="pixel-border bg-card p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-pixel text-sm text-primary glow-green">🎮 ROM VAULT</h1>
          <p className="font-pixel text-[8px] text-muted-foreground mt-2">SYSTEM LOGIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 font-retro text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary mt-1"
              placeholder="admin@romvault.local"
              required
            />
          </div>
          <div>
            <label className="font-pixel text-[8px] text-muted-foreground">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 font-retro text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary mt-1"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="pixel-border-red p-2">
              <p className="font-pixel text-[8px] text-destructive">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 border-2 border-primary text-primary font-pixel text-[10px] hover:bg-primary/10 disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
