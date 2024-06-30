import { cn } from '@src/lib/utils';

interface HeadingProps {
  title: string;
  description: string;
  className?: string;
  descriptionStyle?: string;
  titleStyle?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  className,
  descriptionStyle,
  titleStyle
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <h2 className={cn(titleStyle, 'text-4xl font-bold tracking-normal')}>
        {title}
      </h2>
      <p
        className={cn(
          descriptionStyle,
          'sm:text-md text-sm text-muted-foreground'
        )}
      >
        {description}
      </p>
    </div>
  );
};
