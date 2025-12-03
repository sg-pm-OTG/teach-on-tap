interface SectionDividerProps {
  title?: string;
}

export const SectionDivider = ({ title }: SectionDividerProps) => {
  if (!title) {
    return <div className="h-px bg-border my-6" />;
  }

  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px bg-border flex-1" />
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
};
