const ADMIN_IDS = [
  '1525706817559203972',
  '1277935535893119067',
  '1086126761651216584',
  '424596757478113300',
  '426970269241049088',
  '1443579668195315844',
  '1521892362152968195'
  
];

const STORAGE_KEYS = {
  founders: 'landkings-founders',
  achievements: 'landkings-achievements',
  accounts: 'landkings-accounts',
  owners: 'landkings-owners'
};

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

const defaultAchievements = [
  {
    title: 'افتتاح السيرفر الرسمي',
    description: 'انطلاق Land Kings رسميًا مع قاعدة قوية ومجتمع منظم.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'توسيع النشاطات',
    description: 'زيادة التفاعل داخل المجتمع من خلال فعاليات ومساحات تواصل.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80'
  }
];

const defaultAccounts = [
  {
    owner: 'Land Kings',
    platform: 'TikTok',
    handle: '@landkings1',
    link: 'https://www.tiktok.com/@landkings1?_r=1&_t=ZS-99Ggk8MTkxQ',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80'
  },
  {
    owner: 'Land Kings',
    platform: 'Discord',
    handle: 'Land Kings',
    link: 'https://discord.gg/l-kg',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=900&q=80'
  }
];

// owners: track created sections and who created them (admin id)
const defaultOwners = [
  // { name: 'Land Kings', createdBy: null }
];

const state = {
  adminMode: false
};

const elements = {
  foundersGrid: document.getElementById('foundersGrid'),
  achievementsGrid: document.getElementById('achievementsGrid'),
  accountsGrid: document.getElementById('accountsGrid'),
  achievementAdmin: document.getElementById('achievementAdmin'),
  accountAdmin: document.getElementById('accountAdmin'),
  discordModal: document.getElementById('discordModal'),
  discordLoginBtn: document.getElementById('discordLoginBtn'),
  closeDiscordModalBtn: document.getElementById('closeDiscordModal'),
  cancelDiscordLoginBtn: document.getElementById('cancelDiscordLogin'),
  confirmDiscordLoginBtn: document.getElementById('confirmDiscordLogin'),
  discordIdInput: document.getElementById('discordIdInput'),
  loginStatus: document.getElementById('loginStatus'),
  achievementForm: document.getElementById('achievementForm'),
  accountForm: document.getElementById('accountForm')
};

