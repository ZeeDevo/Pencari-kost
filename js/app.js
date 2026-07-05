// KostPutri Application Logic
document.addEventListener('DOMContentLoaded', () => {
  
  // --- 0. SERVICE WORKER REGISTRATION ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.error('Service Worker registration failed', err));
    });
  }

  // --- 1. STATE INITIALIZATION ---
  let users = JSON.parse(localStorage.getItem('kp_users')) || INITIAL_USERS;
  let owners = JSON.parse(localStorage.getItem('kp_owners')) || INITIAL_OWNERS;
  let kosts = JSON.parse(localStorage.getItem('kp_kosts')) || INITIAL_KOST_LIST;
  let chats = JSON.parse(localStorage.getItem('kp_chats')) || INITIAL_CHATS;
  
  let currentUser = JSON.parse(localStorage.getItem('kp_current_user')) || null;
  let currentOwner = JSON.parse(localStorage.getItem('kp_current_owner')) || null;
  let activeRole = localStorage.getItem('kp_active_role') || null; // 'seeker' or 'owner'

  let activeChatRoomId = null;
  let propertyToDeleteId = null;

  // Save state helper
  const saveState = () => {
    localStorage.setItem('kp_users', JSON.stringify(users));
    localStorage.setItem('kp_owners', JSON.stringify(owners));
    localStorage.setItem('kp_kosts', JSON.stringify(kosts));
    localStorage.setItem('kp_chats', JSON.stringify(chats));
    localStorage.setItem('kp_current_user', JSON.stringify(currentUser));
    localStorage.setItem('kp_current_owner', JSON.stringify(currentOwner));
    localStorage.setItem('kp_active_role', activeRole || '');
  };

  // Ensure initial data is stored in localStorage on first run
  saveState();

  // --- 2. CLOCK RUNNER ---
  const runClock = () => {
    const clockEl = document.getElementById('device-clock');
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${hours}:${mins}`;
    };
    updateTime();
    setInterval(updateTime, 60000);
  };
  runClock();

  // --- 3. SNACKBAR / TOAST NOTIFICATION ---
  const showToast = (message) => {
    const container = document.getElementById('snackbar-container');
    const messageEl = document.getElementById('snackbar-message');
    messageEl.textContent = message;
    container.classList.add('active');
    setTimeout(() => {
      container.classList.remove('active');
    }, 3000);
  };

  // --- 4. VIEW ROUTER & NAVIGATION ---
  const splashScreen = document.getElementById('splash-screen');
  const appShell = document.getElementById('app-shell');
  const pages = document.querySelectorAll('.page-view');
  
  // Navigation elements
  const seekerNav = document.getElementById('seeker-bottom-nav');
  const ownerNav = document.getElementById('owner-bottom-nav');
  const headerTitle = document.getElementById('header-app-title');
  const headerRole = document.getElementById('header-role-badge');

  // Navigate to Page Tab
  const navigateToTab = (tabId) => {
    // Scroll window viewport back to top
    document.getElementById('main-content-window').scrollTop = 0;

    pages.forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(tabId);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // Toggle active state in both bottom navs
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Run tab-specific load/render logic
    if (tabId === 'seeker-home') {
      renderSeekerHome();
    } else if (tabId === 'seeker-chat') {
      renderSeekerChatList();
    } else if (tabId === 'seeker-profile') {
      renderSeekerProfile();
    } else if (tabId === 'owner-home') {
      renderOwnerHome();
    } else if (tabId === 'owner-manage') {
      renderOwnerManageList();
    } else if (tabId === 'owner-chat') {
      renderOwnerChatList();
    } else if (tabId === 'owner-profile') {
      renderOwnerProfile();
    }
  };

  // Setup bottom navigation click listeners
  const initBottomNavs = () => {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        navigateToTab(item.dataset.tab);
      };
    });
  };
  initBottomNavs();

  // Determine starting screen based on active sessions
  const checkInitialSession = () => {
    if (activeRole === 'seeker' && currentUser) {
      // Load seeker app
      splashScreen.style.display = 'none';
      appShell.style.display = 'flex';
      seekerNav.style.display = 'flex';
      ownerNav.style.display = 'none';
      headerRole.textContent = 'Pencari';
      headerRole.style.background = 'var(--primary-light)';
      headerRole.style.color = 'var(--primary-dark)';
      navigateToTab('seeker-home');
    } else if (activeRole === 'owner' && currentOwner) {
      // Load owner app
      splashScreen.style.display = 'none';
      appShell.style.display = 'flex';
      seekerNav.style.display = 'none';
      ownerNav.style.display = 'flex';
      headerRole.textContent = 'Owner';
      headerRole.style.background = '#FFE5E5';
      headerRole.style.color = 'var(--danger)';
      navigateToTab('owner-home');
    } else {
      // Load splash screen
      splashScreen.style.display = 'flex';
      appShell.style.display = 'none';
    }
  };

  // --- 5. SPLASH SCREEN FLOWS ---
  document.getElementById('btn-select-seeker').onclick = () => {
    document.getElementById('page-login-user').classList.add('active');
  };

  document.getElementById('btn-select-owner').onclick = () => {
    document.getElementById('page-login-owner').classList.add('active');
  };

  // Universal Back Buttons on Auth screens
  const hideAuthPages = () => {
    document.querySelectorAll('.auth-page').forEach(page => {
      page.classList.remove('active');
    });
  };

  document.querySelectorAll('.btn-back-splash').forEach(btn => {
    btn.onclick = () => {
      hideAuthPages();
    };
  });

  // Toggle Login/Register Seeker
  document.getElementById('link-to-register-user').onclick = () => {
    document.getElementById('page-register-user').classList.add('active');
  };

  document.querySelectorAll('.btn-back-login-user').forEach(btn => {
    btn.onclick = () => {
      document.getElementById('page-register-user').classList.remove('active');
    };
  });

  // Toggle Login/Register Owner
  document.getElementById('link-to-register-owner').onclick = () => {
    document.getElementById('page-register-owner').classList.add('active');
  };

  document.querySelectorAll('.btn-back-login-owner').forEach(btn => {
    btn.onclick = () => {
      document.getElementById('page-register-owner').classList.remove('active');
    };
  });

  // --- 6. AUTHENTICATION LOGIC ---

  // LOGIN USER (SEEKER) SUBMIT
  document.getElementById('form-login-user').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-user-email').value.trim();
    const pass = document.getElementById('login-user-password').value;

    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      currentUser = user;
      activeRole = 'seeker';
      saveState();
      
      // Navigate to Seeker View
      hideAuthPages();
      splashScreen.classList.add('fade-out');
      setTimeout(() => {
        splashScreen.style.display = 'none';
        splashScreen.classList.remove('fade-out');
      }, 500);

      appShell.style.display = 'flex';
      seekerNav.style.display = 'flex';
      ownerNav.style.display = 'none';
      headerRole.textContent = 'Pencari';
      headerRole.style.background = 'var(--primary-light)';
      headerRole.style.color = 'var(--primary-dark)';
      
      showToast(`Selamat datang kembali, ${user.name}! 🌸`);
      navigateToTab('seeker-home');
    } else {
      showToast('Email atau password salah!');
    }
  };

  // REGISTER USER (SEEKER) SUBMIT
  document.getElementById('form-register-user').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-user-name').value.trim();
    const email = document.getElementById('reg-user-email').value.trim();
    const phone = document.getElementById('reg-user-phone').value.trim();
    const password = document.getElementById('reg-user-password').value;

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      showToast('Email sudah terdaftar!');
      return;
    }

    const newUser = {
      name,
      email,
      phone,
      password,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    };

    users.push(newUser);
    saveState();
    showToast('Pendaftaran berhasil! Silakan login.');
    
    // Reset form and go back to login
    document.getElementById('form-register-user').reset();
    document.getElementById('page-register-user').classList.remove('active');
  };

  // LOGIN OWNER SUBMIT
  document.getElementById('form-login-owner').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-owner-email').value.trim();
    const pass = document.getElementById('login-owner-password').value;

    const owner = owners.find(o => o.email === email && o.password === pass);
    if (owner) {
      currentOwner = owner;
      activeRole = 'owner';
      saveState();

      // Navigate to Owner View
      hideAuthPages();
      splashScreen.classList.add('fade-out');
      setTimeout(() => {
        splashScreen.style.display = 'none';
        splashScreen.classList.remove('fade-out');
      }, 500);

      appShell.style.display = 'flex';
      seekerNav.style.display = 'none';
      ownerNav.style.display = 'flex';
      headerRole.textContent = 'Owner';
      headerRole.style.background = '#FFE5E5';
      headerRole.style.color = 'var(--danger)';

      showToast(`Selamat datang, ${owner.name}! 🏠`);
      navigateToTab('owner-home');
    } else {
      showToast('Email atau password salah!');
    }
  };

  // REGISTER OWNER SUBMIT
  document.getElementById('form-register-owner').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-owner-name').value.trim();
    const kostName = document.getElementById('reg-owner-kost').value.trim();
    const email = document.getElementById('reg-owner-email').value.trim();
    const phone = document.getElementById('reg-owner-phone').value.trim();
    const password = document.getElementById('reg-owner-password').value;

    if (owners.some(o => o.email === email)) {
      showToast('Email sudah terdaftar!');
      return;
    }

    const newOwner = {
      name,
      kostName,
      email,
      phone,
      password,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    };

    owners.push(newOwner);
    saveState();
    showToast('Pendaftaran Owner berhasil! Silakan login.');
    
    // Reset form and go back to login
    document.getElementById('form-register-owner').reset();
    document.getElementById('page-register-owner').classList.remove('active');
  };

  // LOGOUT ACTION
  const handleLogout = () => {
    currentUser = null;
    currentOwner = null;
    activeRole = null;
    saveState();

    appShell.style.display = 'none';
    splashScreen.style.display = 'flex';
    showToast('Berhasil keluar akun.');
  };

  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.onclick = () => {
      handleLogout();
    };
  });

  // --- 7. SEEKER (USER) VIEW CONTROLLERS ---

  // RENDER BERANDA USER
  const renderSeekerHome = () => {
    const grid = document.getElementById('seeker-kost-grid');
    grid.innerHTML = '';
    
    // Update Greeting with active name
    document.getElementById('seeker-greeting-name').textContent = `Halo, Kak ${currentUser ? currentUser.name.split(' ')[0] : 'User'}! 🌸`;

    // Render list of properties
    kosts.forEach(k => {
      grid.appendChild(createKostCardForSeeker(k));
    });
  };

  // Create Card Element for Seeker Listing
  const createKostCardForSeeker = (k) => {
    const card = document.createElement('div');
    card.className = 'kost-card';
    
    // Price formatter
    const priceFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(k.price);

    card.innerHTML = `
      <div class="kost-card-img-container">
        <img src="${k.images[0]}" alt="${k.title}" onerror="this.src='https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'">
        <span class="kost-type-badge">${k.type}</span>
        <span class="kost-gender-badge">Kost Putri</span>
      </div>
      <div class="kost-card-body">
        <div class="kost-card-rating-row">
          <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          <span>${k.rating}</span>
          <span style="color:var(--text-light); font-weight:normal">(${k.views} views)</span>
        </div>
        <h4 class="kost-card-title">${k.title}</h4>
        <div class="kost-card-loc-row">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>${k.location}</span>
        </div>
        <div class="kost-card-footer">
          <div class="kost-card-price">
            <span class="amount">${priceFormatted.replace('Rp', 'Rp ')}</span>
            <span class="unit">per bulan</span>
          </div>
          <button class="btn-detail">Lihat Detail</button>
        </div>
      </div>
    `;

    // Click -> Open detail view overlay
    card.onclick = () => {
      openKostDetailOverlay(k.id);
    };

    return card;
  };

  // REAL-TIME SEARCH FILTER FOR SEEKER
  const searchInput = document.getElementById('seeker-search-input');
  searchInput.onkeyup = () => {
    const query = searchInput.value.toLowerCase().trim();
    const grid = document.getElementById('seeker-kost-grid');
    grid.innerHTML = '';

    const filtered = kosts.filter(k => 
      k.title.toLowerCase().includes(query) ||
      k.location.toLowerCase().includes(query) ||
      k.type.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h3>Kost Tidak Ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      `;
    } else {
      filtered.forEach(k => {
        grid.appendChild(createKostCardForSeeker(k));
      });
    }
  };

  // OPEN KOST DETAIL VIEW OVERLAY
  let activeKostDetail = null;
  const openKostDetailOverlay = (id) => {
    const k = kosts.find(item => item.id === id);
    if (!k) return;
    
    activeKostDetail = k;
    
    // Increment views locally for visual polish
    k.views += 1;
    saveState();

    document.getElementById('detail-kost-img').src = k.images[0];
    document.getElementById('detail-kost-type').textContent = k.type;
    document.getElementById('detail-kost-title').textContent = k.title;
    
    const priceFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(k.price);
    document.getElementById('detail-kost-price').textContent = priceFormatted.replace('Rp', 'Rp ');
    document.getElementById('detail-kost-address').textContent = k.address;
    document.getElementById('detail-kost-desc').textContent = k.description;

    // Render facilities list
    const facGrid = document.getElementById('detail-facilities-grid');
    facGrid.innerHTML = '';
    k.facilities.forEach(fac => {
      const pill = document.createElement('div');
      pill.className = 'facility-pill';
      pill.innerHTML = `
        <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>${fac}</span>
      `;
      facGrid.appendChild(pill);
    });

    document.getElementById('detail-page-overlay').classList.add('active');
  };

  // CLOSE KOST DETAIL
  document.getElementById('btn-close-detail').onclick = () => {
    document.getElementById('detail-page-overlay').classList.remove('active');
    renderSeekerHome(); // refresh cards view count
  };

  // CHAT FROM KOST DETAIL
  document.getElementById('btn-chat-owner-from-detail').onclick = () => {
    if (!activeKostDetail) return;
    document.getElementById('detail-page-overlay').classList.remove('active');
    
    // Find or create chat room between current user and boarding house owner
    let room = chats.find(c => c.kostId === activeKostDetail.id && c.userEmail === currentUser.email);
    if (!room) {
      // Find owner details
      const ownerObj = owners.find(o => o.email === activeKostDetail.ownerEmail) || {
        name: activeKostDetail.ownerName,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        kostName: activeKostDetail.title
      };

      room = {
        id: chats.length + 1,
        kostId: activeKostDetail.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        ownerEmail: activeKostDetail.ownerEmail,
        ownerName: ownerObj.name,
        avatar: ownerObj.avatar,
        lastMessage: "Halo kak, apakah masih ada kamar kosong?",
        time: "Sekarang",
        messages: [
          { sender: "user", text: "Halo kak, apakah masih ada kamar kosong?", time: "Baru saja" }
        ]
      };
      chats.unshift(room);
      saveState();
      
      // Auto-reply after 2 seconds
      setTimeout(() => {
        room.messages.push({ sender: "owner", text: "Masih kak.", time: "Baru saja" });
        room.lastMessage = "Masih kak.";
        room.time = "Baru saja";
        saveState();
        if (activeChatRoomId === room.id) {
          renderChatRoomMessages(room);
        }
      }, 2000);
    }

    navigateToTab('seeker-chat');
    openChatRoom(room.id);
  };

  // RENDER SEEKER CHAT LIST
  const renderSeekerChatList = () => {
    const list = document.getElementById('seeker-chat-list');
    list.innerHTML = '';

    // Filter chats where user is current user
    const userChats = chats.filter(c => c.userEmail === currentUser.email);

    if (userChats.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <h3>Tidak Ada Percakapan</h3>
          <p>Cari kost dan hubungi owner untuk memulai percakapan.</p>
        </div>
      `;
    } else {
      userChats.forEach(c => {
        const item = document.createElement('div');
        item.className = 'chat-room-item';
        item.innerHTML = `
          <div class="avatar-wrapper">
            <img src="${c.avatar}" alt="Avatar" class="avatar-img">
            <span class="active-indicator"></span>
          </div>
          <div class="chat-room-details">
            <div class="chat-room-header">
              <span class="chat-room-name">${c.ownerName}</span>
              <span class="chat-room-time">${c.time}</span>
            </div>
            <div class="chat-room-kost-title">${c.kostTitle || 'Kost Properti'}</div>
            <div class="chat-room-preview">${c.lastMessage}</div>
          </div>
        `;
        item.onclick = () => {
          openChatRoom(c.id);
        };
        list.appendChild(item);
      });
    }
  };

  // RENDER SEEKER PROFILE
  const renderSeekerProfile = () => {
    if (!currentUser) return;
    document.getElementById('seeker-profile-avatar').src = currentUser.avatar;
    document.getElementById('seeker-profile-name').textContent = currentUser.name;
    document.getElementById('seeker-profile-email').textContent = currentUser.email;
    document.getElementById('seeker-profile-phone').textContent = currentUser.phone;
  };

  // --- 8. CHAT ROOM OVERLAY CONTROLLER ---

  const renderChatRoomMessages = (room) => {
    const container = document.getElementById('chat-room-messages');
    container.innerHTML = '';

    room.messages.forEach(m => {
      const bubble = document.createElement('div');
      bubble.className = `msg-bubble ${m.sender}`;
      bubble.innerHTML = `
        ${m.text}
        <span class="msg-time-stamp">${m.time}</span>
      `;
      container.appendChild(bubble);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  };

  const openChatRoom = (roomId) => {
    activeChatRoomId = roomId;
    const room = chats.find(c => c.id === roomId);
    if (!room) return;

    document.getElementById('chat-room-avatar').src = activeRole === 'seeker' ? room.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    document.getElementById('chat-room-title').textContent = activeRole === 'seeker' ? room.ownerName : room.userName;
    document.getElementById('chat-room-subtitle').textContent = room.kostTitle || 'Kost Putri';

    renderChatRoomMessages(room);
    document.getElementById('chat-room-overlay').classList.add('active');
  };

  // Close Chat Room
  document.getElementById('btn-close-chat-room').onclick = () => {
    document.getElementById('chat-room-overlay').classList.remove('active');
    activeChatRoomId = null;
    if (activeRole === 'seeker') {
      renderSeekerChatList();
    } else {
      renderOwnerChatList();
    }
  };

  // Send message submit
  const submitMessage = () => {
    const input = document.getElementById('chat-message-input');
    const text = input.value.trim();
    if (!text) return;

    const room = chats.find(c => c.id === activeChatRoomId);
    if (!room) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Add message
    room.messages.push({
      sender: activeRole === 'seeker' ? 'user' : 'owner',
      text: text,
      time: timeStr
    });
    room.lastMessage = text;
    room.time = timeStr;
    saveState();

    input.value = '';
    renderChatRoomMessages(room);

    // Simulated Auto-Reply
    if (activeRole === 'seeker') {
      setTimeout(() => {
        // Renters ask -> owners reply
        let reply = "Baik kak.";
        if (text.toLowerCase().includes('survei')) {
          reply = "Silakan kak, besok siang jam 1 bisa langsung datang ya.";
        } else if (text.toLowerCase().includes('harga') || text.toLowerCase().includes('bayar')) {
          reply = "Harga tercantum sudah nett ya kak, sudah bersih air dan WiFi.";
        } else {
          const replies = [
            "Bisa ditanyakan lagi kak apa yang perlu diperjelas.",
            "Kamar mandi dalam semua ya kak.",
            "Untuk survei bisa janjian dulu H-1.",
            "Sama-sama kak, ditunggu kedatangannya."
          ];
          reply = replies[Math.floor(Math.random() * replies.length)];
        }
        
        room.messages.push({
          sender: 'owner',
          text: reply,
          time: timeStr
        });
        room.lastMessage = reply;
        saveState();
        if (activeChatRoomId === room.id) {
          renderChatRoomMessages(room);
        }
      }, 1500);
    } else {
      // Owner replies -> user chats back
      setTimeout(() => {
        const replies = [
          "Baik bu, terima kasih banyak informasinya.",
          "Apakah besok kosnya bisa saya survei langsung?",
          "Saya berminat bu, nanti saya kabari lagi untuk pembayarannya.",
          "Ooh begitu, siap bu."
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        room.messages.push({
          sender: 'user',
          text: reply,
          time: timeStr
        });
        room.lastMessage = reply;
        saveState();
        if (activeChatRoomId === room.id) {
          renderChatRoomMessages(room);
        }
      }, 2000);
    }
  };

  document.getElementById('btn-send-message').onclick = submitMessage;
  document.getElementById('chat-message-input').onkeydown = (e) => {
    if (e.key === 'Enter') submitMessage();
  };


  // --- 9. OWNER VIEW CONTROLLERS ---

  // RENDER OWNER HOME
  const renderOwnerHome = () => {
    // Stats calculation
    const ownerKostList = kosts.filter(k => k.ownerEmail === currentOwner.email);
    const ownerChatList = chats.filter(c => c.ownerEmail === currentOwner.email);

    document.getElementById('owner-greeting-name').textContent = `Halo, ${currentOwner ? currentOwner.name.split(' ')[0] : 'Owner'}! 👋`;
    document.getElementById('owner-stat-total').textContent = ownerKostList.length;
    document.getElementById('owner-stat-chats').textContent = ownerChatList.length;
    document.getElementById('owner-stat-active').textContent = ownerKostList.length;

    // Render list in dashboard
    const container = document.getElementById('owner-property-list');
    container.innerHTML = '';

    if (ownerKostList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <h3>Belum Ada Kost</h3>
          <p>Mulai tambahkan kos milik Anda di menu Kelola Kost.</p>
        </div>
      `;
    } else {
      ownerKostList.forEach(k => {
        container.appendChild(createKostCardForOwnerDashboard(k));
      });
    }
  };

  // Card Creator for Owner dashboard
  const createKostCardForOwnerDashboard = (k) => {
    const card = document.createElement('div');
    card.className = 'kost-card';
    const priceFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(k.price);

    card.innerHTML = `
      <div class="kost-card-img-container" style="height: 120px;">
        <img src="${k.images[0]}" alt="${k.title}" onerror="this.src='https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'">
        <span class="kost-type-badge">${k.type}</span>
      </div>
      <div class="kost-card-body">
        <h4 class="kost-card-title" style="font-size: 14px; margin-bottom: 2px;">${k.title}</h4>
        <div class="kost-card-loc-row" style="margin-bottom: 8px;">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
          <span>${k.location}</span>
        </div>
        <div style="font-size: 13px; font-weight: 800; color: var(--primary-dark)">
          ${priceFormatted.replace('Rp', 'Rp ')} <span style="font-size: 10px; font-weight:normal; color:var(--text-muted)">/ bln</span>
        </div>
      </div>
    `;
    return card;
  };

  // RENDER OWNER KELOLA KOST PAGE LISTING
  const renderOwnerManageList = () => {
    const container = document.getElementById('owner-manage-list');
    container.innerHTML = '';

    const ownerKostList = kosts.filter(k => k.ownerEmail === currentOwner.email);

    if (ownerKostList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <h3>Belum Ada Listing Kost</h3>
          <p>Gunakan tombol "+" di bawah untuk mendaftarkan kost baru.</p>
        </div>
      `;
    } else {
      ownerKostList.forEach(k => {
        const priceFormatted = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(k.price);

        const card = document.createElement('div');
        card.className = 'owner-property-card';
        card.innerHTML = `
          <div class="owner-prop-details">
            <h4 class="owner-prop-title">${k.title}</h4>
            <div class="owner-prop-price">${priceFormatted.replace('Rp', 'Rp ')} <span style="font-weight:normal; color:var(--text-muted)">/ bln</span></div>
            <div style="font-size:11px; color:var(--text-light); margin-top:2px;">📍 ${k.location}</div>
          </div>
          <div class="owner-prop-actions">
            <button class="btn-icon-action edit" title="Edit Kost">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon-action delete" title="Hapus Kost">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        `;

        // Action Handlers
        card.querySelector('.edit').onclick = () => {
          showToast('Fungsi Edit: Data kost siap diperbarui (Dummy)');
        };

        card.querySelector('.delete').onclick = () => {
          openConfirmDeleteDialog(k.id);
        };

        container.appendChild(card);
      });
    }
  };

  // ADD NEW KOST FORM MANAGEMENT
  const addKostSheet = document.getElementById('add-kost-sheet');
  const backdrop = document.getElementById('modal-backdrop');

  document.getElementById('btn-open-add-kost').onclick = () => {
    addKostSheet.classList.add('active');
    backdrop.classList.add('active');
  };

  const closeAddKostSheet = () => {
    addKostSheet.classList.remove('active');
    backdrop.classList.remove('active');
  };

  document.getElementById('btn-close-add-kost').onclick = closeAddKostSheet;
  backdrop.onclick = () => {
    closeAddKostSheet();
    closeConfirmDialog();
  };

  // Form Submit Add Kost
  document.getElementById('form-add-kost').onsubmit = (e) => {
    e.preventDefault();
    
    const title = document.getElementById('add-kost-name').value.trim();
    const price = parseInt(document.getElementById('add-kost-price-val').value);
    const location = document.getElementById('add-kost-loc').value.trim();
    const address = document.getElementById('add-kost-addr').value.trim();
    const size = document.getElementById('add-kost-size-val').value.trim();
    const type = document.getElementById('add-kost-type-select').value;
    const description = document.getElementById('add-kost-desc-val').value.trim();
    const image = document.getElementById('add-kost-photo-select').value;

    // Facilities checkboxes
    const facilities = [];
    document.querySelectorAll('.add-fac-cb:checked').forEach(cb => {
      facilities.push(cb.value);
    });

    const newKost = {
      id: kosts.length > 0 ? Math.max(...kosts.map(k => k.id)) + 1 : 1,
      title,
      price,
      location,
      address,
      rating: 5.0,
      views: 0,
      images: [image, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"],
      type,
      facilities: facilities.length > 0 ? facilities : ["WiFi", "Kasur"],
      rules: ["Khusus mahasiswi", "Menjaga sopan santun", "Tamu dilarang gaduh"],
      size,
      description,
      ownerEmail: currentOwner.email,
      ownerName: currentOwner.name
    };

    kosts.unshift(newKost);
    saveState();
    showToast('Kost baru berhasil ditambahkan! 🌸');

    // Reset and Close
    document.getElementById('form-add-kost').reset();
    closeAddKostSheet();
    
    // Refresh List
    navigateToTab('owner-manage');
  };

  // CONFIRMATION DIALOG MANAGER FOR PROPERTY DELETION
  const confirmDialog = document.getElementById('confirm-dialog');

  const openConfirmDeleteDialog = (id) => {
    propertyToDeleteId = id;
    confirmDialog.classList.add('active');
    backdrop.classList.add('active');
  };

  const closeConfirmDialog = () => {
    confirmDialog.classList.remove('active');
    backdrop.classList.remove('active');
    propertyToDeleteId = null;
  };

  document.getElementById('btn-confirm-cancel').onclick = closeConfirmDialog;

  document.getElementById('btn-confirm-ok').onclick = () => {
    if (propertyToDeleteId) {
      // Filter out item
      kosts = kosts.filter(k => k.id !== propertyToDeleteId);
      saveState();
      
      showToast('Listing Kost berhasil dihapus!');
      closeConfirmDialog();
      renderOwnerManageList();
    }
  };

  // RENDER OWNER CHAT LIST
  const renderOwnerChatList = () => {
    const list = document.getElementById('owner-chat-list');
    list.innerHTML = '';

    const ownerChats = chats.filter(c => c.ownerEmail === currentOwner.email);

    if (ownerChats.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <h3>Belum Ada Chat Masuk</h3>
          <p>Calon penyewa akan muncul di sini ketika mereka menghubungi Anda.</p>
        </div>
      `;
    } else {
      ownerChats.forEach(c => {
        const item = document.createElement('div');
        item.className = 'chat-room-item';
        item.innerHTML = `
          <div class="avatar-wrapper">
            <!-- Renter avatar default -->
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Avatar" class="avatar-img">
            <span class="active-indicator"></span>
          </div>
          <div class="chat-room-details">
            <div class="chat-room-header">
              <span class="chat-room-name">${c.userName}</span>
              <span class="chat-room-time">${c.time}</span>
            </div>
            <div class="chat-room-kost-title">${c.kostTitle}</div>
            <div class="chat-room-preview">${c.lastMessage}</div>
          </div>
        `;
        item.onclick = () => {
          openChatRoom(c.id);
        };
        list.appendChild(item);
      });
    }
  };

  // RENDER OWNER PROFILE
  const renderOwnerProfile = () => {
    if (!currentOwner) return;
    document.getElementById('owner-profile-avatar').src = currentOwner.avatar;
    document.getElementById('owner-profile-name').textContent = currentOwner.name;
    document.getElementById('owner-profile-kostname').textContent = currentOwner.kostName;
    document.getElementById('owner-profile-email').textContent = currentOwner.email;
    document.getElementById('owner-profile-phone').textContent = currentOwner.phone;
  };

  // --- 10. BOOTSTRAP APP ON LOAD ---
  checkInitialSession();

});
