import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsDaoData
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export const nounsDaoDataABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'nounsToken_', internalType: 'address', type: 'address' },
      { name: 'nounsDao_', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'AmountExceedsBalance' },
  { type: 'error', inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }], name: 'FailedWithdrawingETH' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidSupportValue' },
  { type: 'error', inputs: [], name: 'MustBeNounerOrPaySufficientFee' },
  { type: 'error', inputs: [], name: 'SlugAlreadyUsed' },
  { type: 'error', inputs: [], name: 'SlugDoesNotExist' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  { type: 'event', anonymous: false, inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }], name: 'BeaconUpgraded' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CandidateFeedbackSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldCreateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newCreateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CreateCandidateCostSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ETHWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldFeeRecipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'newFeeRecipient', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'FeeRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'FeedbackSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCandidateCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'encodedProposalHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'ProposalCandidateCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'encodedProposalHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCandidateUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address', indexed: true },
      { name: 'sig', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'encodedPropHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'sigDigest', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'SignatureAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldUpdateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newUpdateCandidateCost', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'UpdateCandidateCostSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PRIOR_VOTES_BLOCKS_AGO',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
      { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256' },
      { name: 'encodedProp', internalType: 'bytes', type: 'bytes' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'addSignature',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'slug', internalType: 'string', type: 'string' }],
    name: 'cancelProposalCandidate',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'createCandidateCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createProposalCandidate',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'createCandidateCost_', internalType: 'uint256', type: 'uint256' },
      { name: 'updateCandidateCost_', internalType: 'uint256', type: 'uint256' },
      { name: 'feeRecipient_', internalType: 'address payable', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'nounsDao', outputs: [{ name: '', internalType: 'address', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nounsToken',
    outputs: [{ name: '', internalType: 'contract NounsTokenLike', type: 'address' }],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'owner', outputs: [{ name: '', internalType: 'address', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'propCandidates',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'sendCandidateFeedback',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'sendFeedback',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newCreateCandidateCost', internalType: 'uint256', type: 'uint256' }],
    name: 'setCreateCandidateCost',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newFeeRecipient', internalType: 'address payable', type: 'address' }],
    name: 'setFeeRecipient',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newUpdateCandidateCost', internalType: 'uint256', type: 'uint256' }],
    name: 'setUpdateCandidateCost',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'updateCandidateCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'slug', internalType: 'string', type: 'string' },
      { name: 'proposalIdToUpdate', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalCandidate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawETH',
    outputs: [],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export const nounsDaoDataAddress = {
  1: '0xf790A5f59678dd733fb3De93493A91f472ca1365',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export const nounsDaoDataConfig = { address: nounsDaoDataAddress, abi: nounsDaoDataABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZoraNftCreator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export const zoraNftCreatorABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_implementation', internalType: 'address', type: 'address' },
      { name: '_editionMetadataRenderer', internalType: 'contract EditionMetadataRenderer', type: 'address' },
      { name: '_dropMetadataRenderer', internalType: 'contract DropMetadataRenderer', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  { type: 'event', anonymous: false, inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }], name: 'BeaconUpgraded' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'creator', internalType: 'address', type: 'address', indexed: true },
      { name: 'editionContractAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'editionSize', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CreatedDrop',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  { stateMutability: 'pure', type: 'function', inputs: [], name: 'contractName', outputs: [{ name: '', internalType: 'string', type: 'string' }] },
  { stateMutability: 'pure', type: 'function', inputs: [], name: 'contractURI', outputs: [{ name: '', internalType: 'string', type: 'string' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'contractVersion', outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      { name: 'setupCalls', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'metadataRenderer', internalType: 'contract IMetadataRenderer', type: 'address' },
      { name: 'metadataInitializer', internalType: 'bytes', type: 'bytes' },
      { name: 'createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'createAndConfigureDrop',
    outputs: [{ name: 'newDropAddress', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'metadataURIBase', internalType: 'string', type: 'string' },
      { name: 'metadataContractURI', internalType: 'string', type: 'string' },
    ],
    name: 'createDrop',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'metadataURIBase', internalType: 'string', type: 'string' },
      { name: 'metadataContractURI', internalType: 'string', type: 'string' },
      { name: 'createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'createDropWithReferral',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'animationURI', internalType: 'string', type: 'string' },
      { name: 'imageURI', internalType: 'string', type: 'string' },
    ],
    name: 'createEdition',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'animationURI', internalType: 'string', type: 'string' },
      { name: 'imageURI', internalType: 'string', type: 'string' },
      { name: 'createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'createEditionWithReferral',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'dropMetadataRenderer',
    outputs: [{ name: '', internalType: 'contract DropMetadataRenderer', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'editionMetadataRenderer',
    outputs: [{ name: '', internalType: 'contract EditionMetadataRenderer', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'initialize', outputs: [] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'owner', outputs: [{ name: '', internalType: 'address', type: 'address' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'proxiableUUID', outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }] },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'metadataRenderer', internalType: 'contract IMetadataRenderer', type: 'address' },
      { name: 'metadataInitializer', internalType: 'bytes', type: 'bytes' },
      { name: 'createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'setupDropsContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export const zoraNftCreatorAddress = {
  1: '0xF74B146ce44CC162b601deC3BE331784DB111DC1',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export const zoraNftCreatorConfig = { address: zoraNftCreatorAddress, abi: zoraNftCreatorABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataRead<TFunctionName extends string, TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], ...config } as UseContractReadConfig<
    typeof nounsDaoDataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"PRIOR_VOTES_BLOCKS_AGO"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataPriorVotesBlocksAgo<
  TFunctionName extends 'PRIOR_VOTES_BLOCKS_AGO',
  TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'PRIOR_VOTES_BLOCKS_AGO',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"createCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataCreateCandidateCost<
  TFunctionName extends 'createCandidateCost',
  TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'createCandidateCost',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"feeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataFeeRecipient<
  TFunctionName extends 'feeRecipient',
  TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], functionName: 'feeRecipient', ...config } as UseContractReadConfig<
    typeof nounsDaoDataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"nounsDao"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataNounsDao<TFunctionName extends 'nounsDao', TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], functionName: 'nounsDao', ...config } as UseContractReadConfig<
    typeof nounsDaoDataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"nounsToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataNounsToken<
  TFunctionName extends 'nounsToken',
  TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], functionName: 'nounsToken', ...config } as UseContractReadConfig<
    typeof nounsDaoDataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataOwner<TFunctionName extends 'owner', TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], functionName: 'owner', ...config } as UseContractReadConfig<
    typeof nounsDaoDataABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"propCandidates"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataPropCandidates<
  TFunctionName extends 'propCandidates',
  TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'propCandidates',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"updateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataUpdateCandidateCost<
  TFunctionName extends 'updateCandidateCost',
  TSelectData = ReadContractResult<typeof nounsDaoDataABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'updateCandidateCost',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, string>['request']['abi'], TFunctionName, TMode> & {
        address?: Address
        chainId?: TChainId
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, TFunctionName, TMode>({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"addSignature"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataAddSignature<TMode extends WriteContractMode = undefined, TChainId extends number = keyof typeof nounsDaoDataAddress>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'addSignature'>['request']['abi'], 'addSignature', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addSignature'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'addSignature', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addSignature'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'addSignature', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'addSignature',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"cancelProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataCancelProposalCandidate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'cancelProposalCandidate'>['request']['abi'],
        'cancelProposalCandidate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'cancelProposalCandidate' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'cancelProposalCandidate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'cancelProposalCandidate'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'cancelProposalCandidate', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'cancelProposalCandidate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"createProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataCreateProposalCandidate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'createProposalCandidate'>['request']['abi'],
        'createProposalCandidate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createProposalCandidate' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'createProposalCandidate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createProposalCandidate'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'createProposalCandidate', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'createProposalCandidate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataInitialize<TMode extends WriteContractMode = undefined, TChainId extends number = keyof typeof nounsDaoDataAddress>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'initialize'>['request']['abi'], 'initialize', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'initialize'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'initialize', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'renounceOwnership', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"sendCandidateFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataSendCandidateFeedback<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'sendCandidateFeedback'>['request']['abi'],
        'sendCandidateFeedback',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'sendCandidateFeedback' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'sendCandidateFeedback', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendCandidateFeedback'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'sendCandidateFeedback', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'sendCandidateFeedback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"sendFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataSendFeedback<TMode extends WriteContractMode = undefined, TChainId extends number = keyof typeof nounsDaoDataAddress>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'sendFeedback'>['request']['abi'], 'sendFeedback', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'sendFeedback'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'sendFeedback', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendFeedback'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'sendFeedback', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'sendFeedback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"setCreateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataSetCreateCandidateCost<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'setCreateCandidateCost'>['request']['abi'],
        'setCreateCandidateCost',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setCreateCandidateCost' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'setCreateCandidateCost', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setCreateCandidateCost'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'setCreateCandidateCost', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'setCreateCandidateCost',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"setFeeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataSetFeeRecipient<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'setFeeRecipient'>['request']['abi'], 'setFeeRecipient', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setFeeRecipient'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'setFeeRecipient', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setFeeRecipient'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'setFeeRecipient', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'setFeeRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"setUpdateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataSetUpdateCandidateCost<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'setUpdateCandidateCost'>['request']['abi'],
        'setUpdateCandidateCost',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setUpdateCandidateCost' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'setUpdateCandidateCost', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setUpdateCandidateCost'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'setUpdateCandidateCost', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'setUpdateCandidateCost',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'transferOwnership', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"updateProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataUpdateProposalCandidate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof nounsDaoDataABI, 'updateProposalCandidate'>['request']['abi'],
        'updateProposalCandidate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'updateProposalCandidate' }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'updateProposalCandidate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateProposalCandidate'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'updateProposalCandidate', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'updateProposalCandidate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataUpgradeTo<TMode extends WriteContractMode = undefined, TChainId extends number = keyof typeof nounsDaoDataAddress>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'upgradeTo'>['request']['abi'], 'upgradeTo', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'upgradeTo'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'upgradeTo', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'upgradeToAndCall'>['request']['abi'], 'upgradeToAndCall', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'upgradeToAndCall', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"withdrawETH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataWithdrawEth<TMode extends WriteContractMode = undefined, TChainId extends number = keyof typeof nounsDaoDataAddress>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof nounsDaoDataABI, 'withdrawETH'>['request']['abi'], 'withdrawETH', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'withdrawETH'
      }
    : UseContractWriteConfig<typeof nounsDaoDataABI, 'withdrawETH', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawETH'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoDataABI, 'withdrawETH', TMode>({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'withdrawETH',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], ...config } as UsePrepareContractWriteConfig<
    typeof nounsDaoDataABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"addSignature"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataAddSignature(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'addSignature'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'addSignature',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'addSignature'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"cancelProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataCancelProposalCandidate(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'cancelProposalCandidate'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'cancelProposalCandidate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'cancelProposalCandidate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"createProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataCreateProposalCandidate(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'createProposalCandidate'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'createProposalCandidate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'createProposalCandidate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataInitialize(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'initialize'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataRenounceOwnership(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'renounceOwnership'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"sendCandidateFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataSendCandidateFeedback(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'sendCandidateFeedback'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'sendCandidateFeedback',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'sendCandidateFeedback'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"sendFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataSendFeedback(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'sendFeedback'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'sendFeedback',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'sendFeedback'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"setCreateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataSetCreateCandidateCost(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'setCreateCandidateCost'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'setCreateCandidateCost',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'setCreateCandidateCost'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"setFeeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataSetFeeRecipient(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'setFeeRecipient'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'setFeeRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'setFeeRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"setUpdateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataSetUpdateCandidateCost(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'setUpdateCandidateCost'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'setUpdateCandidateCost',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'setUpdateCandidateCost'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataTransferOwnership(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'transferOwnership'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"updateProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataUpdateProposalCandidate(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'updateProposalCandidate'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'updateProposalCandidate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'updateProposalCandidate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataUpgradeTo(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'upgradeTo'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataUpgradeToAndCall(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'upgradeToAndCall'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoDataABI}__ and `functionName` set to `"withdrawETH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDaoDataWithdrawEth(
  config: Omit<UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'withdrawETH'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    functionName: 'withdrawETH',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoDataABI, 'withdrawETH'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, TEventName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'AdminChanged'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], eventName: 'AdminChanged', ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    'AdminChanged'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataBeaconUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'BeaconUpgraded'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], eventName: 'BeaconUpgraded', ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    'BeaconUpgraded'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"CandidateFeedbackSent"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataCandidateFeedbackSentEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'CandidateFeedbackSent'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'CandidateFeedbackSent',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'CandidateFeedbackSent'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"CreateCandidateCostSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataCreateCandidateCostSetEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'CreateCandidateCostSet'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'CreateCandidateCostSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'CreateCandidateCostSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"ETHWithdrawn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataEthWithdrawnEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'ETHWithdrawn'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], eventName: 'ETHWithdrawn', ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    'ETHWithdrawn'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"FeeRecipientSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataFeeRecipientSetEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'FeeRecipientSet'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'FeeRecipientSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'FeeRecipientSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"FeedbackSent"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataFeedbackSentEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'FeedbackSent'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], eventName: 'FeedbackSent', ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    'FeedbackSent'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataOwnershipTransferredEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'OwnershipTransferred'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"ProposalCandidateCanceled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataProposalCandidateCanceledEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'ProposalCandidateCanceled'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'ProposalCandidateCanceled',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'ProposalCandidateCanceled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"ProposalCandidateCreated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataProposalCandidateCreatedEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'ProposalCandidateCreated'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'ProposalCandidateCreated',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'ProposalCandidateCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"ProposalCandidateUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataProposalCandidateUpdatedEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'ProposalCandidateUpdated'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'ProposalCandidateUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'ProposalCandidateUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"SignatureAdded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataSignatureAddedEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'SignatureAdded'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], eventName: 'SignatureAdded', ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    'SignatureAdded'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"UpdateCandidateCostSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataUpdateCandidateCostSetEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'UpdateCandidateCostSet'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoDataABI,
    address: nounsDaoDataAddress[1],
    eventName: 'UpdateCandidateCostSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoDataABI, 'UpdateCandidateCostSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoDataABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDaoDataUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof nounsDaoDataABI, 'Upgraded'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof nounsDaoDataAddress
  } = {} as any,
) {
  return useContractEvent({ abi: nounsDaoDataABI, address: nounsDaoDataAddress[1], eventName: 'Upgraded', ...config } as UseContractEventConfig<
    typeof nounsDaoDataABI,
    'Upgraded'
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorRead<TFunctionName extends string, TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({ abi: zoraNftCreatorABI, address: zoraNftCreatorAddress[1], ...config } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"contractName"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorContractName<
  TFunctionName extends 'contractName',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'contractName',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"contractURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorContractUri<
  TFunctionName extends 'contractURI',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"contractVersion"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorContractVersion<
  TFunctionName extends 'contractVersion',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'contractVersion',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"dropMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorDropMetadataRenderer<
  TFunctionName extends 'dropMetadataRenderer',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'dropMetadataRenderer',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"editionMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorEditionMetadataRenderer<
  TFunctionName extends 'editionMetadataRenderer',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'editionMetadataRenderer',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"implementation"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorImplementation<
  TFunctionName extends 'implementation',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'implementation',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorOwner<TFunctionName extends 'owner', TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({ abi: zoraNftCreatorABI, address: zoraNftCreatorAddress[1], functionName: 'owner', ...config } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof zoraNftCreatorABI, string>['request']['abi'], TFunctionName, TMode> & {
        address?: Address
        chainId?: TChainId
      }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, TFunctionName, TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createAndConfigureDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorCreateAndConfigureDrop<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'createAndConfigureDrop'>['request']['abi'],
        'createAndConfigureDrop',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createAndConfigureDrop' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'createAndConfigureDrop', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createAndConfigureDrop'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'createAndConfigureDrop', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createAndConfigureDrop',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorCreateDrop<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof zoraNftCreatorABI, 'createDrop'>['request']['abi'], 'createDrop', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createDrop'
      }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'createDrop', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createDrop'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'createDrop', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createDrop',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createDropWithReferral"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorCreateDropWithReferral<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'createDropWithReferral'>['request']['abi'],
        'createDropWithReferral',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createDropWithReferral' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'createDropWithReferral', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createDropWithReferral'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'createDropWithReferral', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createDropWithReferral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createEdition"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorCreateEdition<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof zoraNftCreatorABI, 'createEdition'>['request']['abi'], 'createEdition', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createEdition'
      }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'createEdition', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createEdition'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'createEdition', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createEdition',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createEditionWithReferral"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorCreateEditionWithReferral<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'createEditionWithReferral'>['request']['abi'],
        'createEditionWithReferral',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createEditionWithReferral' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'createEditionWithReferral', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createEditionWithReferral'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'createEditionWithReferral', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createEditionWithReferral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof zoraNftCreatorABI, 'initialize'>['request']['abi'], 'initialize', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'initialize'
      }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'initialize', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'renounceOwnership', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"setupDropsContract"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorSetupDropsContract<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'setupDropsContract'>['request']['abi'],
        'setupDropsContract',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setupDropsContract' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'setupDropsContract', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setupDropsContract'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'setupDropsContract', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'setupDropsContract',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'transferOwnership', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorUpgradeTo<TMode extends WriteContractMode = undefined, TChainId extends number = keyof typeof zoraNftCreatorAddress>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<PrepareWriteContractResult<typeof zoraNftCreatorABI, 'upgradeTo'>['request']['abi'], 'upgradeTo', TMode> & {
        address?: Address
        chainId?: TChainId
        functionName?: 'upgradeTo'
      }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'upgradeTo', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zoraNftCreatorABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'upgradeToAndCall', TMode>({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({ abi: zoraNftCreatorABI, address: zoraNftCreatorAddress[1], ...config } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createAndConfigureDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateAndConfigureDrop(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createAndConfigureDrop'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createAndConfigureDrop',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createAndConfigureDrop'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateDrop(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createDrop'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createDrop',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createDrop'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createDropWithReferral"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateDropWithReferral(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createDropWithReferral'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createDropWithReferral',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createDropWithReferral'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createEdition"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateEdition(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createEdition'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createEdition',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createEdition'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createEditionWithReferral"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateEditionWithReferral(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createEditionWithReferral'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createEditionWithReferral',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createEditionWithReferral'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorInitialize(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'initialize'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorRenounceOwnership(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'renounceOwnership'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"setupDropsContract"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorSetupDropsContract(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'setupDropsContract'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'setupDropsContract',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'setupDropsContract'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorTransferOwnership(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'transferOwnership'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorUpgradeTo(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeTo'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorUpgradeToAndCall(
  config: Omit<UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeToAndCall'>, 'abi' | 'address' | 'functionName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof zoraNftCreatorABI, TEventName>, 'abi' | 'address'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractEvent({ abi: zoraNftCreatorABI, address: zoraNftCreatorAddress[1], ...config } as UseContractEventConfig<
    typeof zoraNftCreatorABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorAdminChangedEvent(
  config: Omit<UseContractEventConfig<typeof zoraNftCreatorABI, 'AdminChanged'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zoraNftCreatorABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorBeaconUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof zoraNftCreatorABI, 'BeaconUpgraded'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof zoraNftCreatorABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `eventName` set to `"CreatedDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorCreatedDropEvent(
  config: Omit<UseContractEventConfig<typeof zoraNftCreatorABI, 'CreatedDrop'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    eventName: 'CreatedDrop',
    ...config,
  } as UseContractEventConfig<typeof zoraNftCreatorABI, 'CreatedDrop'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorOwnershipTransferredEvent(
  config: Omit<UseContractEventConfig<typeof zoraNftCreatorABI, 'OwnershipTransferred'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractEvent({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof zoraNftCreatorABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorUpgradedEvent(
  config: Omit<UseContractEventConfig<typeof zoraNftCreatorABI, 'Upgraded'>, 'abi' | 'address' | 'eventName'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  } = {} as any,
) {
  return useContractEvent({ abi: zoraNftCreatorABI, address: zoraNftCreatorAddress[1], eventName: 'Upgraded', ...config } as UseContractEventConfig<
    typeof zoraNftCreatorABI,
    'Upgraded'
  >)
}
