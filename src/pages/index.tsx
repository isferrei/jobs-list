import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  //The useEffect hook is used to run an effect when the component is rendered
  useEffect(() => {
    //Checks if the current route is the root path "/" using
    if (router.pathname === "/") {
      router.push("/test/jobs");
      //If the current route is the root path, then the Router.push method is called with the argument "/test/jobs" to redirect the user to the "/test/jobs" page.
    }
  }, [router.pathname]);
  return <main></main>;
}
