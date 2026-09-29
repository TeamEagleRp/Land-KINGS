require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = Number(process.env.PORT) || 3050;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CALLBACK_URL =
  process.env.DISCORD_CALLBACK_URL ||
  process.env.DISCORD_REDIRECT_URI ||
  `${BASE_URL}/auth/discord/callback`;

const DB_FILE = path.join(__dirname, 'data.json');

/* =========================================================
   صلاحيات المسؤولين
   ========================================================= */

const REGULAR_ADMIN_IDS = [
  '1525706817559203972',
  '1277935535893119067',
  '1086126761651216584',
  '424596757478113300',
  '426970269241049088',
  '1443579668195315844',
  '1521892362152968195'
];

const SUPER_ADMIN_IDS = [
  '1521892362152968195',
  '1443579668195315844'
];

const envAdminIds = String(
  process.env.ADMIN_IDS ||
  process.env.ADMINISTRATOR_IDS ||
  ''
)
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

const envSuperAdminIds = String(
  process.env.SUPER_ADMIN_IDS ||
  process.env.SUPER_ADMIN_ID ||
  ''
)
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

const ADMIN_IDS = [
  ...new Set([
    ...REGULAR_ADMIN_IDS,
    ...envAdminIds,
    ...SUPER_ADMIN_IDS,
    ...envSuperAdminIds
  ])
];


/* =========================================================
   قاعدة البيانات
   ========================================================= */

function readDb() {
  try {
    return JSON.parse(
      fs.readFileSync(DB_FILE, 'utf8')
    );
  } catch {
    return {
      achievements: [],
      founders: [],
      admins: [],
      logs: []
    };
  }
}

function writeDb(db) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(db, null, 2),
    'utf8'
  );
}

const db = readDb();

db.achievements ||= [];
db.founders ||= [];
db.admins ||= [];
db.adminRoles ||= {};
db.logs ||= [];

// الحفاظ على المؤسسين الموجودين وعدم استبدالهم.
if (db.founders.length === 0) {
  db.founders = [
    { id: 'default-1', name: '# BiN ShaBiB .', username: 'only305', image: '1.png' },
    { id: 'default-2', name: 'only305', username: '.1wc', image: '2.png' },
    { id: 'default-3', name: 'NyrShmRr .', username: 'x679', image: '3.png' },
    { id: 'default-4', name: '# Tariq 🇩🇰 .', username: 'c7xc.', image: '4.png' },
    { id: 'default-5', name: '# - الـشـايـب الـمـسـتـقـعـد ˢ⁷', username: 'b.j8', image: '5.png' },
    { id: 'default-6', name: 'S5R !', username: 'cefl.', image: '6.png' }
  ];
}

for (const id of ADMIN_IDS) {
  if (!db.admins.includes(id)) db.admins.push(id);
  if (!db.adminRoles[id]) {
    db.adminRoles[id] = SUPER_ADMIN_IDS.includes(id) ? 'superadmin' : 'admin';
  }
}

writeDb(db);


/* =========================================================
   Express
   ========================================================= */

app.set('trust proxy', 1);

app.use(
  express.json({
    limit: '12mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '12mb'
  })
);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'change-this-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure:
        process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());


/* =========================================================
   Discord OAuth
   ========================================================= */

if (
  !process.env.DISCORD_CLIENT_ID ||
  !process.env.DISCORD_CLIENT_SECRET
) {
  console.warn(
    'Discord OAuth is not configured. Check DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in .env'
  );
}

passport.use(
  new DiscordStrategy(
    {
      clientID:
        process.env.DISCORD_CLIENT_ID,
      clientSecret:
        process.env.DISCORD_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ['identify']
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser(
  (user, done) => done(null, user)
);

passport.deserializeUser(
  (user, done) => done(null, user)
);


/* =========================================================
   المستخدم والصلاحيات
   ========================================================= */

function currentRole(id) {
  if (!id) return 'user';

  const userId = String(id);

  if (SUPER_ADMIN_IDS.includes(userId)) {
    return 'superadmin';
  }

  if (db.adminRoles?.[userId] === 'superadmin') {
    return 'superadmin';
  }

  if (db.admins.includes(userId)) {
    return db.adminRoles?.[userId] || 'admin';
  }

  return 'user';
}

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: 'يجب تسجيل الدخول عبر ديسكورد.'
  });
}

function requireAdmin(req, res, next) {
  if (
    req.isAuthenticated() &&
    ['admin', 'superadmin'].includes(
      currentRole(req.user.id)
    )
  ) {
    return next();
  }

  return res.status(403).json({
    error: 'هذا الإجراء للمسؤولين فقط.'
  });
}

