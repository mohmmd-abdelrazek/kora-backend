"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
// Database connection
// Assuming you have initialized and exported a Pool instance from 'src/db/index.ts'
const pgConfig_1 = __importDefault(require("./pgConfig"));
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email", // Use 'email' instead of 'username'
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield pgConfig_1.default.query("SELECT * FROM users WHERE email = $1", [
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
})));
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!profile.emails || profile.emails.length === 0) {
            return done(null, undefined, {
                message: "No email found from Google account.",
            }); // Modified line
        }
        const email = profile.emails[0].value;
        let res = yield pgConfig_1.default.query("SELECT * FROM users WHERE google_id = $1", [
            profile.id,
        ]);
        if (res.rows.length === 0) {
            // If the user doesn't exist, create a new user record
            res = yield pgConfig_1.default.query("INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *", [profile.id, email, profile.displayName]);
        }
        const user = res.rows[0];
        done(null, user); // This is correct
    }
    catch (err) {
        done(err, undefined);
    }
})));
// Serialization and Deserialization
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield pgConfig_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
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
}));
exports.default = passport_1.default;
//# sourceMappingURL=passportConfig.js.map