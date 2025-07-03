"use client";

import { ImageData } from "@noundry/nouns-assets";
import { buildSVG } from "@nouns/sdk";
import {
  DecodedTrait,
  EncodedTrait,
  decodeTrait,
  deflateTraits,
  inflateTraits,
} from "noggles";
import { useEffect, useMemo, useState } from "react";

// Define trait type options
type TraitType = "accessories" | "bodies" | "heads" | "glasses";

type TraitStatus = "unmodified" | "modified" | "added" | "removed";

// Reuse the TraitImage component logic
const TraitImage = ({
  traitData,
  size = 96,
  opacity = 1,
}: {
  traitData: EncodedTrait;
  size?: number;
  opacity?: number;
}) => {
  const svg = useMemo(() => {
    try {
      // Build the SVG using the Nouns SDK
      return `data:image/svg+xml;base64,${btoa(
        buildSVG(
          [{ data: traitData }],
          ImageData.palette,
          ImageData.bgcolors[0]
        )
      )}`;
    } catch (error) {
      console.error("Error rendering trait:", error);
      return "";
    }
  }, [traitData]);

  return (
    <img
      src={svg}
      width={size}
      height={size}
      alt=""
      className="pixelated"
      style={{ opacity }}
    />
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: TraitStatus }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "unmodified":
        return "text-gray-500 bg-gray-100";
      case "modified":
        return "text-orange-500 bg-orange-100";
      case "added":
        return "text-green-500 bg-green-100";
      case "removed":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

export const InflaterDecoder = () => {
  const [encodedData, setEncodedData] = useState<string>("");
  const [encodedTraits, setEncodedTraits] = useState<EncodedTrait[]>([]);
  const [decompressedTraits, setDecompressedTraits] = useState<string>("");
  const [originalLength, setOriginalLength] = useState<string>("");
  const [traitCount, setTraitCount] = useState<string>("");
  const [traitType, setTraitType] = useState<TraitType>("accessories");
  const [decodedTraits, setDecodedTraits] = useState<DecodedTrait[]>([]);
  const [inflateResult, setInflateResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [compareWithDAO, setCompareWithDAO] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Get current DAO traits based on selected trait type
  const currentDAOTraits = useMemo(() => {
    if (!compareWithDAO) return [];
    return ImageData.images[traitType] || [];
  }, [compareWithDAO, traitType]);

  // Calculate trait status for comparison
  const getTraitStatus = (index: number, trait: EncodedTrait): TraitStatus => {
    if (!compareWithDAO) return "unmodified";

    // Check if there's a corresponding trait in ImageData
    if (index >= currentDAOTraits.length) return "added";

    // Compare the encoded data
    if (
      JSON.stringify(trait) ===
      JSON.stringify(currentDAOTraits[index].data as EncodedTrait)
    ) {
      return "unmodified";
    } else {
      return "modified";
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (!encodedData || !originalLength || !traitCount) {
      setDecodedTraits([]);
      setInflateResult(null);
      return;
    }

    try {
      const handleTraitDecoding = async () => {
        try {
          // Ensure the encoded data starts with 0x
          const formattedData = encodedData.startsWith("0x")
            ? encodedData
            : `0x${encodedData}`;

          // Parse inputs
          const parsedTraitCount = parseInt(traitCount);

          if (isNaN(parsedTraitCount)) {
            setInflateResult({
              success: false,
              message: "Trait count must be a valid number",
            });
            return;
          }

          const encodedTraits = inflateTraits(formattedData as `0x${string}`);
          const {
            originalLength: expectedOriginalLength,
            data: redeflatedData,
          } = deflateTraits(encodedTraits);

          if (Number(originalLength) !== Number(expectedOriginalLength)) {
            setInflateResult({
              success: false,
              message: `Original length (${originalLength}) does not match expected length (${expectedOriginalLength})`,
            });
            return;
          }

          if (redeflatedData !== formattedData) {
            setInflateResult({
              success: false,
              message: "Redeflated data does not match original data",
            });
            return;
          }

          setEncodedTraits(encodedTraits);
          // Set decompressed traits as comma-separated list
          setDecompressedTraits(encodedTraits.join(","));
          // Check if the trait count matches
          const traitsMatchCount = encodedTraits.length === parsedTraitCount;

          // Use decodeTrait from noggles
          const decoded = encodedTraits.map((trait: EncodedTrait) =>
            decodeTrait(trait, 32, 32)
          );

          setDecodedTraits(decoded);
          setInflateResult({
            success: traitsMatchCount,
            message: traitsMatchCount
              ? `Successfully decoded ${encodedTraits.length} traits`
              : `Warning: Expected ${parsedTraitCount} traits, but decoded ${encodedTraits.length} traits`,
          });
        } catch (error) {
          console.error("Error decoding traits:", error);
          setDecodedTraits([]);
          setEncodedTraits([]);
          setInflateResult({
            success: false,
            message: `Error decoding data`,
          });
        }
      };

      handleTraitDecoding();
    } catch (error) {
      console.error("Error decoding traits:", error);
      setDecodedTraits([]);
      setInflateResult({
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }, [encodedData, originalLength, traitCount]);

  // Handle reverse compression when decompressed traits are edited
  useEffect(() => {
    if (!decompressedTraits) {
      return;
    }

    try {
      // Parse comma-separated traits
      const traits = decompressedTraits
        .split(",")
        .map(trait => trait.trim())
        .filter(trait => trait.length > 0);

      if (traits.length === 0) {
        return;
      }

      // Convert to EncodedTrait format and deflate
      const encodedTraits = traits as EncodedTrait[];
      const { originalLength: calculatedOriginalLength, data: compressedData } = deflateTraits(encodedTraits);

      // Update the form fields
      setEncodedData(compressedData);
      setOriginalLength(calculatedOriginalLength.toString());
      setTraitCount(traits.length.toString());
    } catch (error) {
      // Silent fail for invalid input during typing
      console.debug("Error compressing traits:", error);
    }
  }, [decompressedTraits]);

  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-4 mb-8">
        <div>
          <label
            htmlFor="encodedData"
            className="block text-sm font-medium mb-1"
          >
            Encoded Compressed Data (hex string)
          </label>
          <textarea
            id="encodedData"
            value={encodedData}
            onChange={(e) => setEncodedData(e.target.value)}
            placeholder="0x..."
            className="w-full border border-gray-300 rounded-md p-2 h-24 font-mono"
          />
        </div>

        <div>
          <label
            htmlFor="decompressedTraits"
            className="block text-sm font-medium mb-1"
          >
            Decompressed Encoded Traits (comma-separated)
          </label>
          <textarea
            id="decompressedTraits"
            value={decompressedTraits}
            onChange={(e) => setDecompressedTraits(e.target.value)}
            placeholder="0x...,0x...,0x..."
            className="w-full border border-gray-300 rounded-md p-2 h-24 font-mono"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="originalLength"
              className="block text-sm font-medium mb-1"
            >
              Original Length (number)
            </label>
            <input
              id="originalLength"
              type="number"
              value={originalLength}
              onChange={(e) => setOriginalLength(e.target.value)}
              placeholder="3488"
              className="w-full border border-gray-300 rounded-md p-2 font-mono"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="traitCount"
              className="block text-sm font-medium mb-1"
            >
              Trait Count (number)
            </label>
            <input
              id="traitCount"
              type="number"
              value={traitCount}
              onChange={(e) => setTraitCount(e.target.value)}
              placeholder="21"
              className="w-full border border-gray-300 rounded-md p-2 font-mono"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="traitType"
              className="block text-sm font-medium mb-1"
            >
              Trait Type
            </label>
            <select
              id="traitType"
              value={traitType}
              onChange={(e) => setTraitType(e.target.value as TraitType)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="accessories">Accessories</option>
              <option value="bodies">Bodies</option>
              <option value="heads">Heads</option>
              <option value="glasses">Glasses</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <input
            id="compareWithDAO"
            type="checkbox"
            checked={compareWithDAO}
            onChange={(e) => setCompareWithDAO(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="compareWithDAO" className="ml-2 text-sm font-medium">
            Compare with current DAO traits to verify trait update proposals
          </label>
        </div>
      </div>

      {inflateResult && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            inflateResult.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {inflateResult.message}
        </div>
      )}

      {(encodedTraits.length > 0 ||
        (compareWithDAO && currentDAOTraits.length > 0)) && (
        <div>
          <h3 className="text-xl font-bold mb-4">
            Decoded Traits ({decodedTraits.length})
            {compareWithDAO &&
              currentDAOTraits.length > 0 &&
              ` / DAO Traits (${currentDAOTraits.length})`}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Render decoded traits */}
            {encodedTraits.map((trait, index) => {
              const status = getTraitStatus(index, trait);
              return (
                <div
                  key={`decoded-${index}`}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-checkerboard rounded overflow-hidden">
                    <TraitImage traitData={trait} size={96} />
                  </div>
                  <span className="mt-2 text-sm text-center">
                    Trait {index}
                  </span>
                  <code
                    className="text-sm text-ellipsis w-24 overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors p-1 rounded"
                    onClick={() =>
                      copyToClipboard(String(encodedTraits[index]), index)
                    }
                  >
                    {copiedIndex === index ? "Copied!" : encodedTraits[index]}
                  </code>
                  {compareWithDAO && <StatusBadge status={status} />}
                </div>
              );
            })}

            {/* Render removed traits from DAO */}
            {compareWithDAO &&
              currentDAOTraits.length > encodedTraits.length &&
              currentDAOTraits
                .slice(encodedTraits.length)
                .map((daoTrait, i) => {
                  const index = i + encodedTraits.length;
                  return (
                    <div
                      key={`dao-${index}`}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 bg-checkerboard rounded overflow-hidden">
                        <TraitImage
                          traitData={daoTrait.data as EncodedTrait}
                          size={96}
                          opacity={0.5}
                        />
                      </div>
                      <span className="mt-2 text-sm text-center">
                        Trait {index}
                      </span>
                      <StatusBadge status="removed" />
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
};
