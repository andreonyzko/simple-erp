import { FileQuestion, type LucideIcon } from "lucide-react";
type EmptyStateProps = {
  title?: string;
  message?: string;
  Icon?: LucideIcon;
};

export default function EmptyState({
  title = "Nenhum resultado encontrado",
  message = "Não há dados para exibir.",
  Icon,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="mb-4 text-muted-foreground">
          {Icon ? (
            <Icon className="h-16 w-16" />
          ) : (
            <FileQuestion className="h-16 w-16" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}
