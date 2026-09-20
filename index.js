const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_API = "https://discord.com/api/v10";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(express.static(root));

app.get("/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
    response_type: "code",
    scope: "identify email guilds",
  });

  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_REDIRECT_URI) {
    return res.status(500).send("Discord OAuth is not configured. Check your .env file.");
  }

  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
});

app.get("/auth/discord/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Missing Discord authorization code.");
    }

    const tokenBody = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || "",
      client_secret: process.env.DISCORD_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      code: String(code),
      redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
    });

    const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Discord token error:", tokenData);
      return res.status(401).send("Discord login failed.");
    }

    const userResponse = await fetch(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    const user = await userResponse.json();

    if (!userResponse.ok) {
      return res.status(401).send("Could not retrieve your Discord account.");
    }

    let guilds = [];
    if (tokenData.scope && tokenData.scope.includes("guilds")) {
      const guildResponse = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: {
          Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
        },
      });

      if (guildResponse.ok) {
        guilds = await guildResponse.json();
      }
    }

    req.session.discordUser = {
      id: user.id,
      username: user.username,
      global_name: user.global_name || user.username,
      avatar: user.avatar || null,
      email: user.email || null,
      guilds,
    };

    res.redirect("/dashboard.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred during Discord login.");
  }
});

app.get("/api/me", (req, res) => {
  if (!req.session.discordUser) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: req.session.discordUser,
  });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Identity website running on http://localhost:${PORT}`);
});
