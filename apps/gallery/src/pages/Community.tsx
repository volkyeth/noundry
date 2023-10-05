"use client";
import { SmallAccountBadge } from "@/components/SmallAccountBadge";
import { TraitIcon } from "@/components/TraitIcon";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface User {
  _id: `0x${string}`;
  traits: number;
  heads: number;
  accessories: number;
  glasses: number;
  bodies: number;
}

const Community = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("/api/users").then((res) => res.json() as Promise<User[]>),
  });

  return (
    <div className="container mx-auto py-10 flex flex-col gap-6 xl:px-10 lg:px-10 md:px-5 sm:px-6 xs:px-2 px-8">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-Pix text-4xl sm:text-lg dsm:text-lg md:text-lg lg:text-2xl">
          Artists
        </h1>
      </div>
      <div className="grid grid-cols-[repeat(4,max-content)] gap-x-6 gap-y-2">
        {users?.map((user) => (
          <Link
            href={`/profile/${user._id}`}
            className="contents hover:text-primary"
          >
            <SmallAccountBadge key={user._id} address={user._id} />
            <div className="flex gap-2 items-center text-default">
              <p>Traits: {user.traits}</p>
            </div>
            <div className="flex gap-2 items-center text-default">
              <TraitIcon className="w-6" type="heads" />
              <p>{user.heads}</p>
            </div>
            <div className="flex gap-2 items-center text-default">
              <TraitIcon className="w-6" type="accessories" />
              <p>{user.accessories}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Community;
