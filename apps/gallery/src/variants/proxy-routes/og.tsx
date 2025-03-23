import { GET as LilNounsGET } from "@/variants/lil-nouns/routes/og";
import { GET as NounsGET } from "@/variants/nouns/routes/og";

export const GET = async (req: Request, { params: { id } }) => {
  const variant = process.env.NEXT_PUBLIC_APP_VARIANT;
  switch (variant) {
    case "nouns":
      return NounsGET(req, { params: { id } });
    case "lil-nouns":
      return LilNounsGET(req, { params: { id } });
    default:
      throw new Error(`Invalid variant: ${variant}`);
  }
};
