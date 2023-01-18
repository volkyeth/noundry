import { Button, Center, Spinner, Text, useBoolean, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { loadNoun, useNounState } from "../../state/nounState";
import { Fragment, useEffect, useRef, useState } from "react";
import { getPixels } from "../../utils/colors";

export const CheckThisNoun = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { id } = useParams();
  const nounId = parseInt(id!);
  const navigate = useNavigate();
  const [loading, setLoading] = useBoolean(true);
  const [pixels, setPixels] = useState<string[] | null>();
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    useNounState.getState().canvasRef(canvas);
    loadNoun(id!).then(() => {
      setPixels(getPixels(canvas).map((p) => p.toRgbString()));
      setLoading.off();
    });
  }, [nounId, svgRef.current]);

  useEffect(() => {
    const navigateWithKeyboard = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && nounId <= 582) {
        navigate(`/check-this-noun/${nounId + 1}`);
        setLoading.on();
      }
      if (e.key === "ArrowLeft" && nounId > 0) {
        navigate(`/check-this-noun/${nounId - 1}`);
        setLoading.on();
      }
    };

    document.addEventListener("keydown", navigateWithKeyboard);
    return () => {
      document.removeEventListener("keydown", navigateWithKeyboard);
    };
  }, [nounId]);

  const nounBgColor = pixels ? pixels[0] : "magenta";
  const checksBgColor = "#60b1f4";
  const padding = 2;
  const boxSize = 16 + padding * 2;
  const gutter = 16;
  const margin = 128;
  const length = 32 * boxSize + gutter * 2 + margin * 2;
  console.log({ nounBgColor, checksBgColor, padding, boxSize, gutter, length });
  return (
    <Center bgColor="gray.900" h="100vh" w="100vw">
      <VStack color="gray.100" h={"full"} spacing={10} p={10}>
        <Text as="h1" fontSize={24}>
          Check this Noun #{id}
        </Text>
        {!pixels || loading ? (
          <Center bgColor={"white"} w={`${length}px`} h={`${length}px`}>
            <Spinner color={checksBgColor} size={"xl"} />
          </Center>
        ) : (
          <svg ref={svgRef} viewBox={`0 0 ${length} ${length}`} width={2048} height={2048} xmlns={"http://www.w3.org/2000/svg"}>
            <rect width={length} height={length} fill="rgb(239, 239, 239)" />
            <rect x={margin} y={margin} width={length - 2 * margin} height={length - 2 * margin} fill="white" />
            {pixels.map((pixel, i) => {
              const x = i % 32;
              const y = Math.floor(i / 32);
              return (
                <Fragment key={i}>
                  <path
                    transform={`translate(${gutter + margin + x * boxSize + padding}, ${gutter + margin + y * boxSize + padding})`}
                    fill={pixel === nounBgColor ? checksBgColor : pixel}
                    d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"
                  />
                  ;
                </Fragment>
              );
            })}
          </svg>
        )}
        {!loading && (
          <Button
            onClick={() => {
              const svgData = svgRef.current?.outerHTML;
              if (!svgData) return;
              const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
              const svgUrl = URL.createObjectURL(svgBlob);
              const downloadLink = document.createElement("a");
              downloadLink.href = svgUrl;
              downloadLink.download = `check-this-noun-${id}.svg`;
              downloadLink.click();
            }}
          >
            Download
          </Button>
        )}
      </VStack>
    </Center>
  );
};
