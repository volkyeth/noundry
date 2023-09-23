import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractMode,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
  watchContractEvent,
  WatchContractEventConfig,
  WatchContractEventCallback,
} from 'wagmi/actions'

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
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsDAO
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export const nounsDaoABI = [
  { type: 'error', inputs: [], name: 'AdminOnly' },
  { type: 'error', inputs: [], name: 'CanOnlyInitializeOnce' },
  { type: 'error', inputs: [], name: 'InvalidNounsAddress' },
  { type: 'error', inputs: [], name: 'InvalidTimelockAddress' },
  { type: 'error', inputs: [], name: 'MustProvideActions' },
  { type: 'error', inputs: [], name: 'ProposalInfoArityMismatch' },
  { type: 'error', inputs: [], name: 'ProposerAlreadyHasALiveProposal' },
  { type: 'error', inputs: [], name: 'TooManyActions' },
  { type: 'error', inputs: [], name: 'UnsafeUint16Cast' },
  { type: 'error', inputs: [], name: 'VotesBelowProposalThreshold' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'numTokens',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'DAONounsSupplyIncreasedFromEscrow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'DAOWithdrawNounsFromEscrow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldErc20Tokens',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'newErc20tokens',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'ERC20TokensToIncludeInForkSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'proposalIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'EscrowedToFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'forkTreasury',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'forkToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'forkEndTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokensInEscrow',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExecuteFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldForkDAODeployer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newForkDAODeployer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ForkDAODeployerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldForkPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newForkPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ForkPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldForkThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newForkThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ForkThresholdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'proposalIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'JoinFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'LastMinuteWindowSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldMaxQuorumVotesBPS',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'newMaxQuorumVotesBPS',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'MaxQuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldMinQuorumVotesBPS',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'newMinQuorumVotesBPS',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'MinQuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NewAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldImplementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newImplementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NewImplementation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldPendingAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newPendingAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NewPendingAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldPendingVetoer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newPendingVetoer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NewPendingVetoer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVetoer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newVetoer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NewVetoer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'ObjectionPeriodDurationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'startBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalCreatedOnTimelockV1',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'signers',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'startBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'updatePeriodEndBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'quorumVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreatedWithRequirements',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'startBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'quorumVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreatedWithRequirements',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'updateMessage',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalDescriptionUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'objectionPeriodEndBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalObjectionPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldProposalThresholdBPS',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newProposalThresholdBPS',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalThresholdBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'updateMessage',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalTransactionsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'ProposalUpdatablePeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'updateMessage',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalVetoed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldQuorumCoefficient',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newQuorumCoefficient',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'QuorumCoefficientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldQuorumVotesBPS',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newQuorumVotesBPS',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'QuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'refundAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'refundSent',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'RefundableVote',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'sig', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'SignatureCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'timelock',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'timelockV1',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TimelocksAndAdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'votes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVoteSnapshotBlockSwitchProposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVoteSnapshotBlockSwitchProposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VoteSnapshotBlockSwitchProposalIdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVotingDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotingDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVotingPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotingPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'sent', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Withdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'WithdrawFromForkEscrow',
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MAX_PROPOSAL_THRESHOLD_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MIN_PROPOSAL_THRESHOLD_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: '_acceptAdmin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: '_acceptVetoer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: '_burnVetoPower',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newMinQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'newMaxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'newQuorumCoefficient', internalType: 'uint32', type: 'uint32' },
    ],
    name: '_setDynamicQuorumParams',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'erc20tokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: '_setErc20TokensToIncludeInFork',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newForkDAODeployer', internalType: 'address', type: 'address' },
    ],
    name: '_setForkDAODeployer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newForkEscrow', internalType: 'address', type: 'address' },
    ],
    name: '_setForkEscrow',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'forkEscrow_', internalType: 'address', type: 'address' },
      { name: 'forkDAODeployer_', internalType: 'address', type: 'address' },
      {
        name: 'erc20TokensToIncludeInFork_',
        internalType: 'address[]',
        type: 'address[]',
      },
      { name: 'forkPeriod_', internalType: 'uint256', type: 'uint256' },
      { name: 'forkThresholdBPS_', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_setForkParams',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newForkPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_setForkPeriod',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newForkThresholdBPS', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_setForkThresholdBPS',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
      },
    ],
    name: '_setLastMinuteWindowInBlocks',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newMaxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
    ],
    name: '_setMaxQuorumVotesBPS',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newMinQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
    ],
    name: '_setMinQuorumVotesBPS',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
      },
    ],
    name: '_setObjectionPeriodDurationInBlocks',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newPendingAdmin', internalType: 'address', type: 'address' },
    ],
    name: '_setPendingAdmin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newPendingVetoer', internalType: 'address', type: 'address' },
    ],
    name: '_setPendingVetoer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newProposalThresholdBPS',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: '_setProposalThresholdBPS',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
      },
    ],
    name: '_setProposalUpdatablePeriodInBlocks',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newQuorumCoefficient', internalType: 'uint32', type: 'uint32' },
    ],
    name: '_setQuorumCoefficient',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newTimelock', internalType: 'address', type: 'address' },
      { name: 'newTimelockV1', internalType: 'address', type: 'address' },
      { name: 'newAdmin', internalType: 'address', type: 'address' },
    ],
    name: '_setTimelocksAndAdmin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: '_setVoteSnapshotBlockSwitchProposalId',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newVotingDelay', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_setVotingDelay',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newVotingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_setVotingPeriod',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: '_withdraw',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'adjustedTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'sig', internalType: 'bytes', type: 'bytes' }],
    name: 'cancelSig',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castRefundableVote',
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
    name: 'castRefundableVoteWithReason',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'castVoteBySig',
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
    name: 'castVoteWithReason',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
      {
        name: 'adjustedTotalSupply_',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'params',
        internalType: 'struct NounsDAOStorageV3.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    name: 'dynamicQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'erc20TokensToIncludeInFork',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'escrowToFork',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'executeFork',
    outputs: [
      { name: 'forkTreasury', internalType: 'address', type: 'address' },
      { name: 'forkToken', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'executeOnTimelockV1',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'forkDAODeployer',
    outputs: [
      { name: '', internalType: 'contract IForkDAODeployer', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'forkEndTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'forkEscrow',
    outputs: [
      {
        name: '',
        internalType: 'contract INounsDAOForkEscrow',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'forkPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'forkThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'forkThresholdBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getActions',
    outputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'blockNumber_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDynamicQuorumParamsAt',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOStorageV3.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getReceipt',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOStorageV3.Receipt',
        type: 'tuple',
        components: [
          { name: 'hasVoted', internalType: 'bool', type: 'bool' },
          { name: 'support', internalType: 'uint8', type: 'uint8' },
          { name: 'votes', internalType: 'uint96', type: 'uint96' },
        ],
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'timelock_', internalType: 'address', type: 'address' },
      { name: 'nouns_', internalType: 'address', type: 'address' },
      { name: 'forkEscrow_', internalType: 'address', type: 'address' },
      { name: 'forkDAODeployer_', internalType: 'address', type: 'address' },
      { name: 'vetoer_', internalType: 'address', type: 'address' },
      {
        name: 'daoParams_',
        internalType: 'struct NounsDAOStorageV3.NounsDAOParams',
        type: 'tuple',
        components: [
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          {
            name: 'proposalThresholdBPS',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lastMinuteWindowInBlocks',
            internalType: 'uint32',
            type: 'uint32',
          },
          {
            name: 'objectionPeriodDurationInBlocks',
            internalType: 'uint32',
            type: 'uint32',
          },
          {
            name: 'proposalUpdatablePeriodInBlocks',
            internalType: 'uint32',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'dynamicQuorumParams_',
        internalType: 'struct NounsDAOStorageV3.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'joinFork',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lastMinuteWindowInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'latestProposalIds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'minQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nouns',
    outputs: [
      { name: '', internalType: 'contract NounsTokenLike', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'numTokensInForkEscrow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'objectionPeriodDurationInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pendingVetoer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposalCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'proposalMaxOperations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposalThresholdBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposalUpdatablePeriodInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposals',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOStorageV2.ProposalCondensed',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          {
            name: 'proposalThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'quorumVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'eta', internalType: 'uint256', type: 'uint256' },
          { name: 'startBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'canceled', internalType: 'bool', type: 'bool' },
          { name: 'vetoed', internalType: 'bool', type: 'bool' },
          { name: 'executed', internalType: 'bool', type: 'bool' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalsV3',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOStorageV3.ProposalCondensed',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          {
            name: 'proposalThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'quorumVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'eta', internalType: 'uint256', type: 'uint256' },
          { name: 'startBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'canceled', internalType: 'bool', type: 'bool' },
          { name: 'vetoed', internalType: 'bool', type: 'bool' },
          { name: 'executed', internalType: 'bool', type: 'bool' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'signers', internalType: 'address[]', type: 'address[]' },
          {
            name: 'updatePeriodEndBlock',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'objectionPeriodEndBlock',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'executeOnTimelockV1', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOStorageV3.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          {
            name: 'expirationTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'proposeBySigs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'proposeOnTimelockV1',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'queue',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'quorumParamsCheckpoints',
    outputs: [
      {
        name: '',
        internalType:
          'struct NounsDAOStorageV3.DynamicQuorumParamsCheckpoint[]',
        type: 'tuple[]',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          {
            name: 'params',
            internalType: 'struct NounsDAOStorageV3.DynamicQuorumParams',
            type: 'tuple',
            components: [
              {
                name: 'minQuorumVotesBPS',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'maxQuorumVotesBPS',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'quorumCoefficient',
                internalType: 'uint32',
                type: 'uint32',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumParamsCheckpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOStorageV3.DynamicQuorumParamsCheckpoint',
        type: 'tuple',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          {
            name: 'params',
            internalType: 'struct NounsDAOStorageV3.DynamicQuorumParams',
            type: 'tuple',
            components: [
              {
                name: 'minQuorumVotesBPS',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'maxQuorumVotesBPS',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'quorumCoefficient',
                internalType: 'uint32',
                type: 'uint32',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'quorumVotesBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      {
        name: '',
        internalType: 'enum NounsDAOStorageV3.ProposalState',
        type: 'uint8',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'timelock',
    outputs: [
      { name: '', internalType: 'contract INounsDAOExecutor', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'timelockV1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposal',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOStorageV3.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          {
            name: 'expirationTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalBySigs',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalDescription',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalTransactions',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'veto',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'vetoer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'voteSnapshotBlockSwitchProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'withdrawDAONounsFromEscrowToTreasury',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'withdrawFromForkEscrow',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export const nounsDaoAddress = {
  1: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export const nounsDaoConfig = {
  address: nounsDaoAddress,
  abi: nounsDaoABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsData
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export const nounsDataABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'nounsToken_', internalType: 'address', type: 'address' },
      { name: 'nounsDao_', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'AmountExceedsBalance' },
  {
    type: 'error',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'FailedWithdrawingETH',
  },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidSupportValue' },
  { type: 'error', inputs: [], name: 'MustBeNounerOrPaySufficientFee' },
  { type: 'error', inputs: [], name: 'SlugAlreadyUsed' },
  { type: 'error', inputs: [], name: 'SlugDoesNotExist' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'CandidateFeedbackSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldCreateCandidateCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newCreateCandidateCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CreateCandidateCostSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ETHWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldFeeRecipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newFeeRecipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'FeeRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'FeedbackSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCandidateCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'proposalIdToUpdate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'encodedProposalHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ProposalCandidateCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'proposalIdToUpdate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'encodedProposalHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCandidateUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'sig', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'expirationTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'slug', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'proposalIdToUpdate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'encodedPropHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'sigDigest',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'SignatureAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldUpdateCandidateCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newUpdateCandidateCost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UpdateCandidateCostSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
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
      {
        name: 'createCandidateCost_',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'updateCandidateCost_',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'feeRecipient_',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nounsDao',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nounsToken',
    outputs: [
      { name: '', internalType: 'contract NounsTokenLike', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
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
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
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
    inputs: [
      {
        name: 'newCreateCandidateCost',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setCreateCandidateCost',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newFeeRecipient',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'setFeeRecipient',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newUpdateCandidateCost',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
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
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
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
export const nounsDataAddress = {
  1: '0xf790A5f59678dd733fb3De93493A91f472ca1365',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export const nounsDataConfig = {
  address: nounsDataAddress,
  abi: nounsDataABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsDescriptor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export const nounsDescriptorABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_art', internalType: 'contract INounsArt', type: 'address' },
      {
        name: '_renderer',
        internalType: 'contract ISVGRenderer',
        type: 'address',
      },
    ],
  },
  { type: 'error', inputs: [], name: 'BadPaletteLength' },
  { type: 'error', inputs: [], name: 'EmptyPalette' },
  { type: 'error', inputs: [], name: 'IndexNotFound' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'art',
        internalType: 'contract INounsArt',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ArtUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'baseURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'BaseURIUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'DataURIToggled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'PartsLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'renderer',
        internalType: 'contract ISVGRenderer',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RendererUpdated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'accessories',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'accessoryCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addAccessories',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addAccessoriesFromPointer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_background', internalType: 'string', type: 'string' }],
    name: 'addBackground',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addBodies',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addBodiesFromPointer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addGlasses',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addGlassesFromPointer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'encodedCompressed', internalType: 'bytes', type: 'bytes' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addHeads',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pointer', internalType: 'address', type: 'address' },
      { name: 'decompressedLength', internalType: 'uint80', type: 'uint80' },
      { name: 'imageCount', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addHeadsFromPointer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_backgrounds', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'addManyBackgrounds',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'arePartsLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'art',
    outputs: [
      { name: '', internalType: 'contract INounsArt', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'backgroundCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'backgrounds',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'baseURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'bodies',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'bodyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'generateSVGImage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'genericDataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'getPartsForSeed',
    outputs: [
      {
        name: '',
        internalType: 'struct ISVGRenderer.Part[]',
        type: 'tuple[]',
        components: [
          { name: 'image', internalType: 'bytes', type: 'bytes' },
          { name: 'palette', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'glasses',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'glassesCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'headCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'heads',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isDataURIEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'lockParts',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint8', type: 'uint8' }],
    name: 'palettes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'renderer',
    outputs: [
      { name: '', internalType: 'contract ISVGRenderer', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_art', internalType: 'contract INounsArt', type: 'address' },
    ],
    name: 'setArt',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'descriptor', internalType: 'address', type: 'address' }],
    name: 'setArtDescriptor',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'inflator', internalType: 'contract IInflator', type: 'address' },
    ],
    name: 'setArtInflator',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_baseURI', internalType: 'string', type: 'string' }],
    name: 'setBaseURI',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'paletteIndex', internalType: 'uint8', type: 'uint8' },
      { name: 'palette', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setPalette',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'paletteIndex', internalType: 'uint8', type: 'uint8' },
      { name: 'pointer', internalType: 'address', type: 'address' },
    ],
    name: 'setPalettePointer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: '_renderer',
        internalType: 'contract ISVGRenderer',
        type: 'address',
      },
    ],
    name: 'setRenderer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'toggleDataURIEnabled',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export const nounsDescriptorAddress = {
  1: '0x6229c811D04501523C6058bfAAc29c91bb586268',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export const nounsDescriptorConfig = {
  address: nounsDescriptorAddress,
  abi: nounsDescriptorABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsExecutor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export const nounsExecutorABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'signature',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'CancelTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'erc20Token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC20Sent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ETHSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'signature',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ExecuteTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NewAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'NewDelay',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newPendingAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NewPendingAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'signature',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'QueueTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MAXIMUM_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MINIMUM_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptAdmin',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'eta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelTransaction',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'delay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'eta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'executeTransaction',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'admin_', internalType: 'address', type: 'address' },
      { name: 'delay_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pendingAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'eta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'queueTransaction',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'queuedTransactions',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'erc20Token', internalType: 'address', type: 'address' },
      { name: 'tokensToSend', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendERC20',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address payable', type: 'address' },
      { name: 'ethToSend', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendETH',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'delay_', internalType: 'uint256', type: 'uint256' }],
    name: 'setDelay',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pendingAdmin_', internalType: 'address', type: 'address' },
    ],
    name: 'setPendingAdmin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
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
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export const nounsExecutorAddress = {
  1: '0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export const nounsExecutorConfig = {
  address: nounsExecutorAddress,
  abi: nounsExecutorABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export const nounsTokenABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_noundersDAO', internalType: 'address', type: 'address' },
      { name: '_minter', internalType: 'address', type: 'address' },
      {
        name: '_descriptor',
        internalType: 'contract INounsDescriptor',
        type: 'address',
      },
      {
        name: '_seeder',
        internalType: 'contract INounsSeeder',
        type: 'address',
      },
      {
        name: '_proxyRegistry',
        internalType: 'contract IProxyRegistry',
        type: 'address',
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'DescriptorLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'descriptor',
        internalType: 'contract INounsDescriptor',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'DescriptorUpdated',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'MinterLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MinterUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'NounBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'seed',
        internalType: 'struct INounsSeeder.Seed',
        type: 'tuple',
        components: [
          { name: 'background', internalType: 'uint48', type: 'uint48' },
          { name: 'body', internalType: 'uint48', type: 'uint48' },
          { name: 'accessory', internalType: 'uint48', type: 'uint48' },
          { name: 'head', internalType: 'uint48', type: 'uint48' },
          { name: 'glasses', internalType: 'uint48', type: 'uint48' },
        ],
        indexed: false,
      },
    ],
    name: 'NounCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'noundersDAO',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NoundersDAOUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'SeederLocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'seeder',
        internalType: 'contract INounsSeeder',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SeederUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DELEGATION_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'nounId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
      { name: 'votes', internalType: 'uint96', type: 'uint96' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'dataURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'delegator', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'descriptor',
    outputs: [
      { name: '', internalType: 'contract INounsDescriptor', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getCurrentVotes',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPriorVotes',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isDescriptorLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isMinterLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isSeederLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'lockDescriptor',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'lockMinter',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'lockSeeder',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'minter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'noundersDAO',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxyRegistry',
    outputs: [
      { name: '', internalType: 'contract IProxyRegistry', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'seeder',
    outputs: [
      { name: '', internalType: 'contract INounsSeeder', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'seeds',
    outputs: [
      { name: 'background', internalType: 'uint48', type: 'uint48' },
      { name: 'body', internalType: 'uint48', type: 'uint48' },
      { name: 'accessory', internalType: 'uint48', type: 'uint48' },
      { name: 'head', internalType: 'uint48', type: 'uint48' },
      { name: 'glasses', internalType: 'uint48', type: 'uint48' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newContractURIHash', internalType: 'string', type: 'string' },
    ],
    name: 'setContractURIHash',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: '_descriptor',
        internalType: 'contract INounsDescriptor',
        type: 'address',
      },
    ],
    name: 'setDescriptor',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_minter', internalType: 'address', type: 'address' }],
    name: 'setMinter',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_noundersDAO', internalType: 'address', type: 'address' },
    ],
    name: 'setNoundersDAO',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: '_seeder',
        internalType: 'contract INounsSeeder',
        type: 'address',
      },
    ],
    name: 'setSeeder',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
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
    inputs: [{ name: 'delegator', internalType: 'address', type: 'address' }],
    name: 'votesToDelegate',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export const nounsTokenAddress = {
  1: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export const nounsTokenConfig = {
  address: nounsTokenAddress,
  abi: nounsTokenABI,
} as const

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
      {
        name: '_editionMetadataRenderer',
        internalType: 'contract EditionMetadataRenderer',
        type: 'address',
      },
      {
        name: '_dropMetadataRenderer',
        internalType: 'contract DropMetadataRenderer',
        type: 'address',
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'editionContractAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'editionSize',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CreatedDrop',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'contractName',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'contractVersion',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
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
      {
        name: 'fundsRecipient',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'setupCalls', internalType: 'bytes[]', type: 'bytes[]' },
      {
        name: 'metadataRenderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
      },
      { name: 'metadataInitializer', internalType: 'bytes', type: 'bytes' },
      { name: 'createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'createAndConfigureDrop',
    outputs: [
      {
        name: 'newDropAddress',
        internalType: 'address payable',
        type: 'address',
      },
    ],
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
      {
        name: 'fundsRecipient',
        internalType: 'address payable',
        type: 'address',
      },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          {
            name: 'maxSalePurchasePerAddress',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          {
            name: 'presaleMerkleRoot',
            internalType: 'bytes32',
            type: 'bytes32',
          },
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
      {
        name: 'fundsRecipient',
        internalType: 'address payable',
        type: 'address',
      },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          {
            name: 'maxSalePurchasePerAddress',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          {
            name: 'presaleMerkleRoot',
            internalType: 'bytes32',
            type: 'bytes32',
          },
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
      {
        name: 'fundsRecipient',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          {
            name: 'maxSalePurchasePerAddress',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          {
            name: 'presaleMerkleRoot',
            internalType: 'bytes32',
            type: 'bytes32',
          },
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
      {
        name: 'fundsRecipient',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'defaultAdmin', internalType: 'address', type: 'address' },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          {
            name: 'maxSalePurchasePerAddress',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          {
            name: 'presaleMerkleRoot',
            internalType: 'bytes32',
            type: 'bytes32',
          },
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
    outputs: [
      {
        name: '',
        internalType: 'contract DropMetadataRenderer',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'editionMetadataRenderer',
    outputs: [
      {
        name: '',
        internalType: 'contract EditionMetadataRenderer',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
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
      {
        name: 'fundsRecipient',
        internalType: 'address payable',
        type: 'address',
      },
      {
        name: 'saleConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
          { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
          {
            name: 'maxSalePurchasePerAddress',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          {
            name: 'presaleMerkleRoot',
            internalType: 'bytes32',
            type: 'bytes32',
          },
        ],
      },
      {
        name: 'metadataRenderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
      },
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
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
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
export const zoraNftCreatorConfig = {
  address: zoraNftCreatorAddress,
  abi: zoraNftCreatorABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function getNounsDao(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDaoAddress
  },
) {
  return getContract({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function readNounsDao<
  TAbi extends readonly unknown[] = typeof nounsDaoABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDaoAddress
  },
) {
  return readContract({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function writeNounsDao<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof nounsDaoABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsDaoAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof nounsDaoABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsDaoAddress
      }),
) {
  return writeContract({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof nounsDaoABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function prepareWriteNounsDao<
  TAbi extends readonly unknown[] = typeof nounsDaoABI,
  TFunctionName extends string = string,
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDaoAddress },
) {
  return prepareWriteContract({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function watchNounsDaoEvent<
  TAbi extends readonly unknown[] = typeof nounsDaoABI,
  TEventName extends string = string,
>(
  config: Omit<
    WatchContractEventConfig<TAbi, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDaoAddress },
  callback: WatchContractEventCallback<TAbi, TEventName>,
) {
  return watchContractEvent(
    {
      abi: nounsDaoABI,
      address: nounsDaoAddress[1],
      ...config,
    } as WatchContractEventConfig<TAbi, TEventName>,
    callback,
  )
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function getNounsData(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDataAddress
  },
) {
  return getContract({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function readNounsData<
  TAbi extends readonly unknown[] = typeof nounsDataABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDataAddress
  },
) {
  return readContract({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function writeNounsData<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof nounsDataABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsDataAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof nounsDataABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsDataAddress
      }),
) {
  return writeContract({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof nounsDataABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function prepareWriteNounsData<
  TAbi extends readonly unknown[] = typeof nounsDataABI,
  TFunctionName extends string = string,
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDataAddress },
) {
  return prepareWriteContract({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function watchNounsDataEvent<
  TAbi extends readonly unknown[] = typeof nounsDataABI,
  TEventName extends string = string,
>(
  config: Omit<
    WatchContractEventConfig<TAbi, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDataAddress },
  callback: WatchContractEventCallback<TAbi, TEventName>,
) {
  return watchContractEvent(
    {
      abi: nounsDataABI,
      address: nounsDataAddress[1],
      ...config,
    } as WatchContractEventConfig<TAbi, TEventName>,
    callback,
  )
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function getNounsDescriptor(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDescriptorAddress
  },
) {
  return getContract({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function readNounsDescriptor<
  TAbi extends readonly unknown[] = typeof nounsDescriptorABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsDescriptorAddress
  },
) {
  return readContract({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function writeNounsDescriptor<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof nounsDescriptorABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsDescriptorAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof nounsDescriptorABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsDescriptorAddress
      }),
) {
  return writeContract({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof nounsDescriptorABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function prepareWriteNounsDescriptor<
  TAbi extends readonly unknown[] = typeof nounsDescriptorABI,
  TFunctionName extends string = string,
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDescriptorAddress },
) {
  return prepareWriteContract({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function watchNounsDescriptorEvent<
  TAbi extends readonly unknown[] = typeof nounsDescriptorABI,
  TEventName extends string = string,
>(
  config: Omit<
    WatchContractEventConfig<TAbi, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDescriptorAddress },
  callback: WatchContractEventCallback<TAbi, TEventName>,
) {
  return watchContractEvent(
    {
      abi: nounsDescriptorABI,
      address: nounsDescriptorAddress[1],
      ...config,
    } as WatchContractEventConfig<TAbi, TEventName>,
    callback,
  )
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function getNounsExecutor(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsExecutorAddress
  },
) {
  return getContract({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function readNounsExecutor<
  TAbi extends readonly unknown[] = typeof nounsExecutorABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsExecutorAddress
  },
) {
  return readContract({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function writeNounsExecutor<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof nounsExecutorABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsExecutorAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof nounsExecutorABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsExecutorAddress
      }),
) {
  return writeContract({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof nounsExecutorABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function prepareWriteNounsExecutor<
  TAbi extends readonly unknown[] = typeof nounsExecutorABI,
  TFunctionName extends string = string,
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsExecutorAddress },
) {
  return prepareWriteContract({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function watchNounsExecutorEvent<
  TAbi extends readonly unknown[] = typeof nounsExecutorABI,
  TEventName extends string = string,
>(
  config: Omit<
    WatchContractEventConfig<TAbi, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsExecutorAddress },
  callback: WatchContractEventCallback<TAbi, TEventName>,
) {
  return watchContractEvent(
    {
      abi: nounsExecutorABI,
      address: nounsExecutorAddress[1],
      ...config,
    } as WatchContractEventConfig<TAbi, TEventName>,
    callback,
  )
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function getNounsToken(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsTokenAddress
  },
) {
  return getContract({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function readNounsToken<
  TAbi extends readonly unknown[] = typeof nounsTokenABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof nounsTokenAddress
  },
) {
  return readContract({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function writeNounsToken<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof nounsTokenABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsTokenAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof nounsTokenABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof nounsTokenAddress
      }),
) {
  return writeContract({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof nounsTokenABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function prepareWriteNounsToken<
  TAbi extends readonly unknown[] = typeof nounsTokenABI,
  TFunctionName extends string = string,
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsTokenAddress },
) {
  return prepareWriteContract({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function watchNounsTokenEvent<
  TAbi extends readonly unknown[] = typeof nounsTokenABI,
  TEventName extends string = string,
>(
  config: Omit<
    WatchContractEventConfig<TAbi, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsTokenAddress },
  callback: WatchContractEventCallback<TAbi, TEventName>,
) {
  return watchContractEvent(
    {
      abi: nounsTokenABI,
      address: nounsTokenAddress[1],
      ...config,
    } as WatchContractEventConfig<TAbi, TEventName>,
    callback,
  )
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function getZoraNftCreator(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  },
) {
  return getContract({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function readZoraNftCreator<
  TAbi extends readonly unknown[] = typeof zoraNftCreatorABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof zoraNftCreatorAddress
  },
) {
  return readContract({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function writeZoraNftCreator<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof zoraNftCreatorABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof zoraNftCreatorAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof zoraNftCreatorABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared'
          ? TChainId
          : keyof typeof zoraNftCreatorAddress
      }),
) {
  return writeContract({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as unknown as WriteContractArgs<typeof zoraNftCreatorABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function prepareWriteZoraNftCreator<
  TAbi extends readonly unknown[] = typeof zoraNftCreatorABI,
  TFunctionName extends string = string,
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoraNftCreatorAddress },
) {
  return prepareWriteContract({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function watchZoraNftCreatorEvent<
  TAbi extends readonly unknown[] = typeof zoraNftCreatorABI,
  TEventName extends string = string,
>(
  config: Omit<
    WatchContractEventConfig<TAbi, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoraNftCreatorAddress },
  callback: WatchContractEventCallback<TAbi, TEventName>,
) {
  return watchContractEvent(
    {
      abi: zoraNftCreatorABI,
      address: zoraNftCreatorAddress[1],
      ...config,
    } as WatchContractEventConfig<TAbi, TEventName>,
    callback,
  )
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"MAX_PROPOSAL_THRESHOLD_BPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMaxProposalThresholdBps<
  TFunctionName extends 'MAX_PROPOSAL_THRESHOLD_BPS',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'MAX_PROPOSAL_THRESHOLD_BPS',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"MAX_VOTING_DELAY"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMaxVotingDelay<
  TFunctionName extends 'MAX_VOTING_DELAY',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'MAX_VOTING_DELAY',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"MAX_VOTING_PERIOD"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMaxVotingPeriod<
  TFunctionName extends 'MAX_VOTING_PERIOD',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'MAX_VOTING_PERIOD',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"MIN_PROPOSAL_THRESHOLD_BPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMinProposalThresholdBps<
  TFunctionName extends 'MIN_PROPOSAL_THRESHOLD_BPS',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'MIN_PROPOSAL_THRESHOLD_BPS',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"MIN_VOTING_DELAY"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMinVotingDelay<
  TFunctionName extends 'MIN_VOTING_DELAY',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'MIN_VOTING_DELAY',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"MIN_VOTING_PERIOD"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMinVotingPeriod<
  TFunctionName extends 'MIN_VOTING_PERIOD',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'MIN_VOTING_PERIOD',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"adjustedTotalSupply"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoAdjustedTotalSupply<
  TFunctionName extends 'adjustedTotalSupply',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'adjustedTotalSupply',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"dynamicQuorumVotes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoDynamicQuorumVotes<
  TFunctionName extends 'dynamicQuorumVotes',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'dynamicQuorumVotes',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"erc20TokensToIncludeInFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoErc20TokensToIncludeInFork<
  TFunctionName extends 'erc20TokensToIncludeInFork',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'erc20TokensToIncludeInFork',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"forkDAODeployer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkDaoDeployer<
  TFunctionName extends 'forkDAODeployer',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'forkDAODeployer',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"forkEndTimestamp"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkEndTimestamp<
  TFunctionName extends 'forkEndTimestamp',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'forkEndTimestamp',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"forkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkEscrow<
  TFunctionName extends 'forkEscrow',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'forkEscrow',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"forkPeriod"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkPeriod<
  TFunctionName extends 'forkPeriod',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'forkPeriod',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"forkThreshold"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkThreshold<
  TFunctionName extends 'forkThreshold',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'forkThreshold',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"forkThresholdBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkThresholdBps<
  TFunctionName extends 'forkThresholdBPS',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'forkThresholdBPS',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"getActions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoGetActions<
  TFunctionName extends 'getActions',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'getActions',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"getDynamicQuorumParamsAt"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoGetDynamicQuorumParamsAt<
  TFunctionName extends 'getDynamicQuorumParamsAt',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'getDynamicQuorumParamsAt',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"getReceipt"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoGetReceipt<
  TFunctionName extends 'getReceipt',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'getReceipt',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"lastMinuteWindowInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoLastMinuteWindowInBlocks<
  TFunctionName extends 'lastMinuteWindowInBlocks',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'lastMinuteWindowInBlocks',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"latestProposalIds"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoLatestProposalIds<
  TFunctionName extends 'latestProposalIds',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'latestProposalIds',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"maxQuorumVotes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMaxQuorumVotes<
  TFunctionName extends 'maxQuorumVotes',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'maxQuorumVotes',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"minQuorumVotes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMinQuorumVotes<
  TFunctionName extends 'minQuorumVotes',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'minQuorumVotes',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"nouns"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNouns<
  TFunctionName extends 'nouns',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'nouns',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"numTokensInForkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNumTokensInForkEscrow<
  TFunctionName extends 'numTokensInForkEscrow',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'numTokensInForkEscrow',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"objectionPeriodDurationInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoObjectionPeriodDurationInBlocks<
  TFunctionName extends 'objectionPeriodDurationInBlocks',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'objectionPeriodDurationInBlocks',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"pendingVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoPendingVetoer<
  TFunctionName extends 'pendingVetoer',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'pendingVetoer',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposalCount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalCount<
  TFunctionName extends 'proposalCount',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposalCount',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposalMaxOperations"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalMaxOperations<
  TFunctionName extends 'proposalMaxOperations',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposalMaxOperations',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposalThreshold"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalThreshold<
  TFunctionName extends 'proposalThreshold',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposalThreshold',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposalThresholdBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalThresholdBps<
  TFunctionName extends 'proposalThresholdBPS',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposalThresholdBPS',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposalUpdatablePeriodInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalUpdatablePeriodInBlocks<
  TFunctionName extends 'proposalUpdatablePeriodInBlocks',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposalUpdatablePeriodInBlocks',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposals"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposals<
  TFunctionName extends 'proposals',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposals',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposalsV3"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalsV3<
  TFunctionName extends 'proposalsV3',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposalsV3',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"quorumParamsCheckpoints"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoQuorumParamsCheckpoints<
  TFunctionName extends 'quorumParamsCheckpoints',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'quorumParamsCheckpoints',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"quorumVotes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoQuorumVotes<
  TFunctionName extends 'quorumVotes',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'quorumVotes',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"quorumVotesBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoQuorumVotesBps<
  TFunctionName extends 'quorumVotesBPS',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'quorumVotesBPS',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"state"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoState<
  TFunctionName extends 'state',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'state',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"timelock"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoTimelock<
  TFunctionName extends 'timelock',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'timelock',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"timelockV1"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoTimelockV1<
  TFunctionName extends 'timelockV1',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'timelockV1',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"vetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVetoer<
  TFunctionName extends 'vetoer',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'vetoer',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"voteSnapshotBlockSwitchProposalId"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVoteSnapshotBlockSwitchProposalId<
  TFunctionName extends 'voteSnapshotBlockSwitchProposalId',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'voteSnapshotBlockSwitchProposalId',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"votingDelay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVotingDelay<
  TFunctionName extends 'votingDelay',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'votingDelay',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"votingPeriod"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVotingPeriod<
  TFunctionName extends 'votingPeriod',
  TSelectData = ReadContractResult<typeof nounsDaoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'votingPeriod',
    ...config,
  } as UseContractReadConfig<typeof nounsDaoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof nounsDaoABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, TFunctionName, TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_acceptAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoAcceptAdmin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_acceptAdmin'
        >['request']['abi'],
        '_acceptAdmin',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_acceptAdmin'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_acceptAdmin', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_acceptAdmin'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_acceptAdmin', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_acceptAdmin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_acceptVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoAcceptVetoer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_acceptVetoer'
        >['request']['abi'],
        '_acceptVetoer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_acceptVetoer'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_acceptVetoer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_acceptVetoer'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_acceptVetoer', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_acceptVetoer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_burnVetoPower"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoBurnVetoPower<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_burnVetoPower'
        >['request']['abi'],
        '_burnVetoPower',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_burnVetoPower'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_burnVetoPower', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_burnVetoPower'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_burnVetoPower', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_burnVetoPower',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setDynamicQuorumParams"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetDynamicQuorumParams<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setDynamicQuorumParams'
        >['request']['abi'],
        '_setDynamicQuorumParams',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setDynamicQuorumParams'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setDynamicQuorumParams',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setDynamicQuorumParams'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setDynamicQuorumParams', TMode>(
    {
      abi: nounsDaoABI,
      address: nounsDaoAddress[1],
      functionName: '_setDynamicQuorumParams',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setErc20TokensToIncludeInFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetErc20TokensToIncludeInFork<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setErc20TokensToIncludeInFork'
        >['request']['abi'],
        '_setErc20TokensToIncludeInFork',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setErc20TokensToIncludeInFork'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setErc20TokensToIncludeInFork',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setErc20TokensToIncludeInFork'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    '_setErc20TokensToIncludeInFork',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setErc20TokensToIncludeInFork',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkDAODeployer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetForkDaoDeployer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setForkDAODeployer'
        >['request']['abi'],
        '_setForkDAODeployer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setForkDAODeployer'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setForkDAODeployer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setForkDAODeployer'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setForkDAODeployer', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkDAODeployer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetForkEscrow<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setForkEscrow'
        >['request']['abi'],
        '_setForkEscrow',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setForkEscrow'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setForkEscrow', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setForkEscrow'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setForkEscrow', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkEscrow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkParams"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetForkParams<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setForkParams'
        >['request']['abi'],
        '_setForkParams',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setForkParams'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setForkParams', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setForkParams'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setForkParams', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkParams',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkPeriod"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetForkPeriod<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setForkPeriod'
        >['request']['abi'],
        '_setForkPeriod',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setForkPeriod'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setForkPeriod', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setForkPeriod'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setForkPeriod', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkPeriod',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkThresholdBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetForkThresholdBps<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setForkThresholdBPS'
        >['request']['abi'],
        '_setForkThresholdBPS',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setForkThresholdBPS'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setForkThresholdBPS',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setForkThresholdBPS'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setForkThresholdBPS', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkThresholdBPS',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setLastMinuteWindowInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetLastMinuteWindowInBlocks<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setLastMinuteWindowInBlocks'
        >['request']['abi'],
        '_setLastMinuteWindowInBlocks',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setLastMinuteWindowInBlocks'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setLastMinuteWindowInBlocks',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setLastMinuteWindowInBlocks'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    '_setLastMinuteWindowInBlocks',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setLastMinuteWindowInBlocks',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setMaxQuorumVotesBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetMaxQuorumVotesBps<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setMaxQuorumVotesBPS'
        >['request']['abi'],
        '_setMaxQuorumVotesBPS',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setMaxQuorumVotesBPS'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setMaxQuorumVotesBPS',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setMaxQuorumVotesBPS'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setMaxQuorumVotesBPS', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setMaxQuorumVotesBPS',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setMinQuorumVotesBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetMinQuorumVotesBps<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setMinQuorumVotesBPS'
        >['request']['abi'],
        '_setMinQuorumVotesBPS',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setMinQuorumVotesBPS'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setMinQuorumVotesBPS',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setMinQuorumVotesBPS'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setMinQuorumVotesBPS', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setMinQuorumVotesBPS',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setObjectionPeriodDurationInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetObjectionPeriodDurationInBlocks<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setObjectionPeriodDurationInBlocks'
        >['request']['abi'],
        '_setObjectionPeriodDurationInBlocks',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setObjectionPeriodDurationInBlocks'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setObjectionPeriodDurationInBlocks',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setObjectionPeriodDurationInBlocks'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    '_setObjectionPeriodDurationInBlocks',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setObjectionPeriodDurationInBlocks',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setPendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetPendingAdmin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setPendingAdmin'
        >['request']['abi'],
        '_setPendingAdmin',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setPendingAdmin'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setPendingAdmin', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setPendingAdmin'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setPendingAdmin', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setPendingAdmin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setPendingVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetPendingVetoer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setPendingVetoer'
        >['request']['abi'],
        '_setPendingVetoer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setPendingVetoer'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setPendingVetoer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setPendingVetoer'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setPendingVetoer', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setPendingVetoer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setProposalThresholdBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetProposalThresholdBps<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setProposalThresholdBPS'
        >['request']['abi'],
        '_setProposalThresholdBPS',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setProposalThresholdBPS'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setProposalThresholdBPS',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setProposalThresholdBPS'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    '_setProposalThresholdBPS',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setProposalThresholdBPS',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setProposalUpdatablePeriodInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetProposalUpdatablePeriodInBlocks<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setProposalUpdatablePeriodInBlocks'
        >['request']['abi'],
        '_setProposalUpdatablePeriodInBlocks',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setProposalUpdatablePeriodInBlocks'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setProposalUpdatablePeriodInBlocks',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setProposalUpdatablePeriodInBlocks'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    '_setProposalUpdatablePeriodInBlocks',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setProposalUpdatablePeriodInBlocks',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setQuorumCoefficient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetQuorumCoefficient<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setQuorumCoefficient'
        >['request']['abi'],
        '_setQuorumCoefficient',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setQuorumCoefficient'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setQuorumCoefficient',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setQuorumCoefficient'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setQuorumCoefficient', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setQuorumCoefficient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setTimelocksAndAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetTimelocksAndAdmin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setTimelocksAndAdmin'
        >['request']['abi'],
        '_setTimelocksAndAdmin',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setTimelocksAndAdmin'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setTimelocksAndAdmin',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setTimelocksAndAdmin'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setTimelocksAndAdmin', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setTimelocksAndAdmin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setVoteSnapshotBlockSwitchProposalId"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetVoteSnapshotBlockSwitchProposalId<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setVoteSnapshotBlockSwitchProposalId'
        >['request']['abi'],
        '_setVoteSnapshotBlockSwitchProposalId',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setVoteSnapshotBlockSwitchProposalId'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        '_setVoteSnapshotBlockSwitchProposalId',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setVoteSnapshotBlockSwitchProposalId'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    '_setVoteSnapshotBlockSwitchProposalId',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setVoteSnapshotBlockSwitchProposalId',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setVotingDelay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetVotingDelay<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setVotingDelay'
        >['request']['abi'],
        '_setVotingDelay',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setVotingDelay'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setVotingDelay', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setVotingDelay'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setVotingDelay', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setVotingDelay',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setVotingPeriod"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSetVotingPeriod<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_setVotingPeriod'
        >['request']['abi'],
        '_setVotingPeriod',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: '_setVotingPeriod'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, '_setVotingPeriod', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_setVotingPeriod'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_setVotingPeriod', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setVotingPeriod',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWithdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          '_withdraw'
        >['request']['abi'],
        '_withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: '_withdraw' }
    : UseContractWriteConfig<typeof nounsDaoABI, '_withdraw', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: '_withdraw'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, '_withdraw', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"cancel"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCancel<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'cancel'
        >['request']['abi'],
        'cancel',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'cancel' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'cancel', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'cancel'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'cancel', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'cancel',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"cancelSig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCancelSig<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'cancelSig'
        >['request']['abi'],
        'cancelSig',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'cancelSig' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'cancelSig', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'cancelSig'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'cancelSig', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'cancelSig',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castRefundableVote"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCastRefundableVote<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'castRefundableVote'
        >['request']['abi'],
        'castRefundableVote',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'castRefundableVote'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'castRefundableVote',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'castRefundableVote'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'castRefundableVote', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castRefundableVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castRefundableVoteWithReason"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCastRefundableVoteWithReason<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'castRefundableVoteWithReason'
        >['request']['abi'],
        'castRefundableVoteWithReason',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'castRefundableVoteWithReason'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'castRefundableVoteWithReason',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'castRefundableVoteWithReason'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    'castRefundableVoteWithReason',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castRefundableVoteWithReason',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castVote"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCastVote<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'castVote'
        >['request']['abi'],
        'castVote',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'castVote' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'castVote', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'castVote'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'castVote', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castVote',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castVoteBySig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCastVoteBySig<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'castVoteBySig'
        >['request']['abi'],
        'castVoteBySig',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'castVoteBySig'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, 'castVoteBySig', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'castVoteBySig'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'castVoteBySig', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castVoteBySig',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castVoteWithReason"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoCastVoteWithReason<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'castVoteWithReason'
        >['request']['abi'],
        'castVoteWithReason',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'castVoteWithReason'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'castVoteWithReason',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'castVoteWithReason'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'castVoteWithReason', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castVoteWithReason',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"escrowToFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoEscrowToFork<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'escrowToFork'
        >['request']['abi'],
        'escrowToFork',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'escrowToFork'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, 'escrowToFork', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'escrowToFork'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'escrowToFork', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'escrowToFork',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"execute"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoExecute<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'execute'
        >['request']['abi'],
        'execute',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'execute' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'execute', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'execute'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'execute', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'execute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"executeFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoExecuteFork<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'executeFork'
        >['request']['abi'],
        'executeFork',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'executeFork'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, 'executeFork', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'executeFork'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'executeFork', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'executeFork',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"executeOnTimelockV1"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoExecuteOnTimelockV1<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'executeOnTimelockV1'
        >['request']['abi'],
        'executeOnTimelockV1',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'executeOnTimelockV1'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'executeOnTimelockV1',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'executeOnTimelockV1'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'executeOnTimelockV1', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'executeOnTimelockV1',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'initialize', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"joinFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoJoinFork<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'joinFork'
        >['request']['abi'],
        'joinFork',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'joinFork' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'joinFork', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'joinFork'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'joinFork', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'joinFork',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"propose"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoPropose<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'propose'
        >['request']['abi'],
        'propose',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'propose' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'propose', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'propose'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'propose', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'propose',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposeBySigs"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposeBySigs<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'proposeBySigs'
        >['request']['abi'],
        'proposeBySigs',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'proposeBySigs'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, 'proposeBySigs', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'proposeBySigs'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'proposeBySigs', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposeBySigs',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposeOnTimelockV1"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposeOnTimelockV1<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'proposeOnTimelockV1'
        >['request']['abi'],
        'proposeOnTimelockV1',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'proposeOnTimelockV1'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'proposeOnTimelockV1',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'proposeOnTimelockV1'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'proposeOnTimelockV1', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposeOnTimelockV1',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"queue"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoQueue<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'queue'
        >['request']['abi'],
        'queue',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'queue' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'queue', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'queue'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'queue', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'queue',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposal"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoUpdateProposal<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'updateProposal'
        >['request']['abi'],
        'updateProposal',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateProposal'
      }
    : UseContractWriteConfig<typeof nounsDaoABI, 'updateProposal', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateProposal'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'updateProposal', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposalBySigs"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoUpdateProposalBySigs<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'updateProposalBySigs'
        >['request']['abi'],
        'updateProposalBySigs',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateProposalBySigs'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'updateProposalBySigs',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateProposalBySigs'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'updateProposalBySigs', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposalBySigs',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposalDescription"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoUpdateProposalDescription<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'updateProposalDescription'
        >['request']['abi'],
        'updateProposalDescription',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateProposalDescription'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'updateProposalDescription',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateProposalDescription'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    'updateProposalDescription',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposalDescription',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposalTransactions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoUpdateProposalTransactions<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'updateProposalTransactions'
        >['request']['abi'],
        'updateProposalTransactions',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateProposalTransactions'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'updateProposalTransactions',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateProposalTransactions'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    'updateProposalTransactions',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposalTransactions',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"veto"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVeto<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'veto'
        >['request']['abi'],
        'veto',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'veto' }
    : UseContractWriteConfig<typeof nounsDaoABI, 'veto', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'veto'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'veto', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'veto',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWithdrawDaoNounsFromEscrowIncreasingTotalSupply<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'withdrawDAONounsFromEscrowIncreasingTotalSupply'
        >['request']['abi'],
        'withdrawDAONounsFromEscrowIncreasingTotalSupply',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'withdrawDAONounsFromEscrowIncreasingTotalSupply'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'withdrawDAONounsFromEscrowIncreasingTotalSupply',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawDAONounsFromEscrowIncreasingTotalSupply'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    'withdrawDAONounsFromEscrowIncreasingTotalSupply',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWithdrawDaoNounsFromEscrowToTreasury<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'withdrawDAONounsFromEscrowToTreasury'
        >['request']['abi'],
        'withdrawDAONounsFromEscrowToTreasury',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'withdrawDAONounsFromEscrowToTreasury'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'withdrawDAONounsFromEscrowToTreasury',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawDAONounsFromEscrowToTreasury'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDaoABI,
    'withdrawDAONounsFromEscrowToTreasury',
    TMode
  >({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"withdrawFromForkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWithdrawFromForkEscrow<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDaoAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDaoABI,
          'withdrawFromForkEscrow'
        >['request']['abi'],
        'withdrawFromForkEscrow',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'withdrawFromForkEscrow'
      }
    : UseContractWriteConfig<
        typeof nounsDaoABI,
        'withdrawFromForkEscrow',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawFromForkEscrow'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDaoABI, 'withdrawFromForkEscrow', TMode>({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'withdrawFromForkEscrow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_acceptAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoAcceptAdmin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_acceptAdmin'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_acceptAdmin',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_acceptAdmin'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_acceptVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoAcceptVetoer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_acceptVetoer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_acceptVetoer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_acceptVetoer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_burnVetoPower"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoBurnVetoPower(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_burnVetoPower'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_burnVetoPower',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_burnVetoPower'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setDynamicQuorumParams"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetDynamicQuorumParams(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setDynamicQuorumParams'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setDynamicQuorumParams',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setDynamicQuorumParams'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setErc20TokensToIncludeInFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetErc20TokensToIncludeInFork(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setErc20TokensToIncludeInFork'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setErc20TokensToIncludeInFork',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setErc20TokensToIncludeInFork'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkDAODeployer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetForkDaoDeployer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkDAODeployer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkDAODeployer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkDAODeployer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetForkEscrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkEscrow'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkEscrow',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkEscrow'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkParams"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetForkParams(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkParams'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkParams',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkParams'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkPeriod"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetForkPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkPeriod'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkPeriod'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setForkThresholdBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetForkThresholdBps(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setForkThresholdBPS'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setForkThresholdBPS',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setForkThresholdBPS'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setLastMinuteWindowInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetLastMinuteWindowInBlocks(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setLastMinuteWindowInBlocks'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setLastMinuteWindowInBlocks',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setLastMinuteWindowInBlocks'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setMaxQuorumVotesBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetMaxQuorumVotesBps(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setMaxQuorumVotesBPS'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setMaxQuorumVotesBPS',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setMaxQuorumVotesBPS'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setMinQuorumVotesBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetMinQuorumVotesBps(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setMinQuorumVotesBPS'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setMinQuorumVotesBPS',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setMinQuorumVotesBPS'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setObjectionPeriodDurationInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetObjectionPeriodDurationInBlocks(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setObjectionPeriodDurationInBlocks'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setObjectionPeriodDurationInBlocks',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setObjectionPeriodDurationInBlocks'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setPendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetPendingAdmin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setPendingAdmin'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setPendingAdmin',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setPendingAdmin'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setPendingVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetPendingVetoer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setPendingVetoer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setPendingVetoer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setPendingVetoer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setProposalThresholdBPS"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetProposalThresholdBps(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setProposalThresholdBPS'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setProposalThresholdBPS',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setProposalThresholdBPS'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setProposalUpdatablePeriodInBlocks"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetProposalUpdatablePeriodInBlocks(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setProposalUpdatablePeriodInBlocks'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setProposalUpdatablePeriodInBlocks',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setProposalUpdatablePeriodInBlocks'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setQuorumCoefficient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetQuorumCoefficient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setQuorumCoefficient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setQuorumCoefficient',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setQuorumCoefficient'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setTimelocksAndAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetTimelocksAndAdmin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setTimelocksAndAdmin'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setTimelocksAndAdmin',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setTimelocksAndAdmin'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setVoteSnapshotBlockSwitchProposalId"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetVoteSnapshotBlockSwitchProposalId(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      '_setVoteSnapshotBlockSwitchProposalId'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setVoteSnapshotBlockSwitchProposalId',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    '_setVoteSnapshotBlockSwitchProposalId'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setVotingDelay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetVotingDelay(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setVotingDelay'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setVotingDelay',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setVotingDelay'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_setVotingPeriod"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoSetVotingPeriod(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setVotingPeriod'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_setVotingPeriod',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_setVotingPeriod'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"_withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, '_withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: '_withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, '_withdraw'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"cancel"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCancel(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'cancel'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'cancel',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'cancel'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"cancelSig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCancelSig(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'cancelSig'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'cancelSig',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'cancelSig'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castRefundableVote"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCastRefundableVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castRefundableVote'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castRefundableVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castRefundableVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castRefundableVoteWithReason"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCastRefundableVoteWithReason(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      'castRefundableVoteWithReason'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castRefundableVoteWithReason',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'castRefundableVoteWithReason'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castVote"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCastVote(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castVote'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castVote',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castVote'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castVoteBySig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCastVoteBySig(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castVoteBySig'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castVoteBySig',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castVoteBySig'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"castVoteWithReason"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoCastVoteWithReason(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castVoteWithReason'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'castVoteWithReason',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'castVoteWithReason'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"escrowToFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoEscrowToFork(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'escrowToFork'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'escrowToFork',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'escrowToFork'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"execute"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoExecute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'execute'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'execute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'execute'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"executeFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoExecuteFork(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'executeFork'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'executeFork',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'executeFork'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"executeOnTimelockV1"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoExecuteOnTimelockV1(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'executeOnTimelockV1'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'executeOnTimelockV1',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'executeOnTimelockV1'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"joinFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoJoinFork(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'joinFork'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'joinFork',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'joinFork'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"propose"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoPropose(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'propose'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'propose',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'propose'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposeBySigs"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoProposeBySigs(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'proposeBySigs'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposeBySigs',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'proposeBySigs'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"proposeOnTimelockV1"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoProposeOnTimelockV1(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'proposeOnTimelockV1'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'proposeOnTimelockV1',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'proposeOnTimelockV1'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"queue"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoQueue(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'queue'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'queue',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'queue'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposal"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoUpdateProposal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'updateProposal'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'updateProposal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposalBySigs"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoUpdateProposalBySigs(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'updateProposalBySigs'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposalBySigs',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'updateProposalBySigs'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposalDescription"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoUpdateProposalDescription(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      'updateProposalDescription'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposalDescription',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'updateProposalDescription'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"updateProposalTransactions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoUpdateProposalTransactions(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      'updateProposalTransactions'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'updateProposalTransactions',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'updateProposalTransactions'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"veto"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoVeto(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'veto'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'veto',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDaoABI, 'veto'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoWithdrawDaoNounsFromEscrowIncreasingTotalSupply(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      'withdrawDAONounsFromEscrowIncreasingTotalSupply'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'withdrawDAONounsFromEscrowIncreasingTotalSupply'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoWithdrawDaoNounsFromEscrowToTreasury(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDaoABI,
      'withdrawDAONounsFromEscrowToTreasury'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'withdrawDAONounsFromEscrowToTreasury'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDaoABI}__ and `functionName` set to `"withdrawFromForkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function usePrepareNounsDaoWithdrawFromForkEscrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDaoABI, 'withdrawFromForkEscrow'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    functionName: 'withdrawFromForkEscrow',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDaoABI,
    'withdrawFromForkEscrow'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"DAONounsSupplyIncreasedFromEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoDaoNounsSupplyIncreasedFromEscrowEvent(
  config: Omit<
    UseContractEventConfig<
      typeof nounsDaoABI,
      'DAONounsSupplyIncreasedFromEscrow'
    >,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'DAONounsSupplyIncreasedFromEscrow',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDaoABI,
    'DAONounsSupplyIncreasedFromEscrow'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"DAOWithdrawNounsFromEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoDaoWithdrawNounsFromEscrowEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'DAOWithdrawNounsFromEscrow'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'DAOWithdrawNounsFromEscrow',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'DAOWithdrawNounsFromEscrow'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ERC20TokensToIncludeInForkSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoErc20TokensToIncludeInForkSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ERC20TokensToIncludeInForkSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ERC20TokensToIncludeInForkSet',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDaoABI,
    'ERC20TokensToIncludeInForkSet'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"EscrowedToFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoEscrowedToForkEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'EscrowedToFork'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'EscrowedToFork',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'EscrowedToFork'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ExecuteFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoExecuteForkEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ExecuteFork'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ExecuteFork',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ExecuteFork'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ForkDAODeployerSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkDaoDeployerSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ForkDAODeployerSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ForkDAODeployerSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ForkDAODeployerSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ForkPeriodSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkPeriodSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ForkPeriodSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ForkPeriodSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ForkPeriodSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ForkThresholdSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoForkThresholdSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ForkThresholdSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ForkThresholdSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ForkThresholdSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"JoinFork"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoJoinForkEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'JoinFork'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'JoinFork',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'JoinFork'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"LastMinuteWindowSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoLastMinuteWindowSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'LastMinuteWindowSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'LastMinuteWindowSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'LastMinuteWindowSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"MaxQuorumVotesBPSSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMaxQuorumVotesBpsSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'MaxQuorumVotesBPSSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'MaxQuorumVotesBPSSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'MaxQuorumVotesBPSSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"MinQuorumVotesBPSSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoMinQuorumVotesBpsSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'MinQuorumVotesBPSSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'MinQuorumVotesBPSSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'MinQuorumVotesBPSSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"NewAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNewAdminEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'NewAdmin'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'NewAdmin',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'NewAdmin'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"NewImplementation"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNewImplementationEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'NewImplementation'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'NewImplementation',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'NewImplementation'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"NewPendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNewPendingAdminEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'NewPendingAdmin'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'NewPendingAdmin',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'NewPendingAdmin'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"NewPendingVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNewPendingVetoerEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'NewPendingVetoer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'NewPendingVetoer',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'NewPendingVetoer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"NewVetoer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoNewVetoerEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'NewVetoer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'NewVetoer',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'NewVetoer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ObjectionPeriodDurationSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoObjectionPeriodDurationSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ObjectionPeriodDurationSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ObjectionPeriodDurationSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ObjectionPeriodDurationSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalCanceled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalCanceledEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalCanceled'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalCanceled',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalCanceled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalCreated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalCreated',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalCreatedOnTimelockV1"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalCreatedOnTimelockV1Event(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalCreatedOnTimelockV1'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalCreatedOnTimelockV1',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDaoABI,
    'ProposalCreatedOnTimelockV1'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalCreatedWithRequirements"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalCreatedWithRequirementsEvent(
  config: Omit<
    UseContractEventConfig<
      typeof nounsDaoABI,
      'ProposalCreatedWithRequirements'
    >,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalCreatedWithRequirements',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDaoABI,
    'ProposalCreatedWithRequirements'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalDescriptionUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalDescriptionUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalDescriptionUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalDescriptionUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalDescriptionUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalExecuted"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalExecutedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalExecuted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalExecuted',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalExecuted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalObjectionPeriodSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalObjectionPeriodSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalObjectionPeriodSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalObjectionPeriodSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalObjectionPeriodSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalQueued"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalQueuedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalQueued'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalQueued',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalQueued'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalThresholdBPSSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalThresholdBpsSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalThresholdBPSSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalThresholdBPSSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalThresholdBPSSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalTransactionsUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalTransactionsUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalTransactionsUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalTransactionsUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDaoABI,
    'ProposalTransactionsUpdated'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalUpdatablePeriodSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalUpdatablePeriodSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalUpdatablePeriodSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalUpdatablePeriodSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalUpdatablePeriodSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"ProposalVetoed"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoProposalVetoedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'ProposalVetoed'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'ProposalVetoed',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'ProposalVetoed'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"QuorumCoefficientSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoQuorumCoefficientSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'QuorumCoefficientSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'QuorumCoefficientSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'QuorumCoefficientSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"QuorumVotesBPSSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoQuorumVotesBpsSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'QuorumVotesBPSSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'QuorumVotesBPSSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'QuorumVotesBPSSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"RefundableVote"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoRefundableVoteEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'RefundableVote'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'RefundableVote',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'RefundableVote'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"SignatureCancelled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoSignatureCancelledEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'SignatureCancelled'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'SignatureCancelled',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'SignatureCancelled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"TimelocksAndAdminSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoTimelocksAndAdminSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'TimelocksAndAdminSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'TimelocksAndAdminSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'TimelocksAndAdminSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"VoteCast"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVoteCastEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'VoteCast'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'VoteCast',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'VoteCast'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"VoteSnapshotBlockSwitchProposalIdSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVoteSnapshotBlockSwitchProposalIdSetEvent(
  config: Omit<
    UseContractEventConfig<
      typeof nounsDaoABI,
      'VoteSnapshotBlockSwitchProposalIdSet'
    >,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'VoteSnapshotBlockSwitchProposalIdSet',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDaoABI,
    'VoteSnapshotBlockSwitchProposalIdSet'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"VotingDelaySet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVotingDelaySetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'VotingDelaySet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'VotingDelaySet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'VotingDelaySet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"VotingPeriodSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoVotingPeriodSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'VotingPeriodSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'VotingPeriodSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'VotingPeriodSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"Withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWithdrawEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'Withdraw'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'Withdraw',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'Withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDaoABI}__ and `eventName` set to `"WithdrawFromForkEscrow"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3E6272A167e8AcCb32072d08E0957F9c79223d)
 */
export function useNounsDaoWithdrawFromForkEscrowEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDaoABI, 'WithdrawFromForkEscrow'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDaoAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDaoABI,
    address: nounsDaoAddress[1],
    eventName: 'WithdrawFromForkEscrow',
    ...config,
  } as UseContractEventConfig<typeof nounsDaoABI, 'WithdrawFromForkEscrow'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"PRIOR_VOTES_BLOCKS_AGO"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataPriorVotesBlocksAgo<
  TFunctionName extends 'PRIOR_VOTES_BLOCKS_AGO',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'PRIOR_VOTES_BLOCKS_AGO',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"createCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataCreateCandidateCost<
  TFunctionName extends 'createCandidateCost',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'createCandidateCost',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"feeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataFeeRecipient<
  TFunctionName extends 'feeRecipient',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'feeRecipient',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"nounsDao"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataNounsDao<
  TFunctionName extends 'nounsDao',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'nounsDao',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"nounsToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataNounsToken<
  TFunctionName extends 'nounsToken',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'nounsToken',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"propCandidates"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataPropCandidates<
  TFunctionName extends 'propCandidates',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'propCandidates',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"updateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataUpdateCandidateCost<
  TFunctionName extends 'updateCandidateCost',
  TSelectData = ReadContractResult<typeof nounsDataABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'updateCandidateCost',
    ...config,
  } as UseContractReadConfig<typeof nounsDataABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof nounsDataABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, TFunctionName, TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"addSignature"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataAddSignature<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'addSignature'
        >['request']['abi'],
        'addSignature',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addSignature'
      }
    : UseContractWriteConfig<typeof nounsDataABI, 'addSignature', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addSignature'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'addSignature', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'addSignature',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"cancelProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataCancelProposalCandidate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'cancelProposalCandidate'
        >['request']['abi'],
        'cancelProposalCandidate',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'cancelProposalCandidate'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'cancelProposalCandidate',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'cancelProposalCandidate'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDataABI,
    'cancelProposalCandidate',
    TMode
  >({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'cancelProposalCandidate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"createProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataCreateProposalCandidate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'createProposalCandidate'
        >['request']['abi'],
        'createProposalCandidate',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createProposalCandidate'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'createProposalCandidate',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createProposalCandidate'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDataABI,
    'createProposalCandidate',
    TMode
  >({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'createProposalCandidate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof nounsDataABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'initialize', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'renounceOwnership', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"sendCandidateFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataSendCandidateFeedback<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'sendCandidateFeedback'
        >['request']['abi'],
        'sendCandidateFeedback',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'sendCandidateFeedback'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'sendCandidateFeedback',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendCandidateFeedback'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'sendCandidateFeedback', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'sendCandidateFeedback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"sendFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataSendFeedback<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'sendFeedback'
        >['request']['abi'],
        'sendFeedback',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'sendFeedback'
      }
    : UseContractWriteConfig<typeof nounsDataABI, 'sendFeedback', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendFeedback'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'sendFeedback', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'sendFeedback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"setCreateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataSetCreateCandidateCost<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'setCreateCandidateCost'
        >['request']['abi'],
        'setCreateCandidateCost',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setCreateCandidateCost'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'setCreateCandidateCost',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setCreateCandidateCost'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'setCreateCandidateCost', TMode>(
    {
      abi: nounsDataABI,
      address: nounsDataAddress[1],
      functionName: 'setCreateCandidateCost',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"setFeeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataSetFeeRecipient<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'setFeeRecipient'
        >['request']['abi'],
        'setFeeRecipient',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setFeeRecipient'
      }
    : UseContractWriteConfig<typeof nounsDataABI, 'setFeeRecipient', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setFeeRecipient'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'setFeeRecipient', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'setFeeRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"setUpdateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataSetUpdateCandidateCost<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'setUpdateCandidateCost'
        >['request']['abi'],
        'setUpdateCandidateCost',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setUpdateCandidateCost'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'setUpdateCandidateCost',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setUpdateCandidateCost'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'setUpdateCandidateCost', TMode>(
    {
      abi: nounsDataABI,
      address: nounsDataAddress[1],
      functionName: 'setUpdateCandidateCost',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'transferOwnership', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"updateProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataUpdateProposalCandidate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'updateProposalCandidate'
        >['request']['abi'],
        'updateProposalCandidate',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateProposalCandidate'
      }
    : UseContractWriteConfig<
        typeof nounsDataABI,
        'updateProposalCandidate',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateProposalCandidate'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDataABI,
    'updateProposalCandidate',
    TMode
  >({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'updateProposalCandidate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'upgradeTo'
        >['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof nounsDataABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'upgradeTo', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'upgradeToAndCall'
        >['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      }
    : UseContractWriteConfig<typeof nounsDataABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'upgradeToAndCall', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"withdrawETH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataWithdrawEth<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDataAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDataABI,
          'withdrawETH'
        >['request']['abi'],
        'withdrawETH',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'withdrawETH'
      }
    : UseContractWriteConfig<typeof nounsDataABI, 'withdrawETH', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawETH'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDataABI, 'withdrawETH', TMode>({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'withdrawETH',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"addSignature"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataAddSignature(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'addSignature'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'addSignature',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'addSignature'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"cancelProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataCancelProposalCandidate(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDataABI,
      'cancelProposalCandidate'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'cancelProposalCandidate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDataABI,
    'cancelProposalCandidate'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"createProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataCreateProposalCandidate(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDataABI,
      'createProposalCandidate'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'createProposalCandidate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDataABI,
    'createProposalCandidate'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"sendCandidateFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataSendCandidateFeedback(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'sendCandidateFeedback'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'sendCandidateFeedback',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDataABI,
    'sendCandidateFeedback'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"sendFeedback"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataSendFeedback(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'sendFeedback'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'sendFeedback',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'sendFeedback'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"setCreateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataSetCreateCandidateCost(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDataABI,
      'setCreateCandidateCost'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'setCreateCandidateCost',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDataABI,
    'setCreateCandidateCost'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"setFeeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataSetFeeRecipient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'setFeeRecipient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'setFeeRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'setFeeRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"setUpdateCandidateCost"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataSetUpdateCandidateCost(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDataABI,
      'setUpdateCandidateCost'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'setUpdateCandidateCost',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDataABI,
    'setUpdateCandidateCost'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"updateProposalCandidate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataUpdateProposalCandidate(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDataABI,
      'updateProposalCandidate'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'updateProposalCandidate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDataABI,
    'updateProposalCandidate'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDataABI}__ and `functionName` set to `"withdrawETH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function usePrepareNounsDataWithdrawEth(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDataABI, 'withdrawETH'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    functionName: 'withdrawETH',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDataABI, 'withdrawETH'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataBeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"CandidateFeedbackSent"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataCandidateFeedbackSentEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'CandidateFeedbackSent'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'CandidateFeedbackSent',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'CandidateFeedbackSent'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"CreateCandidateCostSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataCreateCandidateCostSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'CreateCandidateCostSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'CreateCandidateCostSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'CreateCandidateCostSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"ETHWithdrawn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataEthWithdrawnEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'ETHWithdrawn'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'ETHWithdrawn',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'ETHWithdrawn'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"FeeRecipientSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataFeeRecipientSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'FeeRecipientSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'FeeRecipientSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'FeeRecipientSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"FeedbackSent"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataFeedbackSentEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'FeedbackSent'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'FeedbackSent',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'FeedbackSent'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"ProposalCandidateCanceled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataProposalCandidateCanceledEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'ProposalCandidateCanceled'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'ProposalCandidateCanceled',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'ProposalCandidateCanceled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"ProposalCandidateCreated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataProposalCandidateCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'ProposalCandidateCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'ProposalCandidateCreated',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'ProposalCandidateCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"ProposalCandidateUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataProposalCandidateUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'ProposalCandidateUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'ProposalCandidateUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'ProposalCandidateUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"SignatureAdded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataSignatureAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'SignatureAdded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'SignatureAdded',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'SignatureAdded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"UpdateCandidateCostSet"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataUpdateCandidateCostSetEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'UpdateCandidateCostSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'UpdateCandidateCostSet',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'UpdateCandidateCostSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDataABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xf790A5f59678dd733fb3De93493A91f472ca1365)
 */
export function useNounsDataUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDataABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDataAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDataABI,
    address: nounsDataAddress[1],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof nounsDataABI, 'Upgraded'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"accessories"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAccessories<
  TFunctionName extends 'accessories',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'accessories',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"accessoryCount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAccessoryCount<
  TFunctionName extends 'accessoryCount',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'accessoryCount',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"arePartsLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorArePartsLocked<
  TFunctionName extends 'arePartsLocked',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'arePartsLocked',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"art"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorArt<
  TFunctionName extends 'art',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'art',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"backgroundCount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorBackgroundCount<
  TFunctionName extends 'backgroundCount',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'backgroundCount',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"backgrounds"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorBackgrounds<
  TFunctionName extends 'backgrounds',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'backgrounds',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"baseURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorBaseUri<
  TFunctionName extends 'baseURI',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'baseURI',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"bodies"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorBodies<
  TFunctionName extends 'bodies',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'bodies',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"bodyCount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorBodyCount<
  TFunctionName extends 'bodyCount',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'bodyCount',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"dataURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorDataUri<
  TFunctionName extends 'dataURI',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'dataURI',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"generateSVGImage"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorGenerateSvgImage<
  TFunctionName extends 'generateSVGImage',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'generateSVGImage',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"genericDataURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorGenericDataUri<
  TFunctionName extends 'genericDataURI',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'genericDataURI',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"getPartsForSeed"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorGetPartsForSeed<
  TFunctionName extends 'getPartsForSeed',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'getPartsForSeed',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"glasses"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorGlasses<
  TFunctionName extends 'glasses',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'glasses',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"glassesCount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorGlassesCount<
  TFunctionName extends 'glassesCount',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'glassesCount',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"headCount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorHeadCount<
  TFunctionName extends 'headCount',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'headCount',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"heads"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorHeads<
  TFunctionName extends 'heads',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'heads',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"isDataURIEnabled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorIsDataUriEnabled<
  TFunctionName extends 'isDataURIEnabled',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'isDataURIEnabled',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"palettes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorPalettes<
  TFunctionName extends 'palettes',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'palettes',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"renderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorRenderer<
  TFunctionName extends 'renderer',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'renderer',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"tokenURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorTokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof nounsDescriptorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof nounsDescriptorABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'tokenURI',
    ...config,
  } as UseContractReadConfig<
    typeof nounsDescriptorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, TFunctionName, TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addAccessories"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddAccessories<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addAccessories'
        >['request']['abi'],
        'addAccessories',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addAccessories'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addAccessories',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addAccessories'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'addAccessories', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addAccessories',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addAccessoriesFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddAccessoriesFromPointer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addAccessoriesFromPointer'
        >['request']['abi'],
        'addAccessoriesFromPointer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addAccessoriesFromPointer'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addAccessoriesFromPointer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addAccessoriesFromPointer'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'addAccessoriesFromPointer',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addAccessoriesFromPointer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addBackground"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddBackground<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addBackground'
        >['request']['abi'],
        'addBackground',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addBackground'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addBackground',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addBackground'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'addBackground', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addBackground',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addBodies"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddBodies<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addBodies'
        >['request']['abi'],
        'addBodies',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addBodies' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'addBodies', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addBodies'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'addBodies', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addBodies',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addBodiesFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddBodiesFromPointer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addBodiesFromPointer'
        >['request']['abi'],
        'addBodiesFromPointer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addBodiesFromPointer'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addBodiesFromPointer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addBodiesFromPointer'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'addBodiesFromPointer',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addBodiesFromPointer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addGlasses"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddGlasses<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addGlasses'
        >['request']['abi'],
        'addGlasses',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addGlasses' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'addGlasses', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addGlasses'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'addGlasses', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addGlasses',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addGlassesFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddGlassesFromPointer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addGlassesFromPointer'
        >['request']['abi'],
        'addGlassesFromPointer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addGlassesFromPointer'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addGlassesFromPointer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addGlassesFromPointer'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'addGlassesFromPointer',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addGlassesFromPointer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addHeads"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddHeads<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addHeads'
        >['request']['abi'],
        'addHeads',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addHeads' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'addHeads', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addHeads'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'addHeads', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addHeads',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addHeadsFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddHeadsFromPointer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addHeadsFromPointer'
        >['request']['abi'],
        'addHeadsFromPointer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addHeadsFromPointer'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addHeadsFromPointer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addHeadsFromPointer'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'addHeadsFromPointer',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addHeadsFromPointer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addManyBackgrounds"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorAddManyBackgrounds<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'addManyBackgrounds'
        >['request']['abi'],
        'addManyBackgrounds',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addManyBackgrounds'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'addManyBackgrounds',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addManyBackgrounds'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'addManyBackgrounds',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addManyBackgrounds',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"lockParts"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorLockParts<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'lockParts'
        >['request']['abi'],
        'lockParts',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'lockParts' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'lockParts', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'lockParts'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'lockParts', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'lockParts',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'renounceOwnership',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setArt"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetArt<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setArt'
        >['request']['abi'],
        'setArt',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setArt' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'setArt', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setArt'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'setArt', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setArt',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setArtDescriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetArtDescriptor<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setArtDescriptor'
        >['request']['abi'],
        'setArtDescriptor',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setArtDescriptor'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'setArtDescriptor',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setArtDescriptor'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'setArtDescriptor', TMode>(
    {
      abi: nounsDescriptorABI,
      address: nounsDescriptorAddress[1],
      functionName: 'setArtDescriptor',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setArtInflator"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetArtInflator<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setArtInflator'
        >['request']['abi'],
        'setArtInflator',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setArtInflator'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'setArtInflator',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setArtInflator'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'setArtInflator', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setArtInflator',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setBaseURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetBaseUri<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setBaseURI'
        >['request']['abi'],
        'setBaseURI',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setBaseURI' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'setBaseURI', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setBaseURI'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'setBaseURI', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setBaseURI',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setPalette"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetPalette<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setPalette'
        >['request']['abi'],
        'setPalette',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setPalette' }
    : UseContractWriteConfig<typeof nounsDescriptorABI, 'setPalette', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setPalette'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'setPalette', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setPalette',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setPalettePointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetPalettePointer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setPalettePointer'
        >['request']['abi'],
        'setPalettePointer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setPalettePointer'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'setPalettePointer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setPalettePointer'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'setPalettePointer',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setPalettePointer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorSetRenderer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'setRenderer'
        >['request']['abi'],
        'setRenderer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setRenderer'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'setRenderer',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setRenderer'
      } = {} as any,
) {
  return useContractWrite<typeof nounsDescriptorABI, 'setRenderer', TMode>({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"toggleDataURIEnabled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorToggleDataUriEnabled<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'toggleDataURIEnabled'
        >['request']['abi'],
        'toggleDataURIEnabled',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'toggleDataURIEnabled'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'toggleDataURIEnabled',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'toggleDataURIEnabled'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'toggleDataURIEnabled',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'toggleDataURIEnabled',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsDescriptorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsDescriptorABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<
        typeof nounsDescriptorABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof nounsDescriptorABI,
    'transferOwnership',
    TMode
  >({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addAccessories"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddAccessories(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addAccessories'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addAccessories',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addAccessories'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addAccessoriesFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddAccessoriesFromPointer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'addAccessoriesFromPointer'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addAccessoriesFromPointer',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addAccessoriesFromPointer'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addBackground"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddBackground(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addBackground'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addBackground',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addBackground'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addBodies"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddBodies(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addBodies'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addBodies',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addBodies'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addBodiesFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddBodiesFromPointer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'addBodiesFromPointer'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addBodiesFromPointer',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addBodiesFromPointer'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addGlasses"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddGlasses(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addGlasses'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addGlasses',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addGlasses'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addGlassesFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddGlassesFromPointer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'addGlassesFromPointer'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addGlassesFromPointer',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addGlassesFromPointer'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addHeads"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddHeads(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addHeads'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addHeads',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'addHeads'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addHeadsFromPointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddHeadsFromPointer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'addHeadsFromPointer'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addHeadsFromPointer',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addHeadsFromPointer'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"addManyBackgrounds"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorAddManyBackgrounds(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'addManyBackgrounds'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'addManyBackgrounds',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'addManyBackgrounds'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"lockParts"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorLockParts(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'lockParts'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'lockParts',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'lockParts'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'renounceOwnership'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'renounceOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setArt"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetArt(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setArt'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setArt',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setArt'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setArtDescriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetArtDescriptor(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'setArtDescriptor'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setArtDescriptor',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'setArtDescriptor'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setArtInflator"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetArtInflator(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setArtInflator'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setArtInflator',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'setArtInflator'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setBaseURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetBaseUri(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setBaseURI'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setBaseURI',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setBaseURI'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setPalette"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetPalette(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setPalette'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setPalette',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setPalette'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setPalettePointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetPalettePointer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'setPalettePointer'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setPalettePointer',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'setPalettePointer'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"setRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorSetRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'setRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsDescriptorABI, 'setRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"toggleDataURIEnabled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorToggleDataUriEnabled(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'toggleDataURIEnabled'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'toggleDataURIEnabled',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'toggleDataURIEnabled'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsDescriptorABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function usePrepareNounsDescriptorTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsDescriptorABI,
      'transferOwnership'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsDescriptorABI,
    'transferOwnership'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    ...config,
  } as UseContractEventConfig<typeof nounsDescriptorABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__ and `eventName` set to `"ArtUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorArtUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, 'ArtUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    eventName: 'ArtUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDescriptorABI, 'ArtUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__ and `eventName` set to `"BaseURIUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorBaseUriUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, 'BaseURIUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    eventName: 'BaseURIUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDescriptorABI, 'BaseURIUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__ and `eventName` set to `"DataURIToggled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorDataUriToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, 'DataURIToggled'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    eventName: 'DataURIToggled',
    ...config,
  } as UseContractEventConfig<typeof nounsDescriptorABI, 'DataURIToggled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<
    typeof nounsDescriptorABI,
    'OwnershipTransferred'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__ and `eventName` set to `"PartsLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorPartsLockedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, 'PartsLocked'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    eventName: 'PartsLocked',
    ...config,
  } as UseContractEventConfig<typeof nounsDescriptorABI, 'PartsLocked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsDescriptorABI}__ and `eventName` set to `"RendererUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6229c811D04501523C6058bfAAc29c91bb586268)
 */
export function useNounsDescriptorRendererUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsDescriptorABI, 'RendererUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsDescriptorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsDescriptorABI,
    address: nounsDescriptorAddress[1],
    eventName: 'RendererUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsDescriptorABI, 'RendererUpdated'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"GRACE_PERIOD"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorGracePeriod<
  TFunctionName extends 'GRACE_PERIOD',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'GRACE_PERIOD',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"MAXIMUM_DELAY"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorMaximumDelay<
  TFunctionName extends 'MAXIMUM_DELAY',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'MAXIMUM_DELAY',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"MINIMUM_DELAY"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorMinimumDelay<
  TFunctionName extends 'MINIMUM_DELAY',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'MINIMUM_DELAY',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"NAME"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorName<
  TFunctionName extends 'NAME',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'NAME',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"admin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorAdmin<
  TFunctionName extends 'admin',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'admin',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"delay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorDelay<
  TFunctionName extends 'delay',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'delay',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"pendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorPendingAdmin<
  TFunctionName extends 'pendingAdmin',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'pendingAdmin',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"queuedTransactions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorQueuedTransactions<
  TFunctionName extends 'queuedTransactions',
  TSelectData = ReadContractResult<typeof nounsExecutorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsExecutorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'queuedTransactions',
    ...config,
  } as UseContractReadConfig<
    typeof nounsExecutorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof nounsExecutorABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, TFunctionName, TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"acceptAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorAcceptAdmin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'acceptAdmin'
        >['request']['abi'],
        'acceptAdmin',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'acceptAdmin'
      }
    : UseContractWriteConfig<typeof nounsExecutorABI, 'acceptAdmin', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'acceptAdmin'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'acceptAdmin', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'acceptAdmin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"cancelTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorCancelTransaction<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'cancelTransaction'
        >['request']['abi'],
        'cancelTransaction',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'cancelTransaction'
      }
    : UseContractWriteConfig<
        typeof nounsExecutorABI,
        'cancelTransaction',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'cancelTransaction'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'cancelTransaction', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'cancelTransaction',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"executeTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorExecuteTransaction<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'executeTransaction'
        >['request']['abi'],
        'executeTransaction',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'executeTransaction'
      }
    : UseContractWriteConfig<
        typeof nounsExecutorABI,
        'executeTransaction',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'executeTransaction'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'executeTransaction', TMode>(
    {
      abi: nounsExecutorABI,
      address: nounsExecutorAddress[1],
      functionName: 'executeTransaction',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof nounsExecutorABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'initialize', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"queueTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorQueueTransaction<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'queueTransaction'
        >['request']['abi'],
        'queueTransaction',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'queueTransaction'
      }
    : UseContractWriteConfig<
        typeof nounsExecutorABI,
        'queueTransaction',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'queueTransaction'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'queueTransaction', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'queueTransaction',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"sendERC20"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorSendErc20<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'sendERC20'
        >['request']['abi'],
        'sendERC20',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'sendERC20' }
    : UseContractWriteConfig<typeof nounsExecutorABI, 'sendERC20', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendERC20'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'sendERC20', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'sendERC20',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"sendETH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorSendEth<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'sendETH'
        >['request']['abi'],
        'sendETH',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'sendETH' }
    : UseContractWriteConfig<typeof nounsExecutorABI, 'sendETH', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendETH'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'sendETH', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'sendETH',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"setDelay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorSetDelay<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'setDelay'
        >['request']['abi'],
        'setDelay',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setDelay' }
    : UseContractWriteConfig<typeof nounsExecutorABI, 'setDelay', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setDelay'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'setDelay', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'setDelay',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"setPendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorSetPendingAdmin<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'setPendingAdmin'
        >['request']['abi'],
        'setPendingAdmin',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setPendingAdmin'
      }
    : UseContractWriteConfig<
        typeof nounsExecutorABI,
        'setPendingAdmin',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setPendingAdmin'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'setPendingAdmin', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'setPendingAdmin',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'upgradeTo'
        >['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof nounsExecutorABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'upgradeTo', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsExecutorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsExecutorABI,
          'upgradeToAndCall'
        >['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      }
    : UseContractWriteConfig<
        typeof nounsExecutorABI,
        'upgradeToAndCall',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof nounsExecutorABI, 'upgradeToAndCall', TMode>({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"acceptAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorAcceptAdmin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'acceptAdmin'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'acceptAdmin',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'acceptAdmin'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"cancelTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorCancelTransaction(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'cancelTransaction'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'cancelTransaction',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsExecutorABI,
    'cancelTransaction'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"executeTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorExecuteTransaction(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof nounsExecutorABI,
      'executeTransaction'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'executeTransaction',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsExecutorABI,
    'executeTransaction'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"queueTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorQueueTransaction(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'queueTransaction'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'queueTransaction',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsExecutorABI,
    'queueTransaction'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"sendERC20"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorSendErc20(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'sendERC20'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'sendERC20',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'sendERC20'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"sendETH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorSendEth(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'sendETH'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'sendETH',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'sendETH'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"setDelay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorSetDelay(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'setDelay'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'setDelay',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'setDelay'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"setPendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorSetPendingAdmin(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'setPendingAdmin'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'setPendingAdmin',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsExecutorABI,
    'setPendingAdmin'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsExecutorABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function usePrepareNounsExecutorUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsExecutorABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsExecutorABI,
    'upgradeToAndCall'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorBeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"CancelTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorCancelTransactionEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'CancelTransaction'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'CancelTransaction',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'CancelTransaction'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"ERC20Sent"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorErc20SentEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'ERC20Sent'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'ERC20Sent',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'ERC20Sent'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"ETHSent"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorEthSentEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'ETHSent'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'ETHSent',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'ETHSent'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"ExecuteTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorExecuteTransactionEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'ExecuteTransaction'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'ExecuteTransaction',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'ExecuteTransaction'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"NewAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorNewAdminEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'NewAdmin'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'NewAdmin',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'NewAdmin'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"NewDelay"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorNewDelayEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'NewDelay'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'NewDelay',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'NewDelay'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"NewPendingAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorNewPendingAdminEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'NewPendingAdmin'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'NewPendingAdmin',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'NewPendingAdmin'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"QueueTransaction"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorQueueTransactionEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'QueueTransaction'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'QueueTransaction',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'QueueTransaction'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsExecutorABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71)
 */
export function useNounsExecutorUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsExecutorABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsExecutorAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsExecutorABI,
    address: nounsExecutorAddress[1],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof nounsExecutorABI, 'Upgraded'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"DELEGATION_TYPEHASH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDelegationTypehash<
  TFunctionName extends 'DELEGATION_TYPEHASH',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'DELEGATION_TYPEHASH',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"DOMAIN_TYPEHASH"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDomainTypehash<
  TFunctionName extends 'DOMAIN_TYPEHASH',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'DOMAIN_TYPEHASH',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"balanceOf"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"checkpoints"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenCheckpoints<
  TFunctionName extends 'checkpoints',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'checkpoints',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"contractURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenContractUri<
  TFunctionName extends 'contractURI',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"dataURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDataUri<
  TFunctionName extends 'dataURI',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'dataURI',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"decimals"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"delegates"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDelegates<
  TFunctionName extends 'delegates',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'delegates',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"descriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDescriptor<
  TFunctionName extends 'descriptor',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'descriptor',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"getApproved"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenGetApproved<
  TFunctionName extends 'getApproved',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'getApproved',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"getCurrentVotes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenGetCurrentVotes<
  TFunctionName extends 'getCurrentVotes',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'getCurrentVotes',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"getPriorVotes"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenGetPriorVotes<
  TFunctionName extends 'getPriorVotes',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'getPriorVotes',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"isApprovedForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenIsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"isDescriptorLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenIsDescriptorLocked<
  TFunctionName extends 'isDescriptorLocked',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'isDescriptorLocked',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"isMinterLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenIsMinterLocked<
  TFunctionName extends 'isMinterLocked',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'isMinterLocked',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"isSeederLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenIsSeederLocked<
  TFunctionName extends 'isSeederLocked',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'isSeederLocked',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"minter"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenMinter<
  TFunctionName extends 'minter',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'minter',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"name"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"nonces"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenNonces<
  TFunctionName extends 'nonces',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'nonces',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"noundersDAO"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenNoundersDao<
  TFunctionName extends 'noundersDAO',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'noundersDAO',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"numCheckpoints"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenNumCheckpoints<
  TFunctionName extends 'numCheckpoints',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'numCheckpoints',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"ownerOf"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenOwnerOf<
  TFunctionName extends 'ownerOf',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'ownerOf',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"proxyRegistry"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenProxyRegistry<
  TFunctionName extends 'proxyRegistry',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'proxyRegistry',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"seeder"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSeeder<
  TFunctionName extends 'seeder',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'seeder',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"seeds"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSeeds<
  TFunctionName extends 'seeds',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'seeds',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"symbol"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"tokenByIndex"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTokenByIndex<
  TFunctionName extends 'tokenByIndex',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'tokenByIndex',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"tokenOfOwnerByIndex"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTokenOfOwnerByIndex<
  TFunctionName extends 'tokenOfOwnerByIndex',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'tokenOfOwnerByIndex',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"tokenURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'tokenURI',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"totalSupply"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"votesToDelegate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenVotesToDelegate<
  TFunctionName extends 'votesToDelegate',
  TSelectData = ReadContractResult<typeof nounsTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractRead({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'votesToDelegate',
    ...config,
  } as UseContractReadConfig<typeof nounsTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof nounsTokenABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, TFunctionName, TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenApprove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'approve' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'approve', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'approve', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"burn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenBurn<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'burn'
        >['request']['abi'],
        'burn',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'burn' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'burn', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'burn'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'burn', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"delegate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDelegate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'delegate'
        >['request']['abi'],
        'delegate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'delegate' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'delegate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'delegate'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'delegate', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'delegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"delegateBySig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDelegateBySig<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'delegateBySig'
        >['request']['abi'],
        'delegateBySig',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'delegateBySig'
      }
    : UseContractWriteConfig<typeof nounsTokenABI, 'delegateBySig', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'delegateBySig'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'delegateBySig', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'delegateBySig',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"lockDescriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenLockDescriptor<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'lockDescriptor'
        >['request']['abi'],
        'lockDescriptor',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'lockDescriptor'
      }
    : UseContractWriteConfig<typeof nounsTokenABI, 'lockDescriptor', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'lockDescriptor'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'lockDescriptor', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'lockDescriptor',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"lockMinter"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenLockMinter<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'lockMinter'
        >['request']['abi'],
        'lockMinter',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'lockMinter' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'lockMinter', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'lockMinter'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'lockMinter', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'lockMinter',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"lockSeeder"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenLockSeeder<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'lockSeeder'
        >['request']['abi'],
        'lockSeeder',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'lockSeeder' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'lockSeeder', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'lockSeeder'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'lockSeeder', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'lockSeeder',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"mint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenMint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'mint'
        >['request']['abi'],
        'mint',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'mint' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'mint', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mint'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'mint', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<
        typeof nounsTokenABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'renounceOwnership', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSafeTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'safeTransferFrom'
        >['request']['abi'],
        'safeTransferFrom',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'safeTransferFrom'
      }
    : UseContractWriteConfig<
        typeof nounsTokenABI,
        'safeTransferFrom',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'safeTransferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'safeTransferFrom', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSetApprovalForAll<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'setApprovalForAll'
        >['request']['abi'],
        'setApprovalForAll',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setApprovalForAll'
      }
    : UseContractWriteConfig<
        typeof nounsTokenABI,
        'setApprovalForAll',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setApprovalForAll'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'setApprovalForAll', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setContractURIHash"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSetContractUriHash<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'setContractURIHash'
        >['request']['abi'],
        'setContractURIHash',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setContractURIHash'
      }
    : UseContractWriteConfig<
        typeof nounsTokenABI,
        'setContractURIHash',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setContractURIHash'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'setContractURIHash', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setContractURIHash',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setDescriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSetDescriptor<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'setDescriptor'
        >['request']['abi'],
        'setDescriptor',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setDescriptor'
      }
    : UseContractWriteConfig<typeof nounsTokenABI, 'setDescriptor', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setDescriptor'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'setDescriptor', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setDescriptor',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setMinter"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSetMinter<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'setMinter'
        >['request']['abi'],
        'setMinter',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setMinter' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'setMinter', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setMinter'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'setMinter', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setMinter',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setNoundersDAO"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSetNoundersDao<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'setNoundersDAO'
        >['request']['abi'],
        'setNoundersDAO',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setNoundersDAO'
      }
    : UseContractWriteConfig<typeof nounsTokenABI, 'setNoundersDAO', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setNoundersDAO'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'setNoundersDAO', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setNoundersDAO',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setSeeder"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSetSeeder<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'setSeeder'
        >['request']['abi'],
        'setSeeder',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setSeeder' }
    : UseContractWriteConfig<typeof nounsTokenABI, 'setSeeder', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setSeeder'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'setSeeder', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setSeeder',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferFrom'
      }
    : UseContractWriteConfig<typeof nounsTokenABI, 'transferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'transferFrom', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof nounsTokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof nounsTokenABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<
        typeof nounsTokenABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof nounsTokenABI, 'transferOwnership', TMode>({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"burn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'burn'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"delegate"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'delegate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'delegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'delegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"delegateBySig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenDelegateBySig(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'delegateBySig'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'delegateBySig',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'delegateBySig'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"lockDescriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenLockDescriptor(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'lockDescriptor'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'lockDescriptor',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'lockDescriptor'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"lockMinter"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenLockMinter(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'lockMinter'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'lockMinter',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'lockMinter'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"lockSeeder"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenLockSeeder(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'lockSeeder'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'lockSeeder',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'lockSeeder'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"mint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'mint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setContractURIHash"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSetContractUriHash(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setContractURIHash'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setContractURIHash',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof nounsTokenABI,
    'setContractURIHash'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setDescriptor"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSetDescriptor(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setDescriptor'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setDescriptor',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setDescriptor'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setMinter"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSetMinter(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setMinter'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setMinter',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setMinter'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setNoundersDAO"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSetNoundersDao(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setNoundersDAO'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setNoundersDAO',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setNoundersDAO'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"setSeeder"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenSetSeeder(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setSeeder'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'setSeeder',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'setSeeder'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link nounsTokenABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function usePrepareNounsTokenTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof nounsTokenABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof nounsTokenABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"Approval"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"ApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"DelegateChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDelegateChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'DelegateChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'DelegateChanged',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'DelegateChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"DelegateVotesChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDelegateVotesChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'DelegateVotesChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'DelegateVotesChanged',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'DelegateVotesChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"DescriptorLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDescriptorLockedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'DescriptorLocked'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'DescriptorLocked',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'DescriptorLocked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"DescriptorUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenDescriptorUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'DescriptorUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'DescriptorUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'DescriptorUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"MinterLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenMinterLockedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'MinterLocked'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'MinterLocked',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'MinterLocked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"MinterUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenMinterUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'MinterUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'MinterUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'MinterUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"NounBurned"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenNounBurnedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'NounBurned'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'NounBurned',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'NounBurned'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"NounCreated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenNounCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'NounCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'NounCreated',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'NounCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"NoundersDAOUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenNoundersDaoUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'NoundersDAOUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'NoundersDAOUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'NoundersDAOUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"SeederLocked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSeederLockedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'SeederLocked'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'SeederLocked',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'SeederLocked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"SeederUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenSeederUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'SeederUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'SeederUpdated',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'SeederUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link nounsTokenABI}__ and `eventName` set to `"Transfer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03)
 */
export function useNounsTokenTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof nounsTokenABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof nounsTokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: nounsTokenABI,
    address: nounsTokenAddress[1],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof nounsTokenABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as UseContractReadConfig<
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'contractName',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'contractVersion',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'dropMetadataRenderer',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'editionMetadataRenderer',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'implementation',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof zoraNftCreatorABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
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
  config: Omit<
    UseContractReadConfig<typeof zoraNftCreatorABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractRead({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<
    typeof zoraNftCreatorABI,
    TFunctionName,
    TSelectData
  >)
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
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'createAndConfigureDrop'
        >['request']['abi'],
        'createAndConfigureDrop',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createAndConfigureDrop'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'createAndConfigureDrop',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createAndConfigureDrop'
      } = {} as any,
) {
  return useContractWrite<
    typeof zoraNftCreatorABI,
    'createAndConfigureDrop',
    TMode
  >({
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
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'createDrop'
        >['request']['abi'],
        'createDrop',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createDrop' }
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'createDropWithReferral'
        >['request']['abi'],
        'createDropWithReferral',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createDropWithReferral'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'createDropWithReferral',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createDropWithReferral'
      } = {} as any,
) {
  return useContractWrite<
    typeof zoraNftCreatorABI,
    'createDropWithReferral',
    TMode
  >({
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
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'createEdition'
        >['request']['abi'],
        'createEdition',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createEdition'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'createEdition',
        TMode
      > & {
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'createEditionWithReferral'
        >['request']['abi'],
        'createEditionWithReferral',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'createEditionWithReferral'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'createEditionWithReferral',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createEditionWithReferral'
      } = {} as any,
) {
  return useContractWrite<
    typeof zoraNftCreatorABI,
    'createEditionWithReferral',
    TMode
  >({
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
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'renounceOwnership', TMode>(
    {
      abi: zoraNftCreatorABI,
      address: zoraNftCreatorAddress[1],
      functionName: 'renounceOwnership',
      ...config,
    } as any,
  )
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'setupDropsContract'
        >['request']['abi'],
        'setupDropsContract',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setupDropsContract'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'setupDropsContract',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setupDropsContract'
      } = {} as any,
) {
  return useContractWrite<
    typeof zoraNftCreatorABI,
    'setupDropsContract',
    TMode
  >({
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof zoraNftCreatorABI, 'transferOwnership', TMode>(
    {
      abi: zoraNftCreatorABI,
      address: zoraNftCreatorAddress[1],
      functionName: 'transferOwnership',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoraNftCreatorAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'upgradeTo'
        >['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
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
        PrepareWriteContractResult<
          typeof zoraNftCreatorABI,
          'upgradeToAndCall'
        >['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      }
    : UseContractWriteConfig<
        typeof zoraNftCreatorABI,
        'upgradeToAndCall',
        TMode
      > & {
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
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createAndConfigureDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateAndConfigureDrop(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoraNftCreatorABI,
      'createAndConfigureDrop'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createAndConfigureDrop',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'createAndConfigureDrop'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createDrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateDrop(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createDrop'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoraNftCreatorABI,
      'createDropWithReferral'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createDropWithReferral',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'createDropWithReferral'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"createEdition"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorCreateEdition(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'createEdition'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoraNftCreatorABI,
      'createEditionWithReferral'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'createEditionWithReferral',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'createEditionWithReferral'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoraNftCreatorABI,
      'renounceOwnership'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'renounceOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"setupDropsContract"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorSetupDropsContract(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoraNftCreatorABI,
      'setupDropsContract'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'setupDropsContract',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'setupDropsContract'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoraNftCreatorABI,
      'transferOwnership'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'transferOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function usePrepareZoraNftCreatorUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoraNftCreatorABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoraNftCreatorABI,
    'upgradeToAndCall'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zoraNftCreatorABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractEvent({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    ...config,
  } as UseContractEventConfig<typeof zoraNftCreatorABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoraNftCreatorABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xF74B146ce44CC162b601deC3BE331784DB111DC1)
 */
export function useZoraNftCreatorAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zoraNftCreatorABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UseContractEventConfig<typeof zoraNftCreatorABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UseContractEventConfig<typeof zoraNftCreatorABI, 'CreatedDrop'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UseContractEventConfig<typeof zoraNftCreatorABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
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
  config: Omit<
    UseContractEventConfig<typeof zoraNftCreatorABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoraNftCreatorAddress } = {} as any,
) {
  return useContractEvent({
    abi: zoraNftCreatorABI,
    address: zoraNftCreatorAddress[1],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof zoraNftCreatorABI, 'Upgraded'>)
}
