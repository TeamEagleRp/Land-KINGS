
/* =========================================================
   البيانات الافتراضية لمؤسسي الملوك فقط
   ========================================================= */

const defaultFounders = [
  {
    name: '# BiN ShaBiB .',
    description: 'يوزر ديسكورد: only305',
    image: '1.png'
  },
  {
    name: 'only305',
    description: 'يوزر ديسكورد: .1wc',
    image: '2.png'
  },
  {
    name: 'NyrShmRr .',
    description: 'يوزر ديسكورد: x679',
    image: '3.png'
  },
  {
    name: '# Tariq 🇩🇰 .',
    description: 'يوزر ديسكورد: c7xc.',
    image: '4.png'
  },
  {
    name: '# - الـشـايـب الـمـسـتـقـعـد ˢ⁷',
    description: 'يوزر ديسكورد: b.j8',
    image: '5.png'
  },
  {
    name: 'S5R !',
    description: 'يوزر ديسكورد: cefl.',
    image: '6.png'
  }
];


/* =========================================================
   حالة التطبيق
   ========================================================= */

const state = {
  adminMode: false,
  currentUser: null
};


/* =========================================================
   عناصر الصفحة
   ========================================================= */

const elements = {
  foundersGrid:
    document.getElementById('foundersGrid'),

  achievementsGrid:
    document.getElementById('achievementsGrid'),

  achievementAdmin:
    document.getElementById('achievementAdmin'),

  achievementForm:
    document.getElementById('achievementForm'),

  discordLoginBtn:
    document.getElementById('discordLoginBtn'),

  loginStatus:
    document.getElementById('loginStatus')
};


window.__landKingsState = state;


/* =========================================================
   تغيير حالة المسؤول
   ========================================================= */

window.__landKingsSetAdmin = function (enabled) {
  state.adminMode = Boolean(enabled);

  updateAdminVisibility();
  updateDiscordButton();
};


/* =========================================================
   حماية النصوص داخل HTML
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/* =========================================================
   إنشاء صورة للكروت
   ========================================================= */

function createCardImage(imageUrl, altText) {
  if (!imageUrl) {
    return `
      <div
        class="card-image"
        style="
          display:grid;
          place-items:center;
          background:linear-gradient(
            135deg,
            rgba(247,210,31,.24),
            rgba(255,255,255,.08)
          );
          color:#f7d21f;
          font-weight:800;
          font-size:2rem;
        "
      >
        LK
      </div>
    `;
  }

  return `
    <img
      class="card-image"
      src="${escapeHtml(imageUrl)}"
      alt="${escapeHtml(altText || '')}"
      loading="lazy"
    />
  `;
}


/* =========================================================
   مؤسسي الملوك
   ========================================================= */

