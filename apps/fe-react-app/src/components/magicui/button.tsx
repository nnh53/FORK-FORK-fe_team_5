import { cn } from "@/utils/utils";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonVariantProps } from "./button-variants";
import { buttonVariants } from "./button-variants";
import * as React from "react";

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariantProps & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button };
