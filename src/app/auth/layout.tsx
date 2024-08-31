export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-[90vh]">
      {children}
    </main>
  );
}
