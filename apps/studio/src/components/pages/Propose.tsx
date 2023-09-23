import { Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useProposalState } from "../../model/Proposal";
import { NounPartType } from "../../types/noun";
import { nounPartIcon, nounParts } from "../../utils/constants";
import { PartImporter } from "../PartImporter";
import { ProposePart } from "../ProposePart";
import { useHeaderState } from "../layout/Header";

export const Propose = () => {
  const { partType } = useParams();
  const { partBitmap, setPartBitmap } = useProposalState();
  const navigate = useNavigate();
  const partSelected = partType && isNounPartType(partType);
  const sectionTitle = partSelected ? `Propose ${partType}` : "Propose part";

  useEffect(() => {
    useHeaderState.setState({ sectionTitle: sectionTitle });
  }, [sectionTitle]);

  if (!partType) {
    return (
      <Center h="100vh" minW="100vw">
        <VStack bgColor="gray.900" color="gray.100" p={10} spacing={10}>
          <Text fontSize={16}>Which kind?</Text>
          <HStack spacing={10}>
            {nounParts.slice(1).map((nounPart) => {
              const PartIcon = nounPartIcon[nounPart];

              return (
                <VStack key={nounPart}>
                  <Link to={`/propose/${nounPart}`}>
                    <Button h={"fit-content"} w={"fit-content"} p={2}>
                      <PartIcon width={64} height={64} />
                    </Button>
                  </Link>
                  <Text fontSize={10}>{nounPart.toUpperCase()}</Text>
                </VStack>
              );
            })}
          </HStack>
        </VStack>
      </Center>
    );
  }

  if (!isNounPartType(partType)) return <Navigate to={"/propose"} />;

  if (!partBitmap)
    return (
      <VStack h="full" minW="full" padding={10} spacing={10}>
        <Button alignSelf={"start"} onClick={() => navigate("/propose", { replace: true })}>
          ← Back
        </Button>
        <PartImporter
          canFinishIfPaletteConforms={true}
          finishText="Next"
          finishAction={async (canvas) => {
            setPartBitmap(await createImageBitmap(canvas));
          }}
        />
      </VStack>
    );

  return <ProposePart partType={partType} partBitmap={partBitmap} />;
};

const isNounPartType = (partType: string): partType is NounPartType => nounParts.includes(partType as NounPartType);
