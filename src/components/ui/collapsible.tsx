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

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
