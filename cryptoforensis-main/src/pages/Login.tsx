import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User, Terminal, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Access Granted', {
        description: `Welcome back, Inspector ${username}`,
      });
    } catch (err) {
      toast.error('Access Denied', {
        description: 'Invalid credentials or unauthorized access attempt.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-destructive/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 glass-card border-primary/20 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_20px_rgba(0,124,240,0.2)]">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
            CryptoForensis
          </h1>
          <p className="text-sm text-muted-foreground mt-2 uppercase tracking-[0.2em] font-medium">
            Blockchain Investigation Unit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Agent Identity</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Username"
                className="pl-10 bg-secondary/30 border-secondary focus:border-primary/50 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Security Protocol</Label>
              <a href="#" className="text-xs text-primary hover:underline">Override Request?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-secondary/30 border-secondary focus:border-primary/50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 relative overflow-hidden group"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            {loading ? (
              <Zap className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Establish Connection <Terminal className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-secondary/30 text-center">
          <p className="text-xs text-muted-foreground mb-4">Secure multi-factor authentication active</p>
          <div className="flex justify-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center opacity-50 cursor-not-allowed">
              <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="h-4 w-4 grayscale" alt="Google" />
            </div>
            <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center opacity-50 cursor-not-allowed">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="h-4 w-4 invert" alt="Apple" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
          <Shield className="h-3 w-3" /> Encrypted Endpoint v2.4.1
        </div>
      </div>

      {/* Terminal Mock (Decorative) */}
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-primary/40 hidden xl:block">
        <div>&gt; INITIALIZING FORENSIC MODULE...</div>
        <div>&gt; CONNECTION SECURE [AES-256]</div>
        <div>&gt; WAITING FOR AGENT AUTHORIZATION...</div>
      </div>
    </div>
  );
};

export default Login;
