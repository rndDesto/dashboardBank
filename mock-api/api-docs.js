module.exports = (baseUrl, enableAuth) => {
  const securityOpts = enableAuth
    ? {
        security: [
          {
            bearerAuth: [],
          },
        ],
      }
    : {};

  const loginEndpoint = enableAuth
    ? {
        "/login": {
          post: {
            summary: "User Authorization",
            tags: ["Authorization"],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthorizationRequest",
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/AuthorizationResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Username or password that provided is not valid",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/AuthorizationError",
                    },
                  },
                },
              },
            },
          },
        },
      }
    : {};
  return {
    openapi: "3.0.0",
    info: {
      description: "Online Banking API",
      title: "Online Banking API",
      version: "v1",
    },
    components: {
      parameters: {
        page: {
          in: "query",
          name: "_page",
          required: false,
          type: "integer",
          description:
            "Use _page and optionally _limit to paginate returned data",
        },
        limit: {
          in: "query",
          name: "_limit",
          required: false,
          type: "integer",
          description:
            "Use _page and optionally _limit to paginate returned data",
        },
        sort: {
          in: "query",
          name: "_sort",
          required: false,
          type: "string",
          description:
            "Sets of field separate by comma(,) ,used for sort the value",
        },
        order: {
          in: "query",
          name: "_order",
          required: false,
          type: "string",
          description: "One of `asc` or `desc`",
          enum: ["asc", "desc"],
        },
        search: {
          in: "query",
          name: "q",
          type: "string",
          description: "Full-text searching",
        },
      },
      responses: {
        "401": {
          description: "no valid `access_token` provided as bearer token",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthorizationError",
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
        },
      },
      schemas: {
        AuthorizationError: {
          properties: {
            message: {
              type: "string",
            },
          },
        },
        Bank: {
          properties: {
            name: {
              type: "string",
            },
            code: {
              type: "string",
            },
          },
        },
        CreateTransactionRequest: {
          properties: {
            accountNumber: {
              type: "string",
            },
            receiver: {
              type: "object",
              properties: {
                accountNumber: {
                  type: "string",
                },
                bankCode: {
                  type: "string",
                },
              },
            },
            transactionCode: {
              type: "string",
            },
            amount: {
              type: "number",
            },
          },
        },
        AuthorizationRequest: {
          properties: {
            username: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
        AuthorizationResponse: {
          properties: {
            accessToken: {
              type: "string",
            },
          },
        },
        TransactionType: {
          properties: {
            id: { type: "integer" },
            code: { type: "string" },
            description: { type: "string" },
          },
        },
        Account: {
          properties: {
            id: {
              type: "string",
            },
            accountNumber: { type: "string" },
            balance: { type: "integer" },
            currency: { type: "string" },
          },
        },
        Transaction: {
          properties: {
            id: {
              type: "string",
            },
            date: {
              type: "string",
            },
            amount: {
              type: "number",
            },
            currency: {
              type: "string",
            },
            transactionCode: {
              type: "string",
            },
            accountNumber: {
              type: "string",
            },
            sender: {
              type: "object",
              properties: {
                bankCode: {
                  type: "integer",
                },
                accountNumber: {
                  type: "string",
                },
                accountHolderName: {
                  type: "string",
                },
              },
            },
            receiver: {
              type: "object",
              properties: {
                bankCode: {
                  type: "integer",
                },
                accountNumber: {
                  type: "string",
                },
                accountHolderName: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    servers: [
      {
        url: `http://${baseUrl}/api`,
      },
    ],
    paths: {
      ...loginEndpoint,
      "/secure/_self/transaction/": {
        get: {
          ...securityOpts,
          tags: ["User Information"],
          summary: "Get list of current session Transaction",
          parameters: [
            { $ref: "#/components/parameters/page" },
            { $ref: "#/components/parameters/limit" },
            { $ref: "#/components/parameters/order" },
            { $ref: "#/components/parameters/sort" },
            { $ref: "#/components/parameters/search" },
          ],
          responses: {
            "200": {
              description: "Success Response",
              content: {
                "application/json": {
                  content: { "application/json": {} },
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Transaction",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
        post: {
          ...securityOpts,
          tags: ["User Actions"],
          summary: "Create a new transaction",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateTransactionRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "the transaction successfully stored",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Transaction",
                  },
                },
              },
            },
            401: {
              $ref: "#/components/responses/401",
            },
          },
        },
      },
      "/secure/_self/transaction/{transactionId}": {
        get: {
          ...securityOpts,
          summary: "Get single transaction record",
          tags: ["User Information"],
          parameters: [
            {
              in: "path",
              name: "transactionId",
              required: true,
            },
          ],
          responses: {
            "200": {
              description: "Transaction object",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
      },
      "/secure/_self/account": {
        get: {
          ...securityOpts,
          summary: "Get list of user's account",
          tags: ["User Information"],
          parameters: [
            { $ref: "#/components/parameters/page" },
            { $ref: "#/components/parameters/limit" },
            { $ref: "#/components/parameters/order" },
            { $ref: "#/components/parameters/sort" },
            { $ref: "#/components/parameters/search" },
          ],
          responses: {
            "200": {
              description: "Success returning list of account",
              content: {
                "application/json": {
                  content: { "application/json": {} },
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Account",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
      },

      "/secure/system/transaction-type": {
        get: {
          ...securityOpts,
          summary: "List of transaction type",
          tags: ["System Environment"],
          parameters: [
            { $ref: "#/components/parameters/page" },
            { $ref: "#/components/parameters/limit" },
            { $ref: "#/components/parameters/order" },
            { $ref: "#/components/parameters/sort" },
            { $ref: "#/components/parameters/search" },
          ],
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/TransactionType",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
      },
      "/secure/system/bank": {
        get: {
          ...securityOpts,
          summary: "List of banks",
          tags: ["System Environment"],
          parameters: [
            { $ref: "#/components/parameters/page" },
            { $ref: "#/components/parameters/limit" },
            { $ref: "#/components/parameters/order" },
            { $ref: "#/components/parameters/sort" },
            { $ref: "#/components/parameters/search" },
          ],
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Bank",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
      },
      "/secure/system/bank/code/{code}": {
        get: {
          ...securityOpts,
          summary: "Get Bank from their bank code",
          tags: ["System Environment"],
          parameters: [
            {
              in: "path",
              name: "code",
              type: "string",
              required: true,
            },
          ],
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Bank",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
      },
      "/secure/system/transaction-type/code/{code}": {
        get: {
          ...securityOpts,
          summary: "Get Transaction Type from their bank code",
          tags: ["System Environment"],
          parameters: [
            {
              in: "path",
              name: "code",
              type: "string",
              required: true,
            },
          ],
          responses: {
            "200": {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Bank",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/401",
            },
          },
        },
      },
    },
  };
};
