<<<<<<< HEAD
// "use client"

// import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// function Collapsible({
//   ...props
// }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
//   return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
// }

// function CollapsibleTrigger({
//   ...props
// }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
//   return (
//     <CollapsiblePrimitive.CollapsibleTrigger
//       data-slot="collapsible-trigger"
//       {...props}
//     />
//   )
// }

// function CollapsibleContent({
//   ...props
// }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
//   return (
//     <CollapsiblePrimitive.CollapsibleContent
//       data-slot="collapsible-content"
//       {...props}
//     />
//   )
// }

// export { Collapsible, CollapsibleTrigger, CollapsibleContent }

'use client';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
=======
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface CollapsibleTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ asChild = false, children, className, onClick, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      ...childProps,
      ...props,
      ref,
      className: cn(childProps.className, className),
      onClick: (e: React.MouseEvent) => {
        onClick?.();
        childProps.onClick?.(e);
      },
    });
  }

  return (
    <button ref={ref} className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";
>>>>>>> bec99807c15d241ec355835e9b6f0398396fba24

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
