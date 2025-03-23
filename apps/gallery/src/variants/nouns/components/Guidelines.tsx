import { RiAlertLine } from "react-icons/ri";

export const Guidelines = () => {
  return (
    <div className="container w-full max-w-4xl mx-auto px-4 gap-8 flex flex-col py-4 pt-8">
      <h1>Guidelines</h1>
      <div className="flex flex-col gap-4 text-lg">
        <div className="flex flex-col gap-4">
          <p className="text-xl my-2 ">
            Noundry is a platform for artists to create and share Nouns traits.
            We want to make it easy for artists to contribute to the Nouns
            ecosystem while maintaining the high quality standards that make
            Nouns special.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2>Technical Requirements</h2>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Size:</span> 32x32 pixels
            </p>
            <p>
              <span className="font-bold">Format:</span> PNG with transparency
            </p>
            <p>
              <span className="font-bold">Colors:</span> Use only colors from
              the Nouns palette
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2>Design Guidelines</h2>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Style:</span> Follow the Nouns
              aesthetic - simple, bold, and iconic
            </p>
            <p>
              <span className="font-bold">Originality:</span> Create original
              artwork, don&apos;t copy existing traits
            </p>
            <p>
              <span className="font-bold">Clarity:</span> Designs should be
              recognizable at small sizes
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2>Content Guidelines</h2>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Family-friendly:</span> Keep it
              appropriate for all ages
            </p>
            <p>
              <span className="font-bold">No hate:</span> No hate speech,
              discrimination, or offensive content
            </p>
            <p>
              <span className="font-bold">No copyrighted material:</span>{" "}
              Don&apos;t use copyrighted or trademarked content
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2>Submission Process</h2>
          <div className="flex flex-col gap-2">
            <p>
              1. Create your trait following the technical and design guidelines
            </p>
            <p>2. Upload your trait to Noundry</p>
            <p>
              3. If you want your trait to be part of the official Nouns
              collection:
            </p>
            <ul className="list-disc list-inside pl-4">
              <li>Submit a candidate proposal</li>
              <li>
                If sponsored and successful, your trait becomes part of the
                Nouns collection
              </li>
              <li>Your trait becomes CC0 (public domain)</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 bg-warning-50 text-warning-900 rounded-lg">
          <RiAlertLine className="text-2xl flex-shrink-0" />
          <p>
            Remember: Traits that don&apos;t follow these guidelines may be
            removed without notice
          </p>
        </div>
      </div>
    </div>
  );
};
