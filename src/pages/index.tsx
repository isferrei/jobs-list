import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/") {
      router.push("/test/jobs");
    }
  }, [router.pathname]);
  return <main></main>;
}
