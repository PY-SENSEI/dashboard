import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { register } from '~/data/auth';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';
import { Label } from '~/components/ui/label/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card/card';
import type { Route } from './+types/register';
import styles from './login.module.css';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    await register({ email, password, name });
    return redirect('/dashboard');
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to get started with LeadCRM</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            {actionData?.error && (
              <div className={styles.error}>{actionData.error}</div>
            )}

            <Button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className={styles.switchText}>
              Already have an account?{' '}
              <a href="/login" className={styles.link}>
                Sign in
              </a>
            </p>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
