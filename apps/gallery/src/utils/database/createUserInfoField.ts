import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";

/**
 * MongoDB aggregation pipeline stage that creates a userInfo field with userName precedence:
 * 1. userName (if exists and not empty, converted to lowercase)
 * 2. ensName (if exists and not empty)
 * 3. Short address format (first 6 chars + "..." + last 4 chars)
 * 
 * @param options - Configuration options
 * @param options.addressField - The field containing the user's address (default: "$address")
 * @param options.userArrayField - The array field from $lookup (default: "$userInfo")
 * @param options.userVariable - The variable name for the user data (default: "$$user")
 * @returns MongoDB aggregation stage object
 */
export const createUserInfoField = (options?: {
  addressField?: string | object;
  userArrayField?: string;
  userVariable?: string;
}) => {
  const {
    addressField = "$address",
    userArrayField = "$userInfo",
    userVariable = "$$user"
  } = options || {};

  // For address field, use as-is if it's a string starting with $, otherwise wrap in $toString
  const addressExpression = typeof addressField === 'string' && addressField.startsWith('$')
    ? addressField
    : typeof addressField === 'object'
      ? addressField
      : { $toString: addressField };

  return {
    userInfo: {
      $let: {
        vars: { user: { $arrayElemAt: [userArrayField, 0] } },
        in: {
          address: addressExpression,
          userName: {
            $cond: {
              if: {
                $and: [
                  { $ne: [`${userVariable}.userName`, null] },
                  { $ne: [`${userVariable}.userName`, ""] },
                  { $ne: [{ $type: `${userVariable}.userName` }, "missing"] }
                ]
              },
              then: { $toLower: `${userVariable}.userName` },
              else: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: [`${userVariable}.ensName`, null] },
                      { $ne: [`${userVariable}.ensName`, ""] },
                      { $ne: [{ $type: `${userVariable}.ensName` }, "missing"] }
                    ]
                  },
                  then: `${userVariable}.ensName`,
                  else: {
                    $concat: [
                      { $substr: [addressExpression, 0, 6] },
                      "...",
                      { $substr: [addressExpression, -4, 4] },
                    ],
                  },
                },
              },
            },
          },
          profilePic: {
            $ifNull: [
              `${userVariable}.profilePic`,
              {
                $ifNull: [
                  `${userVariable}.ensAvatar`,
                  DEFAULT_PROFILE_PICTURE,
                ],
              },
            ],
          },
          about: `${userVariable}.about`,
          twitter: `${userVariable}.twitter`,
          farcaster: `${userVariable}.farcaster`,
        },
      },
    },
  };
};