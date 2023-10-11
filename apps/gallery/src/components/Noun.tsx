import { useTraitBitmap } from "@/hooks/useTraitBitmap";
import { Trait } from "@/types/trait";
import { EncodedTrait, HexColor } from "noggles";
import { FC, HtmlHTMLAttributes, useEffect, useState } from "react";

export interface NounProps extends HtmlHTMLAttributes<HTMLCanvasElement> {
  glasses: EncodedTrait | Trait;
  head: EncodedTrait | Trait;
  accessory: EncodedTrait | Trait;
  body: EncodedTrait | Trait;
  background: HexColor;
  size: number;
}

export const Noun: FC<NounProps> = ({
  glasses,
  head,
  accessory,
  body,
  background,
  size,
  ...props
}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const glassesBitmap = useTraitBitmap(glasses);
  const headBitmap = useTraitBitmap(head);
  const accessoryBitmap = useTraitBitmap(accessory);
  const bodyBitmap = useTraitBitmap(body);

  useEffect(() => {
    if (
      !canvas ||
      !glassesBitmap ||
      !headBitmap ||
      !accessoryBitmap ||
      !bodyBitmap
    )
      return;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(bodyBitmap, 0, 0, size, size);
    ctx.drawImage(accessoryBitmap, 0, 0, size, size);
    ctx.drawImage(headBitmap, 0, 0, size, size);
    ctx.drawImage(glassesBitmap, 0, 0, size, size);
  }, [
    canvas,
    glassesBitmap,
    headBitmap,
    accessoryBitmap,
    bodyBitmap,
    background,
    size,
  ]);

  return <canvas width={size} height={size} ref={setCanvas} {...props} />;
};
