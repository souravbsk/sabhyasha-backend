const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const collections = require("./collections");
const { getSabhyashadb } = require("./db");
require('dotenv').config();
const bcrypt = require('bcryptjs');



// Passport Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ["profile", "email"]
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const sabhyashadb = getSabhyashadb();
        const usersCollection = sabhyashadb.collection(collections.users);

        let user = await usersCollection.findOne({ googleId: profile.id });

        if (!user) {
    const username = await profile?.emails[0]?.value?.split('@')[0];

          const user = {
                googleId: profile.id,
                displayName: profile.displayName,
                username:username,
                email: profile?.emails[0]?.value,
                isEmailVerify:profile?.emails[0]?.verified,
                avatar:profile?.photos[0]?.value,
                role: "user"
            };

            await usersCollection.insertOne(user);
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));


// Passport Local strategy

passport.use(new LocalStrategy(async (username, password, done) => {
    console.log(username)
    try {
        const sabhyashadb = getSabhyashadb();
        const usersCollection = sabhyashadb.collection(collections.users);
        // Check if username matches
        let user = await usersCollection.findOne({ username: username });
        // If username doesn't match, check if email matches
        if (!user) {
            user = await usersCollection.findOne({ email: username });
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username or email.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (err) {
        return done(err);
    }
}));






passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});











// passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
//     try {
//         const sabhyashadb = getSabhyashadb();
//         const usersCollection = sabhyashadb.collection(collections.users);
//         const user = await usersCollection.findOne({ email: email });
//         if (!user) {
//             return done(null, false, { message: 'Incorrect email.' });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (isPasswordValid) {
//             return done(null, user);
//         } else {
//             return done(null, false, { message: 'Incorrect password.' });
//         }
//     } catch (err) {
//         return done(err);
//     }
// }));
