"use client";

import Dynamic from "@/components/Dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";

const Neynar = () => {
  const [signerUuid, setSignerUuid] = useState<string | null>(null);
  useEffect(() => {
    (window as any).onSignInSuccess = (data: any) => {
      console.log("Sign-in success with data:", data);
      setSignerUuid(data.signer_uuid);
    };
  }, []);
  return (
    <>
      <Head>
        <script
          src="https://neynarxyz.github.io/siwn/raw/1.0.0/index.js"
          async
        ></script>
      </Head>
      <div className="container w-full max-w-4xl text-md sm:text-xl mx-auto p-8 sm:py-20 gap-10 flex flex-col justify-center items-center">
        <Dynamic>
          <div
            className="neynar_signin"
            data-client_id={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID}
            data-success-callback="onSignInSuccess"
          ></div>
          {signerUuid && <p>Signer UUID: {signerUuid}</p>}
        </Dynamic>
      </div>
    </>
  );
};

export default Neynar;
