import * as React from "react"
import { cn } from "@/lib/utils"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-2 sm:gap-3", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  size?: string
} & React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex h-9 w-9 items-center justify-center text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-300 border",
      isActive
        ? "border-[#c5a367] bg-[#c5a367] text-white"
        : "border-black/10 text-black/40 hover:border-black/40 hover:text-black bg-transparent",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Page précédente"
    className={cn(
      "w-auto px-4 gap-2 text-[8px] tracking-[0.4em] uppercase border-black/10 text-black/40 hover:border-[#c5a367] hover:text-[#c5a367] transition-all duration-300",
      className
    )}
    {...props}
  >
    <span>←</span>
    <span className="hidden sm:inline">Précédent</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Page suivante"
    className={cn(
      "w-auto px-4 gap-2 text-[8px] tracking-[0.4em] uppercase border-black/10 text-black/40 hover:border-[#c5a367] hover:text-[#c5a367] transition-all duration-300",
      className
    )}
    {...props}
  >
    <span className="hidden sm:inline">Suivant</span>
    <span>→</span>
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center text-[10px] text-black/20", className)}
    {...props}
  >
    ···
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
