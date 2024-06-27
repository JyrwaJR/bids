import { toast } from './use-toast';

export const showToast = (
  title: string,
  description: string,
  variant: 'default' | 'destructive' = 'default',
  action?: JSX.Element
) => {
  toast({ title, description, variant, action });
};
