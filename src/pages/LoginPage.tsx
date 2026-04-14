import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PixelCharacter } from '@/components/PixelCharacter';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto mt-12">
        <div className="pixel-border bg-card p-8 space-y-6">
          <div className="text-center">
            <PixelCharacter type="hero" size={48} className="mx-auto mb-3" />
            <h1 className="font-pixel text-sm text-primary glow-green">ADMIN LOGIN</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">SYSTEM ACCESS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-pixel text-[8px] text-muted-foreground">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 font-retro text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary mt-1"
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
    </div>
  );
}