async function renderFounders() {
  if (!elements.foundersGrid) return;

  try {
    const response = await fetch('/api/founders', {
      credentials: 'same-origin',
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to load founders');

    const data = await response.json();
    const founders = Array.isArray(data.founders) ? data.founders : [];
    const list = founders.length ? founders : defaultFounders;

    elements.foundersGrid.innerHTML = list.map(person => {
      const username = person.username || ((person.description || '').match(/[:：]\s*(.+)$/) || [])[1] || '';
      const image = person.image || '';

      return `
        <article class="content-card founder-card">
          ${image
            ? `<img class="card-image" src="${escapeHtml(image)}" alt="${escapeHtml(person.name || 'Founder')}" loading="lazy">`
            : `<div class="founder-no-image card-image">LK</div>`}
          <div class="card-body">
            <h3>${escapeHtml(person.name || '')}</h3>
            ${username ? `
              <div class="discord-pill" role="img" aria-label="Discord username">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.08.037c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.405-.405-.874-.617-1.249a.077.077 0 00-.08-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.045-.319 13.533.099 17.946a.082.082 0 00.03.056 19.99 19.99 0 005.993 3.06.077.077 0 00.084-.027c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.105 13.09 13.09 0 01-1.872-.89.077.077 0 01-.007-.128c.126-.095.252-.192.37-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009c.12.1.246.197.373.292a.077.077 0 01-.006.128c-.605.39-1.25.73-1.872.89a.076.076 0 00-.04.106c.36.7.773 1.366 1.225 1.995a.077.077 0 00.084.028 19.978 19.978 0 005.994-3.06.077.077 0 00.03-.055c.5-5.057-.838-9.5-3.548-13.55a.061.061 0 00-.03-.028zM8.02 15.331c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.952-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.419 0 1.333-.947 2.418-2.156 2.418zm7.974 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.952-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.419 0 1.333-.947 2.418-2.156 2.418z"/>
                </svg>
                <span class="pill-username">${escapeHtml(username)}</span>
              </div>` : ''}
          </div>
        </article>`;
    }).join('');
  } catch (error) {
    console.error('Founders loading error:', error);
    elements.foundersGrid.innerHTML = defaultFounders.map(person => {
      const username = (person.username || (person.description || '').match(/[:：]\s*(.+)$/)?.[1] || '');
      const image = person.image || '1.png';
      return `
        <article class="content-card founder-card">
          <img class="card-image" src="${escapeHtml(image)}" alt="${escapeHtml(person.name || 'Founder')}" loading="lazy">
          <div class="card-body">
            <h3>${escapeHtml(person.name || '')}</h3>
            ${username ? `<div class="discord-pill"><span class="pill-username">${escapeHtml(username)}</span></div>` : ''}
          </div>
        </article>`;
    }).join('');
  }
}

/* =========================================================
   إنجازات الملوك
   ========================================================= */

async function renderAchievements() {
  if (!elements.achievementsGrid) return;

  elements.achievementsGrid.innerHTML = `
    <div class="achievements-loading">
      جاري تحميل الإنجازات...
    </div>
  `;

  try {
    const response = await fetch(
      '/api/achievements',
      {
        credentials: 'same-origin',
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(
        'Failed to load achievements'
      );
    }

    const data = await response.json();

    const achievements =
      Array.isArray(data.achievements)
        ? data.achievements
        : [];

    /*
      لا توجد إنجازات افتراضية.
    */

    if (achievements.length === 0) {
      elements.achievementsGrid.innerHTML = `
        <div class="no-achievements">
          لا توجد إنجازات مضافة حاليًا.
        </div>
      `;

      return;
    }

    /*
      ترتيب تصاعدي حسب وقت الإضافة.
      الأول يظهر أولاً.
    */

    achievements.sort((a, b) => {
      const dateA =
        new Date(
          a.createdAt ||
          a.date ||
          0
        ).getTime();

      const dateB =
        new Date(
          b.createdAt ||
          b.date ||
          0
        ).getTime();

      return dateA - dateB;
    });

    elements.achievementsGrid.innerHTML = '';

    achievements.forEach(
      (achievement, index) => {

        const card =
          document.createElement(
            'article'
          );

        card.className =
          'content-card achievement-card';

        if (achievement.id) {
          card.dataset.id =
            achievement.id;
        }

        const image =
          achievement.image || '';

        card.innerHTML = `

          ${
            image
              ? `
                <img
                  class="card-image achievement-image"
                  src="${escapeHtml(image)}"
                  alt="${escapeHtml(
                    achievement.title ||
                    'Achievement'
                  )}"
                  loading="lazy"
                >
              `
              : `
                <div class="card-image achievement-no-image">
                  LK
                </div>
              `
          }

          <div class="card-body">

            <span class="achievement-number">
              إنجاز #${index + 1}
            </span>

            <h3>
              ${escapeHtml(
                achievement.title || ''
              )}
            </h3>

            <p>
              ${escapeHtml(
                achievement.description || ''
              )}
            </p>

            ${
              achievement.date
                ? `
                  <span class="achievement-date">
                    ${escapeHtml(
                      achievement.date
                    )}
                  </span>
                `
                : ''
            }

            ${
              achievement.createdBy
                ? `
                  <small class="achievement-creator">
                    أضيف بواسطة: ${escapeHtml(
                      achievement.createdBy.username || ''
                    )}
                  </small>
                `
                : ''
            }

            ${
              state.currentUser?.isSuperAdmin && achievement.id
                ? `
                  <button
                    type="button"
                    class="delete-achievement"
                    data-delete-achievement="${escapeHtml(
                      achievement.id
                    )}"
                  >
                    حذف الإنجاز
                  </button>
                `
                : ''
            }

          </div>
        `;

        elements.achievementsGrid
          .appendChild(card);
      }
    );

  } catch (error) {
    console.error(
      'Achievements loading error:',
      error
    );

    elements.achievementsGrid.innerHTML = `
      <div class="no-achievements">
        تعذر تحميل الإنجازات.
      </div>
    `;
  }
}


