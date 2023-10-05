"use client";
import Banner from "public/pixel-heart.svg";
import React from "react";

const About = () => {
  return (
    <>
      <div className="container w-full mx-auto px-4 gap-8 flex flex-col py-4 pt-8">
        <div className="flex items-center justify-center dsm:justify-between">
          {/* <Image
            src={bannerImage}
            className="w-full h-auto select-none"
            alt="Image"
          /> */}
          <Banner className="text-black w-full h-auto select-none" />
        </div>

        <div className="flex flex-col gap-4 text-lg">
          <div className="flex flex-col gap-4">
            <p className="text-xl my-2 ">
              Submit 32x32 pixel images as transparent PNGs, style them using
              existing NounsDAO assets, and share them with the community.{" "}
            </p>

            <p className="text-xl my-2 ">
              No strings attached: you retain all rights to your art until you
              choose to submit it to the DAO through a candidate proposal. If
              the proposal is approved, and your artwork is added to the
              collection, it will become CC0.{" "}
            </p>

            <p className="text-xl my-2 ">
              You can gauge the general sentiment by observing the number of
              likes you receive from the community. Additionally, you can sort
              and search through traits.{" "}
            </p>

            {/*}
            <p>
              The way this platform will sustain itself might depend on DAO
              support, or in the case of successfull candidate proposals, the
              proposer(s) can specify a lump sum going to the platform. We also
              accept donations at nouns-gallery.eth.
            </p>
            
            <p>
              Community members can like each other traits and can sort through
              traits by creation date, likes or artists names. A future step is
              to bring token gated “likes” to the platform, so that for example
              only noun owners can "⌐◨-◨" traits.
            </p>
            <p>
              We have more features we would like to implement, like forking
              traits or minting traits but for now this is it: a place to
              showcase your nounish creations!
            </p>
            */}
          </div>
          <div className="mt-8 mb-16 bg-bright-light dark:bg-off-dark p-6 leading-24 ">
            <p className="py-2"> Future Features: </p>
            <li className="">
              One-click process to submit candidate proposals to NounsDAO
            </li>
            <li className="">
              Twitter and Discord bots letting the community know about newly
              uploaded traits
            </li>
            <li className="">
              Token gated "likes" (if you own a noun for example you will be
              able to " ⌐◨-◨ " traits)
            </li>
            <li className="">Forking traits</li>
            <li className="">
              Mint traits to establish provenance and provide income to artists
            </li>
          </div>
          <p className="mb-20 text-md">
            {" "}
            Get in touch with CoralOrca on{" "}
            <a
              href="https://twitter.com/coralorca"
              className=" hover:!text-primary underline"
              target="_blank"
            >
              Twitter
            </a>{" "}
            or Discord if you want to share some feedback or features requests.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
