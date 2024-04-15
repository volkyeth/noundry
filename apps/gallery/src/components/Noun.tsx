import { useTraitBitmap } from "@/hooks/useTraitBitmap";
import { NounTraits } from "@/types/noun";
import {
  FC,
  HtmlHTMLAttributes,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

export interface NounProps
  extends Partial<Omit<NounTraits, "background">>,
    Pick<NounTraits, "background">,
    HtmlHTMLAttributes<HTMLDivElement> {
  margin?: number;
  size: number;
  circleCrop?: boolean;
  withCheckerboardBg?: boolean;
  canvasRef?: Ref<HTMLCanvasElement | null>;
}

export const Noun: FC<NounProps> = ({
  glasses,
  head,
  accessory,
  body,
  background,
  size,
  circleCrop = false,
  margin = 0,
  canvasRef,
  withCheckerboardBg = true,
  className,
  ...props
}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const glassesBitmap = useTraitBitmap(glasses);
  const headBitmap = useTraitBitmap(head);
  const accessoryBitmap = useTraitBitmap(accessory);
  const bodyBitmap = useTraitBitmap(body);
  useImperativeHandle(
    canvasRef,
    () => (ready ? (canvas as HTMLCanvasElement) : null),
    [canvas, ready]
  );

  useEffect(() => {
    if (!canvas) return;

    canvas.width = size + margin * 2;
    canvas.height = size + margin * 2;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(margin, margin, size, size);
    ctx.fillStyle = background;
    ctx.fillRect(margin, margin, size, size);
    bodyBitmap && ctx.drawImage(bodyBitmap, margin, margin, size, size);
    accessoryBitmap &&
      ctx.drawImage(accessoryBitmap, margin, margin, size, size);
    headBitmap && ctx.drawImage(headBitmap, margin, margin, size, size);
    glassesBitmap && ctx.drawImage(glassesBitmap, margin, margin, size, size);
    if (circleCrop) {
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    setReady(true);
  }, [
    margin,
    canvas,
    glassesBitmap,
    headBitmap,
    accessoryBitmap,
    bodyBitmap,
    circleCrop,
    background,
    size,
  ]);

  return (
    <div className={twMerge("w-fit h-fit", className)} {...props}>
      <canvas
        ref={setCanvas}
        className={twMerge(
          withCheckerboardBg ? "bg-checkerboard" : "",
          "w-full h-full"
        )}
      />
    </div>
  );
};