/* =========================================================
   الإدارة
   ========================================================= */

function updateAdminVisibility() {
  if (elements.achievementAdmin) {
    elements.achievementAdmin.classList.toggle(
      'hidden',
      !state.adminMode
    );
  }

  /*
    نعيد رسم الإنجازات حتى تظهر
    أزرار الحذف للمسؤول فقط.
  */

  renderAchievements();
}


function setLoginStatus(
  message,
  isError = false
) {
  if (!elements.loginStatus) return;

  elements.loginStatus.textContent =
    message;

  elements.loginStatus.style.color =
    isError
      ? '#ff8a80'
      : '#f7d21f';
}


function updateDiscordButton() {
  if (!elements.discordLoginBtn) return;

  let profile = document.getElementById('discordUserCard');

  if (!profile) {
    profile = document.createElement('div');
    profile.id = 'discordUserCard';
    profile.className = 'discord-user-card';
    elements.discordLoginBtn.parentElement?.insertBefore(
      profile,
      elements.discordLoginBtn
    );
  }

  if (state.currentUser) {
    const roleLabel =
      state.currentUser.role === 'superadmin'
        ? 'مسؤول أعلى'
        : state.currentUser.role === 'admin'
          ? 'مسؤول'
          : 'عضو';

    profile.innerHTML = `
      <img src="${escapeHtml(state.currentUser.avatar || '')}" alt="Discord Avatar">
      <div>
        <strong>${escapeHtml(state.currentUser.displayName || state.currentUser.username || 'Discord')}</strong>
        <small>الصلاحية: ${escapeHtml(roleLabel)}</small>
      </div>
    `;
    profile.classList.remove('hidden');

    elements.discordLoginBtn.textContent = 'تسجيل الخروج';
    elements.discordLoginBtn.classList.add('logged-in');
  } else {
    profile.classList.add('hidden');
    profile.innerHTML = '';

    elements.discordLoginBtn.textContent =
      'تسجيل دخول عبر ديسكورد';

    elements.discordLoginBtn.classList.remove(
      'logged-in'
    );
  }
}


/* =========================================================
   إضافة إنجاز
   ========================================================= */

async function fileToBase64(file) {
  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(
          new Error(
            'فشل في قراءة الصورة'
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}


async function handleAchievementSubmit(
  event
) {
  event.preventDefault();

  /*
    حماية الواجهة.
  */

  if (!state.adminMode) {
    setLoginStatus(
      'هذا القسم متاح للمسؤولين فقط.',
      true
    );

    return;
  }

  const form =
    event.currentTarget;

  const formData =
    new FormData(form);

  const title =
    String(
      formData.get('title') || ''
    ).trim();

  const description =
    String(
      formData.get('description') || ''
    ).trim();

  const date =
    String(
      formData.get('date') || ''
    ).trim();

  const imageFile = formData.get('imageFile');


  if (!title) {
    setLoginStatus(
      'يرجى كتابة اسم الإنجاز.',
      true
    );

    return;
  }


  if (!description) {
    setLoginStatus(
      'يرجى كتابة وصف الإنجاز.',
      true
    );

    return;
  }


  /* رفع صورة اختياري. */
  let imageUrl = '';


  if (
    imageFile instanceof File &&
    imageFile.size > 0
  ) {

    try {

      imageUrl =
        await fileToBase64(
          imageFile
        );

    } catch (error) {

      console.error(
        'Image read error:',
        error
      );

      setLoginStatus(
        'تعذر قراءة الصورة.',
        true
      );

      return;
    }
  }





  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );


  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      'جاري إضافة الإنجاز...';
  }


  try {

    const response =
      await fetch(
        '/api/achievements',
        {
          method: 'POST',

          credentials:
            'same-origin',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            title,
            description,
            date,
            image: imageUrl
          })
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.error ||
        result.message ||
        'تعذر حفظ الإنجاز.'
      );
    }


    form.reset();


    await renderAchievements();


    setLoginStatus(
      'تمت إضافة الإنجاز بنجاح.'
    );

  } catch (error) {

    console.error(
      'Achievement save error:',
      error
    );

    setLoginStatus(
      error.message ||
      'حدث خطأ أثناء حفظ الإنجاز.',
      true
    );

  } finally {

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent =
        'إضافة الإنجاز';
    }
  }
}


