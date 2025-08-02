import * as React from 'react';
import { cn } from '../lib/utils';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex', className)} {...props}>
        {children}
      </div>
    );
  }
);
Panel.displayName = 'Panel';

export interface PanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
}

export const PanelGroup = React.forwardRef<HTMLDivElement, PanelGroupProps>(
  ({ className, direction = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PanelGroup.displayName = 'PanelGroup';

export const PanelResizeHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative cursor-col-resize bg-border hover:bg-accent transition-colors',
        className
      )}
      {...props}
    />
  );
});
PanelResizeHandle.displayName = 'PanelResizeHandle';