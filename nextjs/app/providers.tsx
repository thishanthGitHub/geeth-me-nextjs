"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
import { OrderProvider } from "@/lib/order";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OrderProvider>{children}</OrderProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
