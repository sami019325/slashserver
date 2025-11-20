import bcrypt from "bcrypt";

const password = "adminpassword";
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
    console.log("Hashed password:", hash);
});
