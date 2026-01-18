const path = require('path')
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

require("dotenv").config({
  path: path.resolve(process.cwd(), envFile),
});

const app = require('./app')
const connectDB = require('./config/db')
const PORT = process.env.PORT;

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

connectDB()

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})

