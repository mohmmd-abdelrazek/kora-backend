"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// Database connection
// Assuming you have initialized and exported a Pool instance from 'src/db/index.ts'
const pgConfig_1 = __importDefault(require("./pgConfig"));
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email", // Use 'email' instead of 'username'
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const res = await pgConfig_1.default.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (res.rows.length > 0) {
            const user = res.rows[0];
            if (bcryptjs_1.default.compareSync(password, user.password)) {
                done(null, user);
            }
            else {
                done(null, false, { message: "Invalid password." });
            }
        }
        else {
            done(null, false, { message: "Invalid email" });
        }
    }
    catch (err) {
        done(err);
    }
}));
// // Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         if (!profile.emails || profile.emails.length === 0) {
//           return done(null, undefined, {
//             message: "No email found from Google account.",
//           }); // Modified line
//         }
//         const email = profile.emails[0].value;
//         let res = await pool.query("SELECT * FROM users WHERE google_id = $1", [
//           profile.id,
//         ]);
//         if (res.rows.length === 0) {
//           // If the user doesn't exist, create a new user record
//           res = await pool.query(
//             "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *",
//             [profile.id, email, profile.displayName]
//           );
//         }
//         const user: Express.User = res.rows[0];
//         done(null, user); // This is correct
//       } catch (err) {
//         done(err as Error, undefined);
//       }
//     }
//   )
// );
// Serialization and Deserialization
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const res = await pgConfig_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
        if (res.rows.length > 0) {
            const user = res.rows[0];
            done(null, user); // Correct usage
        }
        else {
            done(null, false); // Correctly indicate no user found without an error
        }
    }
    catch (err) {
        done(err); // Pass only the error if an exception occurred
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passportConfig.js.map