window.__landKingsState = state;
window.__landKingsSetAdmin = function (enabled) {
  state.adminMode = Boolean(enabled);
  updateAdminVisibility();
  updateDiscordButton();
  if (typeof renderAccountAdminForm === 'function') {
    try { renderAccountAdminForm(); } catch(e) { /* safe */ }
  }
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function createCardImage(imageUrl, altText) {
  if (!imageUrl) {
    return '<div class="card-image" style="display:grid;place-items:center;background:linear-gradient(135deg, rgba(247,210,31,.24), rgba(255,255,255,.08));color:#f7d21f;font-weight:800;font-size:2rem;">LK</div>';
  }

  return `<img class="card-image" src="${imageUrl}" alt="${altText}" loading="lazy" />`;
}

function renderFounders() {
  if (!elements.foundersGrid) return;

  const founders = loadFromStorage(STORAGE_KEYS.founders, defaultFounders);
  elements.foundersGrid.innerHTML = founders
    .map((person) => {
      const desc = person.description || '';
      const m = desc.match(/[:：]\s*(.+)$/);
      const username = m ? m[1] : '';
      const infoText = m ? '' : desc;

      // build avatar HTML (use explicit inline size to ensure consistent round rendering)
      const avatarHtml = `<img class="card-image" src="${person.image}" alt="${person.name}" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid rgba(247,210,31,0.18);box-shadow:0 8px 26px rgba(0,0,0,0.45),0 0 18px rgba(247,210,31,0.06) inset;" />`;

      return `
      <article class="content-card founder-card">
        ${avatarHtml}
        <div class="card-body">
          <h3>${person.name}</h3>
          ${infoText ? `<p class="founder-desc">${infoText}</p>` : ''}
          ${username ? `<div class="discord-pill" role="img" aria-label="discord-username">\n              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.08.037c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.405-.405-.874-.617-1.249a.077.077 0 00-.08-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.045-.319 13.533.099 17.946a.082.082 0 00.03.056 19.99 19.99 0 005.993 3.06.077.077 0 00.084-.027c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.105 13.09 13.09 0 01-1.872-.89.077.077 0 01-.007-.128c.126-.095.252-.192.37-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.009c.12.1.246.197.373.292a.077.077 0 01-.006.128c-.605.39-1.25.73-1.872.89a.076.076 0 00-.04.106c.36.7.773 1.366 1.225 1.995a.077.077 0 00.084.028 19.978 19.978 0 005.994-3.06.077.077 0 00.03-.055c.5-5.057-.838-9.5-3.548-13.55a.061.061 0 00-.03-.028zM8.02 15.331c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.952-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.419 0 1.333-.947 2.418-2.156 2.418zm7.974 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.952-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.419 0 1.333-.947 2.418-2.156 2.418z"/></svg>\n              <span class="pill-username">${username}</span>\n            </div>` : ''}
        </div>
      </article>
    `;
    })
    .join('');
}


function renderAchievements() {
  if (!elements.achievementsGrid) return;

  const achievements = loadFromStorage(STORAGE_KEYS.achievements, defaultAchievements);
  elements.achievementsGrid.innerHTML = achievements
    .map((item, index) => `
      <article class="content-card achievement-card">
        ${createCardImage(item.image, item.title)}
        <div class="card-body">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          ${
            state.adminMode
              ? `<div class="card-actions"><button type="button" class="card-delete-button" data-delete-type="achievement" data-index="${index}">حذف</button></div>`
              : ''
          }
        </div>
      </article>
    `)
    .join('');
}

function getAdminId() {
  return localStorage.getItem('landkings-admin-id') || null;
}

function loadOwners() {
  return loadFromStorage(STORAGE_KEYS.owners, defaultOwners);
}

function saveOwners(owners) {
  saveToStorage(STORAGE_KEYS.owners, owners);
}

function findOwnerByName(name) {
  const owners = loadOwners();
  return owners.find(o => o.name === name);
}

function createOwner(name, createdBy) {
  const owners = loadOwners();
  owners.push({ name, createdBy });
  saveOwners(owners);
}

function renderAccounts() {
  if (!elements.accountsGrid) return;

  const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
  const owners = loadOwners();

  // group accounts by owner/name
  const groups = {};
  accounts.forEach((acct, idx) => {
    const owner = (acct.owner || 'عام').trim() || 'عام';
    if (!groups[owner]) groups[owner] = [];
    groups[owner].push({ acct, idx });
  });

  // ensure owners with no accounts still show (if created)
  owners.forEach(o => {
    if (!groups[o.name]) groups[o.name] = [];
  });

  // build HTML: one section per owner
  const html = Object.keys(groups)
    .map((owner) => {
      const itemsHtml = groups[owner]
        .map(({ acct, idx }) => `
          <article class="content-card account-card">
            ${createCardImage(acct.image, acct.platform)}
            <div class="card-body">
              <h3>${acct.platform}</h3>
              <p>${acct.handle}</p>
              <a href="${acct.link}" target="_blank" rel="noreferrer">زيارة الحساب</a>
              ${state.adminMode ? `<div class="card-actions"><button type="button" class="card-delete-button" data-delete-type="account" data-index="${idx}">حذف</button></div>` : ''}
            </div>
          </article>
        `)
        .join('');

      // owner header: centered, single line. if current admin created this owner, show "تعديل" زر
      const adminId = getAdminId();
      const ownerMeta = owners.find(o => o.name === owner);
      const canEdit = state.adminMode && ownerMeta && ownerMeta.createdBy && adminId === ownerMeta.createdBy;
      const editButtonHtml = canEdit ? `<button class="owner-edit-button" data-owner="${owner}">تعديل الاسم</button>` : '';

      return `
        <section class="owner-section">
          <div class="owner-header">
            <h3 class="owner-name">حسابات ${owner}</h3>
            ${editButtonHtml}
          </div>
          <div class="card-grid owner-card-grid">${itemsHtml}</div>
        </section>
      `;
    })
    .join('');

  elements.accountsGrid.innerHTML = html;

  // attach owner edit handlers
  document.querySelectorAll('.owner-edit-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const oldName = btn.dataset.owner;
      const newName = prompt('عدل اسم المالك/اللقب:', oldName);
      if (!newName || !newName.trim()) return;
      const trimmed = newName.trim();
      // prevent duplicate owner names
      const owners = loadOwners();
      if (owners.some(o => o.name === trimmed && o.name !== oldName)) {
        alert('يوجد بالفعل قسم بنفس الاسم. اختر اسم آخر.');
        return;
      }
      // update owners list
      owners.forEach(o => { if (o.name === oldName) o.name = trimmed; });
      saveOwners(owners);
      // update accounts owner field
      const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
      accounts.forEach(a => { if ((a.owner||'').trim() === oldName) a.owner = trimmed; });
      saveToStorage(STORAGE_KEYS.accounts, accounts);
      renderAccounts();
    });
  });
}

function updateAdminVisibility() {
  if (elements.achievementAdmin) {
    elements.achievementAdmin.classList.toggle('hidden', !state.adminMode);
  }

  if (elements.accountAdmin) {
    elements.accountAdmin.classList.toggle('hidden', !state.adminMode);
  }

  renderAchievements();
  renderAccounts();
}

function setLoginStatus(message, isError = false) {
  if (!elements.loginStatus) return;
  elements.loginStatus.textContent = message;
  elements.loginStatus.style.color = isError ? '#ff8a80' : '#f7d21f';
}

function updateDiscordButton() {
  if (!elements.discordLoginBtn) return;

  if (state.adminMode) {
    elements.discordLoginBtn.textContent = 'تسجيل خروج';
    elements.discordLoginBtn.classList.add('logged-in');
  } else {
    elements.discordLoginBtn.textContent = 'تسجيل دخول عبر ديسكورد';
    elements.discordLoginBtn.classList.remove('logged-in');
  }
}

function deleteStoredItem(key, index) {
  const items = loadFromStorage(key, []);
  const nextItems = items.filter((_, itemIndex) => itemIndex !== Number(index));
  saveToStorage(key, nextItems);

  if (key === STORAGE_KEYS.achievements) {
    renderAchievements();
  } else if (key === STORAGE_KEYS.accounts) {
    renderAccounts();
  }
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('فشل في قراءة الصورة'));
    reader.readAsDataURL(file);
  });
}

async function handleAdminFormSubmit(event, key, fieldNames) {
  event.preventDefault();

  if (!state.adminMode) {
    setLoginStatus('يجب تسجيل الدخول أولاً كمسؤول.', true);
    return;
  }

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const file = data.imageFile && data.imageFile.name ? data.imageFile : null;

  if (fieldNames.some((field) => !data[field] || !String(data[field]).trim())) {
    setLoginStatus('يرجى تعبئة جميع الحقول المطلوبة.', true);
    return;
  }

  let imageUrl = data.image ? String(data.image).trim() : '';

  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await fileToBase64(file);
    } catch (error) {
      setLoginStatus('تعذر قراءة الصورة المختارة.', true);
      return;
    }
  }

  // determine owner: if current admin already created a section, use that owner's name instead of the form owner
  const adminId = getAdminId();
  const owners = loadOwners();
  const adminOwner = owners.find(o => o.createdBy && o.createdBy === adminId);
  let ownerName = data.owner ? String(data.owner).trim() : '';

  if (adminOwner) {
    // admin already has a created section — use it and don't allow creating a new owner
    ownerName = adminOwner.name;
  }

  // if owner doesn't exist yet, create owner entry and mark it as created by current admin (if present)
  if (!findOwnerByName(ownerName)) {
    createOwner(ownerName, adminId || null);
  }

  const currentItems = loadFromStorage(key, []);
  const newItem = {
    ...data,
    owner: ownerName,
    image: imageUrl,
    imageFile: undefined
  };

  delete newItem.imageFile;

  currentItems.unshift(newItem);
  saveToStorage(key, currentItems);

  if (key === STORAGE_KEYS.achievements) {
    renderAchievements();
  } else if (key === STORAGE_KEYS.accounts) {
    renderAccounts();
  }

  form.reset();
  renderAccountAdminForm(); // re-render form state (owner input may hide)
  setLoginStatus('تم حفظ العنصر بنجاح.');
}

function switchLandKingsPage(targetPageId) {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('main .hero-section, main .content-section');

  if (!targetPageId || !navLinks.length || !pages.length) return;

  pages.forEach((page) => {
    const isActive = page.id === targetPageId;
    page.classList.toggle('active-page', isActive);
    page.style.display = isActive ? 'block' : 'none';
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('data-page') === targetPageId;
    link.classList.toggle('active', isActive);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.switchLandKingsPage = switchLandKingsPage;

function attachPageNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetPage = link.getAttribute('data-page');
      if (targetPage) {
        switchLandKingsPage(targetPage);
      }
    });
  });
}

// Sidebar and homepage sections table behavior
function toggleSidebar(open) {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  sb.classList.toggle('open', open === undefined ? !sb.classList.contains('open') : !!open);
}

function showSectionsTable(show) {
  const wrap = document.getElementById('sectionsTableWrap');
  if (!wrap) return;
  const isHidden = wrap.classList.contains('hidden');
  const shouldShow = show === undefined ? isHidden : !!show;
  wrap.classList.toggle('hidden', !shouldShow);
  if (!shouldShow) window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hookup hamburger and explore button if present
document.addEventListener('DOMContentLoaded', () => {
  const hb = document.getElementById('hamburgerBtn');
  const close = document.getElementById('closeSidebar');
  const explore = document.getElementById('exploreBtn');
  if (hb) hb.addEventListener('click', () => toggleSidebar());
  if (close) close.addEventListener('click', () => toggleSidebar(false));
  if (explore) explore.addEventListener('click', (e) => { e.preventDefault(); showSectionsTable(); });
});

function setupDiscordLogin() {
  if (!elements.discordLoginBtn || !elements.discordModal || !elements.closeDiscordModalBtn || !elements.cancelDiscordLoginBtn || !elements.confirmDiscordLoginBtn || !elements.discordIdInput || !elements.loginStatus) {
    return;
  }

  const closeModal = () => {
    elements.discordModal.classList.add('hidden');
    elements.discordModal.setAttribute('aria-hidden', 'true');
    elements.discordIdInput.value = '';
    elements.loginStatus.textContent = '';
  };

  elements.discordLoginBtn.addEventListener('click', () => {
    if (state.adminMode) {
      state.adminMode = false;
      localStorage.removeItem('landkings-admin-id');
      window.__landKingsSetAdmin(false);
      setLoginStatus('تم تسجيل الخروج بنجاح.');
      return;
    }

    elements.discordModal.classList.remove('hidden');
    elements.discordModal.setAttribute('aria-hidden', 'false');
    elements.discordIdInput.value = '';
    setLoginStatus('');
    elements.discordIdInput.focus();
  });

  elements.closeDiscordModalBtn.addEventListener('click', closeModal);
  elements.cancelDiscordLoginBtn.addEventListener('click', closeModal);

  elements.confirmDiscordLoginBtn.addEventListener('click', () => {
    const value = elements.discordIdInput.value.trim();

    if (!value) {
      setLoginStatus('يرجى إدخال معرف ديسكورد.', true);
      return;
    }

    if (ADMIN_IDS.includes(value)) {
      state.adminMode = true;
      localStorage.setItem('landkings-admin-id', value);
      window.__landKingsSetAdmin(true);
      closeModal();
      setLoginStatus('تم تسجيل الدخول بنجاح كمسؤول.');
      return;
    }

    state.adminMode = false;
    window.__landKingsSetAdmin(false);
    setLoginStatus('هذا المعرف غير موجود في قائمة المسؤولين.', true);
  });
}

function renderAccountAdminForm() {
  // adjust the account admin form to hide owner input if current admin already created a section
  if (!elements.accountForm) return;
  const adminId = getAdminId();
  const owners = loadOwners();
  const adminOwner = owners.find(o => o.createdBy && o.createdBy === adminId);

  const ownerInput = elements.accountForm.querySelector('input[name="owner"]');
  const ownerLabel = ownerInput ? ownerInput.closest('label') : null;

  // if admin has created a section, hide the owner input and show a small readonly block with edit option
  let existingHolder = elements.accountForm.querySelector('.owner-existing');
  if (adminOwner) {
    if (ownerLabel) ownerLabel.style.display = 'none';

    if (!existingHolder) {
      existingHolder = document.createElement('div');
      existingHolder.className = 'owner-existing';
      existingHolder.style.display = 'flex';
      existingHolder.style.gap = '0.6rem';
      existingHolder.style.alignItems = 'center';
      existingHolder.innerHTML = `
        <div style="padding:0.6rem 0.9rem;border-radius:12px;background:rgba(255,255,255,0.03);">${adminOwner.name}</div>
        <button type="button" class="secondary-action owner-edit-inline">تعديل الاسم</button>
      `;
      ownerLabel?.parentNode?.insertBefore(existingHolder, ownerLabel?.nextSibling);

      existingHolder.querySelector('.owner-edit-inline').addEventListener('click', () => {
        const newName = prompt('عدل اسم القسم:', adminOwner.name);
        if (!newName || !newName.trim()) return;
        const trimmed = newName.trim();
        const ownersList = loadOwners();
        if (ownersList.some(o => o.name === trimmed && o.name !== adminOwner.name)) {
          alert('يوجد بالفعل قسم بهذا الاسم. اختر اسم آخر.');
          return;
        }
        // update owner and accounts
        ownersList.forEach(o => { if (o.name === adminOwner.name) o.name = trimmed; });
        saveOwners(ownersList);
        const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
        accounts.forEach(a => { if ((a.owner||'').trim() === adminOwner.name) a.owner = trimmed; });
        saveToStorage(STORAGE_KEYS.accounts, accounts);
        renderAccounts();
        renderAccountAdminForm();
      });
    } else {
      existingHolder.querySelector('div').textContent = adminOwner.name;
      existingHolder.style.display = '';
    }
  } else {
    // no admin owner: ensure owner input visible and any existingHolder removed
    if (ownerLabel) ownerLabel.style.display = '';
    if (existingHolder) existingHolder.remove();
  }
}

function restoreAdminState() {
  const savedId = localStorage.getItem('landkings-admin-id');
  state.adminMode = Boolean(savedId && ADMIN_IDS.includes(savedId));
  updateAdminVisibility();
  updateDiscordButton();
  renderAccountAdminForm();
}

function initializeForms() {
  if (elements.achievementForm) {
    elements.achievementForm.addEventListener('submit', (event) => {
      handleAdminFormSubmit(event, STORAGE_KEYS.achievements, ['title', 'description']);
    });
  }

  if (elements.accountForm) {
    elements.accountForm.addEventListener('submit', (event) => {
      // now requiring owner + platform + handle + link
      handleAdminFormSubmit(event, STORAGE_KEYS.accounts, ['owner','platform', 'handle', 'link']);
    });
  }

  document.addEventListener('click', (event) => {
    // owner edit (delegated) - works even if buttons are added dynamically
    const ownerBtn = event.target.closest('.owner-edit-button');
    if (ownerBtn) {
      if (!state.adminMode) {
        setLoginStatus('يجب تسجيل الدخول أولاً كمسؤول.', true);
        return;
      }
      const oldName = ownerBtn.dataset.owner;
      const newName = prompt('عدل اسم المالك/اللقب:', oldName);
      if (!newName || !newName.trim()) return;
      const trimmed = newName.trim();
      const owners = loadOwners();
      if (owners.some(o => o.name === trimmed && o.name !== oldName)) {
        alert('يوجد بالفعل قسم بنفس الاسم. اختر اسم آخر.');
        return;
      }
      owners.forEach(o => { if (o.name === oldName) o.name = trimmed; });
      saveOwners(owners);
      const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
      accounts.forEach(a => { if ((a.owner||'').trim() === oldName) a.owner = trimmed; });
      saveToStorage(STORAGE_KEYS.accounts, accounts);
      renderAccounts();
      return;
    }

    const ownerInlineBtn = event.target.closest('.owner-edit-inline');
    if (ownerInlineBtn) {
      // inline edit inside account form
      if (!state.adminMode) {
        setLoginStatus('يجب تسجيل الدخول أولاً كمسؤول.', true);
        return;
      }
      // find admin owner
      const adminId = getAdminId();
      const ownersList = loadOwners();
      const adminOwner = ownersList.find(o => o.createdBy && o.createdBy === adminId);
      if (!adminOwner) return;
      const newName = prompt('عدل اسم القسم:', adminOwner.name);
      if (!newName || !newName.trim()) return;
      const trimmed = newName.trim();
      if (ownersList.some(o => o.name === trimmed && o.name !== adminOwner.name)) {
        alert('يوجد بالفعل قسم بهذا الاسم. اختر اسم آخر.');
        return;
      }
      ownersList.forEach(o => { if (o.name === adminOwner.name) o.name = trimmed; });
      saveOwners(ownersList);
      const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
      accounts.forEach(a => { if ((a.owner||'').trim() === adminOwner.name) a.owner = trimmed; });
      saveToStorage(STORAGE_KEYS.accounts, accounts);
      renderAccounts();
      renderAccountAdminForm();
      return;
    }

    const button = event.target.closest('.card-delete-button');
    if (!button) return;

    const itemType = button.dataset.deleteType;
    const index = button.dataset.index;

    if (!state.adminMode) {
      setLoginStatus('يجب تسجيل الدخول أولاً كمسؤول.', true);
      return;
    }

    if (itemType === 'achievement') {
      deleteStoredItem(STORAGE_KEYS.achievements, index);
    }

    if (itemType === 'account') {
      deleteStoredItem(STORAGE_KEYS.accounts, index);
    }
  });
}

function initialize() {
  if (window.__landKingsInitialized) return;
  window.__landKingsInitialized = true;

  attachPageNavigation();
  setupDiscordLogin();
  initializeForms();
  // if there are no saved founders/accounts/achievements (first load), persist the defaults so the new lists appear
  if (!localStorage.getItem(STORAGE_KEYS.founders)) {
    saveToStorage(STORAGE_KEYS.founders, defaultFounders);
  }
  if (!localStorage.getItem(STORAGE_KEYS.accounts)) {
    saveToStorage(STORAGE_KEYS.accounts, defaultAccounts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.achievements)) {
    saveToStorage(STORAGE_KEYS.achievements, defaultAchievements);
  }

  renderFounders();
  renderAchievements();
  renderAccounts();
  restoreAdminState();
  updateDiscordButton();
}

// Runtime override: ensure the grouped renderAccounts implementation is used (in case an older definition is present in-memory)
window.renderAccounts = function() {
  if (!elements.accountsGrid) return;
  const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
  const owners = loadOwners();
  const groups = {};
  accounts.forEach((acct, idx) => {
    const owner = (acct.owner || 'عام').trim() || 'عام';
    if (!groups[owner]) groups[owner] = [];
    groups[owner].push({ acct, idx });
  });
  owners.forEach(o => { if (!groups[o.name]) groups[o.name] = []; });
  const html = Object.keys(groups).map((owner) => {
    const itemsHtml = groups[owner].map(({ acct, idx }) => {
      return `\n          <article class="content-card account-card">\n            ${createCardImage(acct.image, acct.platform)}\n            <div class="card-body">\n              <h3>${acct.platform}</h3>\n              <p>${acct.handle}</p>\n              <a href="${acct.link}" target="_blank" rel="noreferrer">زيارة الحساب</a>\n              ${state.adminMode ? `<div class="card-actions"><button type="button" class="card-delete-button" data-delete-type="account" data-index="${idx}">حذف</button></div>` : ''}\n            </div>\n          </article>\n        `;
    }).join('');
    const adminId = getAdminId();
    const ownerMeta = owners.find(o => o.name === owner);
    const canEdit = state.adminMode && ownerMeta && ownerMeta.createdBy && adminId === ownerMeta.createdBy;
    const editButtonHtml = canEdit ? `<button class="owner-edit-button" data-owner="${owner}">تعديل الاسم</button>` : '';
    return `\n        <section class="owner-section">\n          <div class="owner-header">\n            <h3 class="owner-name">حسابات ${owner}</h3>\n            ${editButtonHtml}\n          </div>\n          <div class="card-grid owner-card-grid">${itemsHtml}</div>\n        </section>\n      `;
  }).join('');
  elements.accountsGrid.innerHTML = html;
  document.querySelectorAll('.owner-edit-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const oldName = btn.dataset.owner;
      const newName = prompt('عدل اسم المالك/اللقب:', oldName);
      if (!newName || !newName.trim()) return;
      const trimmed = newName.trim();
      const owners = loadOwners();
      if (owners.some(o => o.name === trimmed && o.name !== oldName)) {
        alert('يوجد بالفعل قسم بنفس الاسم. اختر اسم آخر.');
        return;
      }
      owners.forEach(o => { if (o.name === oldName) o.name = trimmed; });
      saveOwners(owners);
      const accounts = loadFromStorage(STORAGE_KEYS.accounts, defaultAccounts);
      accounts.forEach(a => { if ((a.owner||'').trim() === oldName) a.owner = trimmed; });
      saveToStorage(STORAGE_KEYS.accounts, accounts);
      renderAccounts();
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}