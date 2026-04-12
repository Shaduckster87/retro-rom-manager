interface ExtensionBadgeProps {
  ext: string;
  className?: string;
}

export function ExtensionBadge({ ext, className = '' }: ExtensionBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono bg-muted border border-border text-muted-foreground ${className}`}>
      {ext}
    </span>
  );
}
