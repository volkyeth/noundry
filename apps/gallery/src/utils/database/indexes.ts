export interface IndexDefinition {
  collection: string;
  index: Record<string, 1 | -1>;
  name?: string;
}

export const requiredIndexes: IndexDefinition[] = [
  // Main traits browsing - most critical
  {
    collection: 'nfts',
    index: { "removed": 1, "creationDate": -1 },
    name: "removed_creationDate_desc"
  },
  {
    collection: 'nfts', 
    index: { "creationDate": -1 },
    name: "creationDate_desc"
  },
  {
    collection: 'nfts',
    index: { "creationDate": 1 },
    name: "creationDate_asc"  
  },
  {
    collection: 'nfts',
    index: { "likesCount": -1 },
    name: "likesCount_desc"
  },
  // For filtering by creator
  {
    collection: 'nfts',
    index: { "removed": 1, "address": 1, "creationDate": -1 },
    name: "removed_address_creationDate_desc"
  },
  // For artists page aggregation
  {
    collection: 'nfts',
    index: { "removed": 1, "address": 1, "type": 1 },
    name: "removed_address_type"
  }
];