function requireSuper(req, res, next) {
  if (
    req.isAuthenticated() &&
    currentRole(req.user.id) === 'superadmin'
  ) {
    return next();
  }

  return res.status(403).json({
    error: 'هذه الصفحة للمسؤولين الأعلى فقط.'
  });
}

function avatarFor(user) {
  if (!user?.avatar) {
    return 'https://cdn.discordapp.com/embed/avatars/0.png';
  }

  const extension = user.avatar.startsWith('a_')
    ? 'gif'
    : 'png';

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`;
}

function actor(req) {
  return {
    id: String(req.user.id),
    username:
      req.user.global_name ||
      req.user.username,
    avatar: avatarFor(req.user)
  };
}

function logAction(req, action, details) {
  db.logs.unshift({
    id:
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8),
    action,
    details,
    actor: actor(req),
    at: new Date().toISOString()
  });

  db.logs = db.logs.slice(0, 1000);

  writeDb(db);
}


/* =========================================================
   الصفحات
   ========================================================= */

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'index.html')
  );
});

app.get('/auth/discord',
  passport.authenticate('discord')
);

app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/'
  }),
  (req, res) => {
    const role = currentRole(req.user?.id);

    if (role !== 'user') {
      logAction(
        req,
        'تسجيل دخول مسؤول',
        `تم تسجيل دخول ${role === 'superadmin' ? 'مسؤول أعلى' : 'مسؤول عادي'} عبر Discord`
      );
    }

    res.redirect('/dashboard.html');
  }
);

app.get(
  '/dashboard',
  requireAuth,
  (req, res) => {
    res.sendFile(
      path.join(__dirname, 'dashboard.html')
    );
  }
);

app.get(
  '/dashboard.html',
  requireAuth,
  (req, res) => {
    res.sendFile(
      path.join(__dirname, 'dashboard.html')
    );
  }
);

/*
  صفحة الإدارة العليا محمية من السيرفر نفسه.
  لا يمكن فتح admin.html مباشرة بدون Super Admin.
*/
app.get(
  '/admin.html',
  requireSuper,
  (req, res) => {
    res.sendFile(
      path.join(__dirname, 'admin.html')
    );
  }
);

app.get(
  '/admin',
  requireSuper,
  (req, res) => {
    res.sendFile(
      path.join(__dirname, 'admin.html')
    );
  }
);


app.get(
  '/logs.html',
  requireSuper,
  (req, res) => {
    res.sendFile(path.join(__dirname, 'logs.html'));
  }
);


/* =========================================================
   Static files
   ========================================================= */

app.use(
  express.static(__dirname, {
    index: false
  })
);


/* =========================================================
   Discord User
   ========================================================= */

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.json({
      authenticated: false
    });
  }

  const id = String(req.user.id);
  const role = currentRole(id);

  return res.json({
    authenticated: true,
    user: {
      id,
      username: req.user.username,
      global_name:
        req.user.global_name || null,
      displayName:
        req.user.global_name ||
        req.user.username,
      avatar: avatarFor(req.user),
      discriminator:
        req.user.discriminator || null,
      role,
      isAdmin: role !== 'user',
      isSuperAdmin: role === 'superadmin'
    }
  });
});


/* =========================================================
   الإنجازات
   ========================================================= */

app.get('/api/achievements', (req, res) => {
  res.json({
    achievements: db.achievements
  });
});

app.post(
  '/api/achievements',
  requireAdmin,
  (req, res) => {
    const {
      title,
      description,
      date,
      image
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'اسم الإنجاز والوصف مطلوبان.'
      });
    }

    const item = {
      id: Date.now().toString(36),
      title: String(title).trim(),
      description:
        String(description).trim(),
      date: String(date || '').trim(),
      image: String(image).trim(),
      createdAt:
        new Date().toISOString(),
      createdBy: actor(req)
    };

    db.achievements.push(item);
    writeDb(db);

    logAction(
      req,
      'إضافة إنجاز',
      `تمت إضافة الإنجاز: ${item.title}`
    );

    return res.json({
      ok: true,
      achievement: item
    });
  }
);

app.delete(
  '/api/achievements/:id',
  requireSuper,
  (req, res) => {
    const removed =
      db.achievements.find(
        item => item.id === req.params.id
      );

    const before =
      db.achievements.length;

    db.achievements =
      db.achievements.filter(
        item => item.id !== req.params.id
      );

    if (
      db.achievements.length === before
    ) {
      return res.status(404).json({
        error: 'الإنجاز غير موجود.'
      });
    }

    writeDb(db);

    logAction(
      req,
      'حذف إنجاز',
      `تم حذف الإنجاز: ${removed?.title || req.params.id}`
    );

    return res.json({
      ok: true
    });
  }
);


/* =========================================================
   المؤسسون
   ========================================================= */

app.get('/api/founders', (req, res) => {
  res.json({
    founders: db.founders
  });
});

app.post(
  '/api/founders',
  requireSuper,
  (req, res) => {
    const {
      name,
      username,
      image
    } = req.body;

    if (!name || !username) {
      return res.status(400).json({
        error: 'اسم الشخص واليوزر مطلوبان.'
      });
    }

    const item = {
      id: Date.now().toString(36),
      name: String(name).trim(),
      username: String(username).trim(),
      image: String(image || '').trim(),
      createdAt: new Date().toISOString(),
      createdBy: actor(req)
    };

    db.founders.unshift(item);
    writeDb(db);

    logAction(
      req,
      'إضافة مؤسس',
      `تمت إضافة: ${item.name} (${item.username})`
    );

    return res.json({
      ok: true,
      founder: item
    });
  }
);

app.delete(
  '/api/founders/:id',
  requireSuper,
  (req, res) => {
    const removed =
      db.founders.find(
        item => item.id === req.params.id
      );

    const before = db.founders.length;

    db.founders =
      db.founders.filter(
        item => item.id !== req.params.id
      );

    if (
      db.founders.length === before
    ) {
      return res.status(404).json({
        error: 'المؤسس غير موجود.'
      });
    }

    writeDb(db);

    logAction(
      req,
      'حذف مؤسس',
      `تم حذف: ${removed?.name || req.params.id}`
    );

    return res.json({
      ok: true
    });
  }
);


/* =========================================================
   إدارة المسؤولين - Super Admin فقط
   ========================================================= */

app.get(
  '/api/admins',
  requireSuper,
  (req, res) => {
    res.json({
      admins: db.admins.map(id => ({
        id,
        role: currentRole(id),
        protected: SUPER_ADMIN_IDS.includes(id)
      }))
    });
  }
);

app.post(
  '/api/admins',
  requireSuper,
  (req, res) => {
    const id = String(req.body.id || '').trim();
    const role = req.body.role === 'superadmin' ? 'superadmin' : 'admin';

    if (!/^\d{15,22}$/.test(id)) {
      return res.status(400).json({
        error: 'أدخل Discord ID صحيح.'
      });
    }

    if (db.admins.includes(id) || SUPER_ADMIN_IDS.includes(id)) {
      return res.status(400).json({
        error: 'هذا الشخص مسؤول بالفعل.'
      });
    }

    db.admins.push(id);
    db.adminRoles[id] = role;
    writeDb(db);

    logAction(
      req,
      'إضافة مسؤول',
      `تمت إضافة مسؤول بصلاحية: ${role === 'superadmin' ? 'مسؤول أعلى' : 'مسؤول عادي'}`
    );

    return res.json({
      ok: true
    });
  }
);

app.delete(
  '/api/admins/:id',
  requireSuper,
  (req, res) => {
    const id = req.params.id;

    if (
      SUPER_ADMIN_IDS.includes(id)
    ) {
      return res.status(400).json({
        error:
          'لا يمكن إزالة مسؤول أعلى من هذه الصفحة.'
      });
    }

    const before = db.admins.length;

    db.admins = db.admins.filter(item => item !== id);
    delete db.adminRoles[id];

    if (before === db.admins.length) {
      return res.status(404).json({
        error: 'المسؤول غير موجود.'
      });
    }

    writeDb(db);

    logAction(
      req,
      'إزالة مسؤول',
      `تمت إزالة المسؤول ID: ${id}`
    );

    return res.json({
      ok: true
    });
  }
);


/* =========================================================
   سجل العمليات - Super Admin فقط
   ========================================================= */

app.get(
  '/api/logs',
  requireSuper,
  (req, res) => {
    res.json({
      logs: db.logs
    });
  }
);


/* =========================================================
   تسجيل الخروج
   ========================================================= */

function logout(req, res, next) {
  const wasAdmin = req.isAuthenticated() && currentRole(req.user?.id) !== 'user';

  if (wasAdmin) {
    logAction(
      req,
      'تسجيل خروج مسؤول',
      `تم تسجيل خروج ${currentRole(req.user.id) === 'superadmin' ? 'مسؤول أعلى' : 'مسؤول عادي'}`
    );
  }

  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
}

app.get('/auth/logout', logout);
app.post('/auth/logout', logout);


/* =========================================================
   تشغيل السيرفر
   ========================================================= */

app.listen(PORT, () => {
  console.log(
    `Land Kings website running on ${BASE_URL}`
  );

  console.log(
    `Discord OAuth callback: ${CALLBACK_URL}`
  );
});
