import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-lg border border-primary/30 bg-[#0f0a1f]/60 px-4 text-sm text-foreground [color-scheme:dark] placeholder:text-foreground/40 outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
