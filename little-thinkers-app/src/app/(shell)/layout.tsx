import { AppShellWrapper } from '@/components/navigation/AppShellWrapper';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <AppShellWrapper>{children}</AppShellWrapper>;
}
