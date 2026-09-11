import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, "user.json");

export function getUsers(callback) {
  fs.readFile(usersFilePath, "utf-8", (err, data) => {
    if (err) {
      return callback(err, null);
    }

    const users = JSON.parse(data);

    callback(null, users);
  });
}

export function saveUsers(users, callback) {
  fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return callback(err);
    }

    callback(null);
  });
}