/* =========================================================
   حذف الإنجازات
   ========================================================= */

function setupAchievementDelete() {

  if (
    window.__achievementDeleteSetup
  ) {
    return;
  }

  window.__achievementDeleteSetup =
    true;


  document.addEventListener(
    'click',
    async event => {

      const button =
        event.target.closest(
          '[data-delete-achievement]'
        );

      if (!button) return;


      if (!state.adminMode) {

        setLoginStatus(
          'هذا الإجراء متاح للمسؤولين فقط.',
          true
        );

        return;
      }


      const achievementId =
        button.dataset
          .deleteAchievement;


      if (!achievementId) {
        return;
      }


      const confirmed =
        confirm(
          'هل تريد حذف هذا الإنجاز؟'
        );


      if (!confirmed) {
        return;
      }


      try {

        const response =
          await fetch(
            '/api/achievements/' +
              encodeURIComponent(
                achievementId
              ),
            {
              method: 'DELETE',
              credentials:
                'same-origin'
            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.error ||
            result.message ||
            'تعذر حذف الإنجاز.'
          );
        }


        await renderAchievements();


        setLoginStatus(
          'تم حذف الإنجاز بنجاح.'
        );

      } catch (error) {

        console.error(
          'Achievement delete error:',
          error
        );

        setLoginStatus(
          error.message ||
          'حدث خطأ أثناء حذف الإنجاز.',
          true
        );
      }
    }
  );
}


/* =========================================================
   تسجيل الدخول عبر Discord OAuth
   ========================================================= */

function updateSuperAdminLink() {
  const isSuper = Boolean(state.currentUser?.isSuperAdmin);
  document.querySelectorAll('#superAdminLink, #superLogsLink').forEach(link => {
    link.classList.toggle('hidden', !isSuper);
  });
}


async function setupDiscordLogin() {
  if (elements.discordLoginBtn) {
    elements.discordLoginBtn.addEventListener(
      'click',
      () => {
        if (state.currentUser) {
          window.location.href =
            '/auth/logout';
          return;
        }

        window.location.href =
          '/auth/discord';
      }
    );
  }

  try {
    const response = await fetch(
      '/api/user',
      {
        credentials: 'same-origin',
        cache: 'no-store'
      }
    );

    const data = await response.json();

    if (
      !data.authenticated ||
      !data.user
    ) {
      state.currentUser = null;
      state.adminMode = false;

      delete document.body.dataset.discordUserId;
      window.__landKingsUser = null;

      updateDiscordButton();
      updateSuperAdminLink();
      updateAdminVisibility();
      return;
    }

    const user = data.user;

    /*
      Discord user الكامل، بما فيه الـID،
      محفوظ في حالة التطبيق.
    */
    state.currentUser = user;
    state.adminMode = user.role === 'admin' || user.role === 'superadmin';

    window.__landKingsUser = user;
    document.body.dataset.discordUserId =
      String(user.id);

    console.log(
      'Logged in Discord user:',
      user
    );
    console.log(
      'Discord User ID:',
      user.id
    );
    console.log(
      'Role:',
      user.role
    );

    updateDiscordButton();
    updateSuperAdminLink();
    updateAdminVisibility();

  } catch (error) {
    console.error(
      'Discord session check failed:',
      error
    );

    state.currentUser = null;
    state.adminMode = false;

    delete document.body.dataset.discordUserId;
    window.__landKingsUser = null;

    updateDiscordButton();
    updateSuperAdminLink();
    updateAdminVisibility();
  }
}


