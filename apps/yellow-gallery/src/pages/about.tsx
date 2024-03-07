"use client";

import { Link } from "@nextui-org/react";

const About = () => {
  return (
    <div className="container w-full max-w-4xl text-md sm:text-xl mx-auto p-8 sm:py-20 gap-10 flex flex-col justify-center items-center">
      <h1>About</h1>
      <p>
        The Yellow Collective is an onchain club on the BASE Ethereum L2
        network, designed to support and empower artists and creatives onchain.
      </p>

      <p>
        One Collective Noun will be auctioned off at{" "}
        <Link
          href="https://yellowcollective.xyz"
          isExternal
          className="text-md sm:text-xl"
        >
          YellowCollective.xyz
        </Link>{" "}
        every day, forever. Auction proceeds are used to host art contests and
        pay commissions to creatives in our communities, in collaboration with
        The Noun Square Onchain Media Collective.
      </p>

      <p>
        Collective Nouns are made in the image of the original Nouns DAO, except
        that all of the Head Traits are drawn by community members. The
        inaugural 55 heads in the collection were winners of a pre-launch art
        contest.{" "}
      </p>

      <p>
        Now the time has come to add more traits, something we plan to do
        several times per year to keep the collection fresh and
        community-created. Submit your traits here on yellow.noundry to enter
        our contest and your head could be one of the next 50 heads added to our
        collection! The following prizes are up for grabs:
      </p>

      <ul className="list-disc list-inside space-y-2">
        <li>
          1st: One Collective Noun Token from our Prize Vault + $500 USDC on
          BASE + Your Head will be included in Collective Nouns!
        </li>{" "}
        <li>
          2nd-5th: $250 USDC on BASE + Head will be included in Collective
          Nouns!
        </li>{" "}
        <li>
          {" "}
          6th-10th: $50 USDC + Head will be included in Collective Nouns!
        </li>{" "}
        <li>
          11th-50th: 1 Pair of Nouns Vision Noggles (~0.15 ETH Value) + Head
          will be included in Collective Nouns!
        </li>
      </ul>
    </div>
  );
};

export default About;
