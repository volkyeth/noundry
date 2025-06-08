"use server";

import { getAllVersions } from "@/app/actions/trait/getAllVersions";

export const getNextVersion = async (traitId: string): Promise<number> => {
    const allVersions = await getAllVersions(traitId);

    if (allVersions.length === 0) {
        return 1;
    }

    const maxVersion = Math.max(...allVersions.map(trait => trait.version));
    return maxVersion + 1;
};