/* =========================================================
   التنقل بين الصفحات
   ========================================================= */

function switchLandKingsPage(
  targetPageId
) {

  const navLinks =
    document.querySelectorAll(
      '.nav-link'
    );


  const pages =
    document.querySelectorAll(
      'main .hero-section, main .content-section'
    );


  if (
    !targetPageId ||
    !navLinks.length ||
    !pages.length
  ) {
    return;
  }


  pages.forEach(page => {

    const isActive =
      page.id === targetPageId;


    page.classList.toggle(
      'active-page',
      isActive
    );


    page.style.display =
      isActive
        ? 'block'
        : 'none';
  });


  navLinks.forEach(link => {

    const isActive =
      link.getAttribute(
        'data-page'
      ) === targetPageId;


    link.classList.toggle(
      'active',
      isActive
    );
  });


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


window.switchLandKingsPage =
  switchLandKingsPage;


function attachPageNavigation() {

  const navLinks =
    document.querySelectorAll(
      '.nav-link'
    );


  if (!navLinks.length) {
    return;
  }


  navLinks.forEach(link => {

    link.addEventListener(
      'click',
      event => {

        event.preventDefault();


        const targetPage =
          link.getAttribute(
            'data-page'
          );


        if (targetPage) {

          switchLandKingsPage(
            targetPage
          );
        }
      }
    );
  });
}


/* =========================================================
   Sidebar
   ========================================================= */

function toggleSidebar(open) {

  const sidebar =
    document.getElementById(
      'sidebar'
    );


  if (!sidebar) {
    return;
  }


  sidebar.classList.toggle(
    'open',
    open === undefined
      ? !sidebar.classList.contains(
          'open'
        )
      : Boolean(open)
  );
}


/* =========================================================
   Explore
   ========================================================= */

function showSectionsTable(
  show
) {

  const wrapper =
    document.getElementById(
      'sectionsTableWrap'
    );


  if (!wrapper) {
    return;
  }


  const isHidden =
    wrapper.classList.contains(
      'hidden'
    );


  const shouldShow =
    show === undefined
      ? isHidden
      : Boolean(show);


  wrapper.classList.toggle(
    'hidden',
    !shouldShow
  );


  if (!shouldShow) {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}


/* =========================================================
   التهيئة
   ========================================================= */

function initializeForms() {

  if (
    elements.achievementForm
  ) {

    elements.achievementForm
      .addEventListener(
        'submit',
        handleAchievementSubmit
      );
  }


  setupAchievementDelete();
}


async function initialize() {

  if (
    window.__landKingsInitialized
  ) {
    return;
  }


  window.__landKingsInitialized =
    true;


  attachPageNavigation();


  initializeForms();


  /*
    عرض مؤسسي الملوك.
  */

  renderFounders();


  /*
    تسجيل الدخول أولاً.
    بعد معرفة المسؤول يتم عرض
    أدوات الإدارة.
  */

  await setupDiscordLogin();

  updateSuperAdminLink();


  /*
    عرض الإنجازات.
  */

  renderAchievements();


  /*
    تحديث زر Discord.
  */

  updateDiscordButton();
}


/* =========================================================
   Hamburger + Explore
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const hamburger =
      document.getElementById(
        'hamburgerBtn'
      );


    const closeSidebar =
      document.getElementById(
        'closeSidebar'
      );


    const explore =
      document.getElementById(
        'exploreBtn'
      );


    if (hamburger) {

      hamburger.addEventListener(
        'click',
        () => toggleSidebar()
      );
    }


    if (closeSidebar) {

      closeSidebar.addEventListener(
        'click',
        () => toggleSidebar(false)
      );
    }


    if (explore) {

      explore.addEventListener(
        'click',
        event => {

          event.preventDefault();

          showSectionsTable();
        }
      );
    }
  }
);


/* =========================================================
   تشغيل التطبيق
   ========================================================= */

if (
  document.readyState === 'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initialize,
    {
      once: true
    }
  );

} else {

  initialize();
}