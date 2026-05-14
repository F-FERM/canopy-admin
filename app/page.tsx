"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LocalStorage } from "../utility/LocalStorage";

export default function Home() {
  const userToken = LocalStorage.getItem("accessToken");

  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.push("/admin/home");
    } else {
      router.push("/login");
    }
  }, [userToken]);

  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <Loader type="dots" size={30} className="animate-spin" />
    </div>
  );
}
