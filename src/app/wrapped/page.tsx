"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WrappedPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
