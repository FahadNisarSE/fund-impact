import CreateProjectMenu from "@/components/Project/CreateProjectMenu";
import { Button } from "@/components/ui/button";
import styles from "@/constant/style";
import { cn } from "@/lib/utils";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className={cn(styles.pageContainer, "grid grid-cols-12")}>
      <header className="flex-row items-center justify-between col-span-12 flex border-b border-gray-300 pb-5 mb-12">
        <h1 className="break-words text-2xl font-semibold">Create Project</h1> <Button>Discard Project</Button>
      </header>
      <CreateProjectMenu />
      {children}
    </main>
  );
}
