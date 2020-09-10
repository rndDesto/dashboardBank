const jsonServer = require("json-server");
const commandLineArgs = require("command-line-args");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");
const createDataset = require("./dataset");
const createAuthenticationHandler = require("./auth");
const buildSwaggerDocument = require("./api-docs");
const optionDefinitions = [
  { name: "enable-auth", type: Boolean },
  { name: "port", type: Number },
  { name: "transaction-sample-size", type: Number },
];
const options = commandLineArgs(optionDefinitions);
const PORT = options.port || 3000;

const auth = createAuthenticationHandler("secret_key");
const server = jsonServer.create();
const router = jsonServer.router(
  createDataset(options["transaction-sample-size"])
);
const middlewares = jsonServer.defaults();
const isAuthEnabled = options["enable-auth"];

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(jsonServer.rewriter(routes));
server.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    buildSwaggerDocument(`localhost:${PORT}`, isAuthEnabled),
    options
  )
);
if (isAuthEnabled) {
  server.post("/api/login", auth.loginHandler);
  server.use(auth.authMiddleware);
}

server.use(router);

server.listen(PORT, () => {
  console.log("Server is Running");
});
