"use client"
import dynamic from "next/dynamic";
import { Suspense } from "react"; 
const AuthPageClient = dynamic(() => import("./AuthPageClient"), { ssr: false });

export default function Page() {
  return(
  <Suspense>  
   <AuthPageClient />
  </Suspense>
  )

} 