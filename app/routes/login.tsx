import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard } from "lucide-react";
import { login, isAuthenticated } from "~/data/auth";
import { Button } from "~/components/ui/button/button";
import { Input } from "~/components/ui/input/input";
import { Label } from "~/components/ui/label/label";
import styles from "./login.module.css";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - LeadCRM" }, { name: "description", content: "Login to your LeadCRM dashboard" }];
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <LayoutDashboard className={styles.logoIcon} />
          <h1 className={styles.title}>Welcome to LeadCRM</h1>
          <p className={styles.subtitle}>Sign in to manage your leads</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@leadcrm.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className={styles.demoInfo}>
          <p className={styles.demoTitle}>Demo Credentials</p>
          <div className={styles.demoCredentials}>
            <div>
              Email: <code>demo@leadcrm.com</code>
            </div>
            <div>
              Password: <code>demo123</code>
            </div>
          </div>
          <p className={styles.switchText}>
            Don't have an account?{' '}
            <a href="/register" className={styles.link}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
