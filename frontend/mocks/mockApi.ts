/* eslint-disable */
/* tslint:disable */

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
// server.use((req, res, next) => {
//   const body = req.body;
//   if (req.method === "POST") {
//     req.body.createdAt = Date.now();
//     res.json({ message: "User created successfully", name: req.body.name });
//   }
//   // Continue to JSON Server router
//   next();
// });

server.post("/login", (req, res) => {
  const email = req.body.email;
  const user = db.get("users").finde({ email }).value();
  res.json({ message: "User created successfully", user });
});

server.post("/signup", async (req, res) => {
  const users = db.get("users").value();
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  db.get("users").push({ id: users.length, email, password, name }).write();
  res.json({ message: "User created successfully" });
});

server.use("/api", router);

server.listen(8000, () => {
  console.log("JSON Server is running");
});
