import { MAX_TRAIT_NAME_LENGTH } from "@/constants/trait";
import { useSortBy } from "@/hooks/useSortBy";
import { useTraitSearch } from "@/hooks/useTraitSearch";
import { SortCriteria } from "@/types/sort";
import { Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { RiArrowUpDownLine, RiFilter3Line, RiSearchLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import Dynamic from "./Dynamic";
import { GalleryFilterModal } from "./GalleryFilterModal";

export interface GalleryQueryBarProps {
  className?: string;
}

export const GalleryQueryBar: FC<GalleryQueryBarProps> = ({ className }) => {
  const [sortBy, setSortBy] = useSortBy();
  const [search, setSearch] = useTraitSearch();
  const [searchValue, setSearchValue] = useState(search ?? "");
  const { isOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchValue);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue]);
  return (
    <div
      className={twMerge(
        "flex flex-wrap justify-between gap-4 mx-4 p-2",
        className
      )}
    >
      <Input
        endContent={<RiSearchLine size={24} className="text-gray-400" />}
        variant="underlined"
        maxLength={MAX_TRAIT_NAME_LENGTH}
        className="max-w-[400px]"
        size="lg"
        placeholder="Search"
        value={searchValue}
        defaultValue={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="flex justify-between gap-2 items-center">
        <Dynamic>
          <Select
            startContent={
              <RiArrowUpDownLine size={24} className="text-gray-400" />
            }
            disableAnimation
            variant="underlined"
            label="Sort by"
            size="sm"
            fullWidth={false}
            className="w-32"
            value={sortBy}
            defaultSelectedKeys={[sortBy]}
            onChange={(e) => setSortBy(e.target.value as SortCriteria)}
          >
            <SelectItem key="newest">newest</SelectItem>
            <SelectItem key="mostLiked">most liked</SelectItem>
            <SelectItem key="oldest">oldest</SelectItem>
          </Select>
        </Dynamic>
        <Button variant="ghost" className="px-4" onClick={onOpenChange}>
          <div className="flex gap-2 items-center">
            <RiFilter3Line size={24} className="text-gray-400" />{" "}
            <p className="text-sm font-normal text-default-500">Filter</p>
          </div>
        </Button>
        <GalleryFilterModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
    </div>
  );
};
