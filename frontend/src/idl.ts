export const PROGRAM_ID = "BGewPFMdAV2kwwfhxAbqGq4bohXsiB9LZmSw8R99QmZ8";

export const IDL = {
  "version": "0.1.0",
  "name": "escrow_project",
  "instructions": [
    {
      "name": "buy_listing",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "system_program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancel_listing",
      "accounts": [
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "create_listing",
      "accounts": [
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "system_program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "buyer",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "sold",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadySold",
      "msg": "This listing has already been sold"
    }
  ]
} as const;
