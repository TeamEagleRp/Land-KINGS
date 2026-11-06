# Land Kings Website

موقع Land Kings مبني باستخدام Node.js وExpress مع تسجيل دخول Discord OAuth2.

## المتطلبات
- Node.js 18 أو أحدث
- تطبيق Discord Developer Portal مع OAuth2 (Identify)
- رابط callback مطابق تمامًا للقيمة المسجلة في Discord

## التشغيل محليًا
1. انسخ `.env.example` إلى ملف باسم `.env`.
2. أدخل بيانات Discord OAuth2 داخل `.env`.
3. نفّذ:
   ```bash
   npm install
   npm start
   ```
4. افتح `http://localhost:3050`.

## متغيرات البيئة
- `PORT`: المنفذ (الافتراضي 3050).
- `BASE_URL`: عنوان الموقع العام.
- `DISCORD_CLIENT_ID` و`DISCORD_CLIENT_SECRET`.
- `DISCORD_CALLBACK_URL`: يجب أن ينتهي بـ `/auth/discord/callback`.
- `SESSION_SECRET`: قيمة طويلة وعشوائية.
- `ADMINISTRATOR_IDS`: معرفات المسؤولين العاديين مفصولة بفواصل.
- `SUPER_ADMIN_IDS`: معرفات الإدارة العليا مفصولة بفواصل.

**مهم:** لا ترفع `.env` إلى GitHub ولا تشارك أسرار Discord. أضف المتغيرات من إعدادات الاستضافة (Render Environment).

## نشر المشروع على GitHub
من داخل مجلد المشروع:
```bash
git init
git add .
git commit -m "Update Land Kings website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```
إذا كان remote موجودًا مسبقًا، لا تكرر أمر `git remote add`؛ استخدم:
```bash
git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## إعداد Render
- Build Command: `npm install`
- Start Command: `npm start`
- أضف متغيرات `.env` إلى Environment في Render.
- اضبط `BASE_URL` على رابط Render، و`DISCORD_CALLBACK_URL` على:
  `https://YOUR-SERVICE.onrender.com/auth/discord/callback`
- أضف رابط callback نفسه في Discord Developer Portal.

## الصور
كل الصور المحلية موجودة داخل مجلد `assets/`.
