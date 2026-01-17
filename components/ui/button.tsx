import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-[10px] tracking-luxury uppercase font-medium ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90 shadow-soft",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-black/10 bg-transparent hover:bg-black hover:text-white hover:border-black",
        secondary:
          "bg-luxury-gray text-black hover:bg-luxury-gray/80",
        ghost: "hover:bg-luxury-gray hover:text-black",
        link: "text-black underline-offset-8 hover:underline decoration-black/20",
        luxury: "relative bg-black text-white overflow-hidden border border-black/10 transition-all duration-700 before:absolute before:inset-0 before:bg-white before:translate-y-full hover:before:translate-y-0 hover:text-black before:transition-transform before:duration-700 before:ease-out",
      },
      size: {
        default: "h-14 px-10 py-4",
        sm: "h-10 px-6",
        lg: "h-16 px-12",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
