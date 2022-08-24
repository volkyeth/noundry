import React, { FC, useRef, useState } from "react";
import { Box, Center, CenterProps, useBoolean } from "@chakra-ui/react";

export type CanvasDimensions = {
  x: number;
  y: number;
};

type Point = { x: number; y: number };

const Layer = React.forwardRef<
  HTMLCanvasElement,
  React.ComponentProps<"canvas">
>((props, ref) => (
  <canvas
    ref={ref}
    style={{
      width: "512px",
      height: "512px",
      position: "absolute",
      imageRendering: "pixelated",
    }}
    width={32}
    height={32}
    {...props}
  />
));

export type CanvasProps = {
  dimensions: CanvasDimensions;
  workingCanvasRef: React.RefObject<HTMLCanvasElement>;
};

export const Canvas: FC<CanvasProps> = ({ dimensions, workingCanvasRef }) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Box
      w="512px"
      h="512px"
      bgSize="32px 32px"
      bgGradient="repeating-conic(gray.200 0% 25%, white 0% 50%)"
    >
      <Layer ref={hoverCanvasRef} />
      <Layer ref={mainCanvasRef} />
      <Layer id="workingCanvas" ref={workingCanvasRef} />
    </Box>
  );
};

export type WorkspaceProps = {
  paintColor: string;
} & CenterProps;

export const Workspace: FC<WorkspaceProps> = ({ paintColor, ...props }) => {
  const workingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [clicking, setClicking] = useBoolean(false);
  const [lastPoint, setLastPoint] = useState<Point>({ x: 0, y: 0 });

  return (
    <Center
      {...props}
      onMouseDown={(e) => {
        if (!workingCanvasRef.current) {
          return;
        }

        setClicking.on();
        const point = canvasPoint(e, workingCanvasRef.current);
        const ctx = workingCanvasRef.current.getContext("2d")!;
        ctx.fillStyle = paintColor;
        drawPixel(point, ctx);
        setLastPoint(point);
      }}
      onMouseMove={(e) => {
        if (!clicking || !workingCanvasRef.current) {
          return;
        }

        const point = canvasPoint(e, workingCanvasRef.current);
        const ctx = workingCanvasRef.current.getContext("2d")!;
        ctx.fillStyle = paintColor;
        drawLine(lastPoint, point, ctx);
        setLastPoint(point);
      }}
      onMouseUp={(e) => {
        if (!workingCanvasRef.current) {
          return;
        }

        const ctx = workingCanvasRef.current.getContext("2d")!;
        ctx.fillStyle = paintColor;

        drawPixel(canvasPoint(e, workingCanvasRef.current), ctx);
        setClicking.off();
      }}
    >
      <Canvas
        dimensions={{ x: 32, y: 32 }}
        workingCanvasRef={workingCanvasRef}
      />
    </Center>
  );
};

const coordinates = (point: Point) => Object.values(point) as [number, number];

const drawPixel = (point: Point, ctx: CanvasRenderingContext2D) => {
  ctx.fillRect(...coordinates(point), 1, 1);
};

const drawLine = (start: Point, end: Point, ctx: CanvasRenderingContext2D) => {
  const xLength = Math.abs(end.x - start.x) + 1;
  const yLength = Math.abs(start.y - end.y) + 1;
  const pixels = Math.floor(Math.max(xLength, yLength));

  for (let i = 0; i <= pixels; i++) {
    const x = Math.floor((start.x * (pixels - i) + end.x * i) / pixels);
    const y = Math.floor((start.y * (pixels - i) + end.y * i) / pixels);
    drawPixel({ x, y }, ctx);
  }
};

// Get the point on the canvas
const canvasPoint = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  canvas: HTMLCanvasElement
): Point => {
  const canvasRect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(
      ((event.clientX - canvasRect.left) * canvas.width) / canvasRect.width
    ),
    y: Math.floor(
      ((event.clientY - canvasRect.top) * canvas.height) / canvasRect.height
    ),
  };
};
