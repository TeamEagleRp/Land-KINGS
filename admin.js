async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'حدث خطأ.');
  return data;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function init() {
  const session = await api('/api/user');
  if (!session.authenticated || !session.user?.isSuperAdmin) {
    window.location.href = 'index.html';
    return;
  }

  const message = document.getElementById('adminMessage');
  const showMessage = text => {
    message.textContent = text;
    message.classList.remove('hidden');
    clearTimeout(showMessage.timer);
    showMessage.timer = setTimeout(() => message.classList.add('hidden'), 2600);
  };

  async function renderAdmins() {
    const data = await api('/api/admins');
    const list = document.getElementById('adminsList');
    list.innerHTML = data.admins.map(admin => {
      const isSuper = admin.role === 'superadmin' || admin.protected;
      return `
        <article class="management-card">
          <div class="management-avatar">${isSuper ? '★' : '•'}</div>
          <div class="management-info">
            <span class="role-badge ${isSuper ? 'super' : ''}">${isSuper ? 'مسؤول أعلى' : 'مسؤول عادي'}</span>
            <h3>${isSuper ? 'إدارة عليا' : 'مسؤول في Land Kings'}</h3>
            <p>صلاحية ${isSuper ? 'كاملة لإدارة النظام' : 'إضافة الإنجازات'}</p>
          </div>
          ${admin.protected ? '<span class="protected-badge">محمي</span>' : `<button class="card-delete-button" data-remove-admin="${escapeHtml(admin.id)}" type="button">إزالة</button>`}
        </article>`;
    }).join('');

    list.querySelectorAll('[data-remove-admin]').forEach(button => {
      button.addEventListener('click', async () => {
        if (!confirm('هل تريد إزالة هذا المسؤول؟')) return;
        try {
          await api('/api/admins/' + encodeURIComponent(button.dataset.removeAdmin), { method: 'DELETE' });
          await renderAdmins();
          showMessage('تمت إزالة المسؤول.');
        } catch (error) { showMessage(error.message); }
      });
    });
  }

  async function renderFounders() {
    const data = await api('/api/founders');
    const list = document.getElementById('foundersList');
    list.innerHTML = data.founders.map(founder => `
      <article class="management-card founder-management-card">
        <div class="founder-thumb">
          ${founder.image ? `<img src="${escapeHtml(founder.image)}" alt="${escapeHtml(founder.name)}">` : '<span>LK</span>'}
        </div>
        <div class="management-info">
          <span class="role-badge">مؤسس</span>
          <h3>${escapeHtml(founder.name)}</h3>
          <p>@${escapeHtml(founder.username || '')}</p>
        </div>
        ${String(founder.id).startsWith('default-') ? '<span class="protected-badge">أساسي</span>' : `<button class="card-delete-button" data-remove-founder="${escapeHtml(founder.id)}" type="button">حذف</button>`}
      </article>`).join('');

    list.querySelectorAll('[data-remove-founder]').forEach(button => {
      button.addEventListener('click', async () => {
        if (!confirm('هل تريد حذف هذا المؤسس؟')) return;
        try {
          await api('/api/founders/' + encodeURIComponent(button.dataset.removeFounder), { method: 'DELETE' });
          await renderFounders();
          showMessage('تم حذف المؤسس.');
        } catch (error) { showMessage(error.message); }
      });
    });
  }

  document.getElementById('adminForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api('/api/admins', {
        method: 'POST',
        body: JSON.stringify({ id: form.get('id'), role: form.get('role') })
      });
      event.currentTarget.reset();
      await renderAdmins();
      showMessage('تمت إضافة المسؤول بنجاح.');
    } catch (error) { showMessage(error.message); }
  });

  document.getElementById('founderForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let image = '';
    const file = form.get('imageFile');
    if (file instanceof File && file.size > 0) image = await fileToBase64(file);

    try {
      await api('/api/founders', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          username: form.get('username'),
          image
        })
      });
      event.currentTarget.reset();
      await renderFounders();
      showMessage('تمت إضافة المؤسس مع الموجودين.');
    } catch (error) { showMessage(error.message); }
  });

  await Promise.all([renderAdmins(), renderFounders()]);
}

init().catch(error => {
  document.body.innerHTML = `<main style="padding:40px;text-align:center">${escapeHtml(error.message)}</main>`;
});
