# Identity Website - Discord Login

## التشغيل

1. انسخ `.env.example` إلى ملف اسمه `.env`.
2. ضع بيانات Discord OAuth2 داخل `.env`.
3. في Discord Developer Portal أضف Redirect URI:
   `http://localhost:3000/auth/discord/callback`
4. شغّل:
   `npm install`
   ثم:
   `npm start`
5. افتح:
   `http://localhost:3000`

## مهم
DISCORD_CLIENT_SECRET موجود فقط في `.env` على السيرفر ولا يتم إرساله للمتصفح.
