lucide.createIcons();

// ===== Profile dropdown =====
(function () {
  const wrap = document.getElementById("profileWrap");
  const btn  = document.getElementById("profileBtn");
  if (!wrap || !btn) return;

  function setOpen(open) {
    wrap.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  }
  btn.addEventListener("click", e => {
    e.stopPropagation();
    setOpen(!wrap.classList.contains("open"));
  });
  document.addEventListener("click", e => { if (!wrap.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
})();

// ===== Help dropdown =====
(function () {
  const wrap = document.getElementById("helpWrap");
  const btn  = document.getElementById("helpBtn");
  if (!wrap || !btn) return;

  function setOpen(open) {
    wrap.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  }
  btn.addEventListener("click", () => setOpen(!wrap.classList.contains("open")));
  document.addEventListener("click", e => { if (!wrap.contains(e.target)) setOpen(false); }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
})();

// ===== Search bar =====
(function () {
  const box = document.getElementById("search");
  if (!box) return;

  const searchData = [
    { group: "Universities", title: "University of Ghana",   meta: "Accra",   icon: "graduation-cap", href: "#" },
    { group: "Universities", title: "University of Nairobi", meta: "Nairobi", icon: "graduation-cap", href: "#" },
    { group: "Universities", title: "Makerere University",   meta: "Kampala", icon: "graduation-cap", href: "#" },
    { group: "Events",  title: "Universities Leadership Forum",     meta: "Nov 2026", icon: "calendar",  href: "#" },
    { group: "Reports", title: "Member universities annual report", meta: "PDF",      icon: "file-text", href: "#" }
  ];

  const input = document.getElementById("searchInput");
  const scope = document.getElementById("searchScope");
  const results = document.getElementById("searchResults");
  const clearBtn = document.getElementById("searchClear");
  let shown = [];
  let active = -1;

  const esc = s => s.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function closeResults() { results.hidden = true; }

  function setActive(i) {
    active = i;
    results.querySelectorAll(".sr-item").forEach((el, idx) =>
      el.classList.toggle("active", idx === active));
  }

  function render() {
    const q = input.value.trim().toLowerCase();
    box.classList.toggle("has-text", q.length > 0);
    if (!q) { closeResults(); return; }

    const s = scope.value;
    shown = searchData.filter(i =>
      (s === "All" || i.group === s) && i.title.toLowerCase().includes(q));
    active = shown.length ? 0 : -1;

    let html = "", last = "";
    shown.forEach((item, idx) => {
      if (item.group !== last) {
        html += `<div class="sr-group">${item.group}</div>`;
        last = item.group;
      }
      html += `<a class="sr-item${idx === active ? " active" : ""}" href="${item.href}" data-index="${idx}">
        <span class="sr-icon"><i data-lucide="${item.icon}"></i></span>
        <span class="sr-title">${esc(item.title)}</span>
        <span class="sr-meta">${esc(item.meta)}</span>
      </a>`;
    });
    if (!shown.length) html = `<div class="sr-empty">No results for "${esc(input.value)}"</div>`;
    html += `<div class="sr-foot"><span>↑↓ navigate</span><span>Enter open</span><span>Esc close</span></div>`;

    results.innerHTML = html;
    results.hidden = false;
    lucide.createIcons();
  }

  input.addEventListener("input", render);
  scope.addEventListener("change", render);

  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" && shown.length) { e.preventDefault(); setActive((active + 1) % shown.length); }
    if (e.key === "ArrowUp" && shown.length)   { e.preventDefault(); setActive((active - 1 + shown.length) % shown.length); }
    if (e.key === "Enter" && shown[active])    { window.location.href = shown[active].href; }
    if (e.key === "Escape") { closeResults(); input.blur(); }
  });

  results.addEventListener("mouseover", e => {
    const el = e.target.closest(".sr-item");
    if (el) setActive(Number(el.dataset.index));
  });

  clearBtn.addEventListener("click", () => { input.value = ""; render(); input.focus(); });
  document.addEventListener("click", e => { if (!box.contains(e.target)) closeResults(); });

  document.addEventListener("keydown", e => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); input.focus(); }
  });
})();

// ===== Mobile menu (hamburger) =====
(function () {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const scrim = document.getElementById("scrim");
  if (!sidebar || !menuBtn || !scrim) return;

  const openMenu  = () => { sidebar.classList.add("open");    scrim.classList.add("show"); };
  const closeMenu = () => { sidebar.classList.remove("open"); scrim.classList.remove("show"); };

  menuBtn.addEventListener("click", openMenu);
  scrim.addEventListener("click", closeMenu);
  document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
})();

// ===== Dashboard: chart + events (only on the Dashboard) =====
if (document.getElementById("bars")) {
  const countries = [
    ["Nigeria", 52], ["Ghana", 30], ["Egypt", 26], ["Sudan", 20],
    ["South Africa", 18], ["Kenya", 14], ["Uganda", 14]
  ];

  const events = [
    ["5-9", "oct", "Academic Leadership Summit", "Accra, Ghana"],
    ["21-23", "oct", "Di-Hack (Disability Hackathon)", "Accra, Ghana"],
    ["24", "oct", "Canada Immigration Seminar", "Accra, Ghana"],
    ["24", "oct", "Businesses &amp; Entrepreneurs Canadian Immigration Seminar", "Accra, Ghana"]
  ];

  const max = Math.max(...countries.map(c => c[1]));
  document.getElementById("bars").innerHTML = countries.map(([name, value], i) => `
    <div class="bar-col">
      <b class="bar-value">${value}</b>
      <div class="bar ${i === 0 ? "top" : ""}" style="height:${Math.round(value / max * 220)}px"></div>
      <span>${name}</span>
    </div>`).join("");

  document.getElementById("eventList").innerHTML = events.map(([day, month, title, place]) => `
    <li class="event">
      <div class="event-date"><b>${day}</b><small>${month}</small></div>
      <div class="event-info">
        <strong>${title}</strong>
        <span><i data-lucide="map-pin"></i>${place}</span>
      </div>
    </li>`).join("");

    // ===== Sidebar: highlight the page you are on =====
(function () {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const on = a.getAttribute("href") === here;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
})();

  lucide.createIcons();
}

// ===== Universities: list + search =====
(function () {
  const body = document.getElementById("uniBody");
  const input = document.getElementById("uniSearch");
  if (!body || !input) return;

  // name, country, year joined, status (add more lines here)
  const universities = [
    ["University of Ghana", "Ghana", 1967, "Full"],
    ["Kwame Nkrumah University of Science and Technology", "Ghana", 1967, "Full"],
    ["University of Cape Coast", "Ghana", 1967, "Full"],
    ["University of Nairobi", "Kenya", 1967, "Full"],
    ["Kenyatta University", "Kenya", 1985, "Full"],
    ["Moi University", "Kenya", 1985, "Full"],
    ["Ain Shams University", "Egypt", 1967, "Full"],
    ["Cairo University", "Egypt", 1967, "Full"],
    ["Alexandria University", "Egypt", 1967, "Full"],
    ["Welwitchia University", "Namibia", 2024, "Associate"],
    ["University of Namibia", "Namibia", 1992, "Full"],
    ["University of Rwanda", "Rwanda", 1967, "Full"],
    ["Makerere University", "Uganda", 1967, "Full"],
    ["University of Dar es Salaam", "Tanzania", 1967, "Full"],
    ["University of Lagos", "Nigeria", 1967, "Full"],
    ["University of Ibadan", "Nigeria", 1967, "Full"],
    ["Obafemi Awolowo University", "Nigeria", 1975, "Full"],
    ["Ahmadu Bello University", "Nigeria", 1975, "Full"],
    ["University of Cape Town", "South Africa", 1995, "Full"],
    ["University of the Witwatersrand", "South Africa", 1995, "Full"],
    ["Stellenbosch University", "South Africa", 1995, "Full"],
    ["Universite Cheikh Anta Diop", "Senegal", 1967, "Full"],
    ["University of Khartoum", "Sudan", 1967, "Full"],
    ["Addis Ababa University", "Ethiopia", 1967, "Full"],
    ["University of Zambia", "Zambia", 1970, "Full"],
    ["University of Zimbabwe", "Zimbabwe", 1981, "Full"],
    ["University of Malawi", "Malawi", 1970, "Full"],
    ["Universite Mohammed V", "Morocco", 1967, "Full"],
    ["University of Tunis El Manar", "Tunisia", 1990, "Associate"]
  ];

  const empty = document.getElementById("uniEmpty");
  const count = document.getElementById("uniCount");

  function render(list) {
    body.innerHTML = list.map(([name, country, year, status]) => {
      const type = status === "Full" ? "full" : "assoc";
      return `
      <tr>
        <td>${name}</td>
        <td>${country}</td>
        <td>${year}</td>
        <td><button type="button" class="badge ${type}" data-type="${type}" aria-expanded="false">${status}</button></td>
        <td><a href="#" class="visit">Visit</a></td>
      </tr>`;
    }).join("");

    count.textContent = `Showing ${list.length} of ${universities.length} universities`;
    empty.hidden = list.length !== 0;
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    render(universities.filter(u => u.join(" ").toLowerCase().includes(q)));
  });

  render(universities);
})();

// ===== Universities: overlay messages on the top four cards =====
(function () {
  const wraps = [...document.querySelectorAll(".uni-stat-wrap")];
  if (!wraps.length) return;

  function closeAll(except) {
    wraps.forEach(w => {
      if (w !== except) {
        w.classList.remove("open");
        w.querySelector(".uni-stat").setAttribute("aria-expanded", "false");
      }
    });
  }

  wraps.forEach(w => {
    const btn = w.querySelector(".uni-stat");
    btn.addEventListener("click", () => {
      const open = !w.classList.contains("open");
      closeAll(open ? w : null);
      w.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".uni-stat-wrap")) closeAll(null);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(null); });
})();

// ===== Status badge overlay (Universities + Applications) =====
(function () {
  const messages = {
    full:  "This university is a full member of the AAU",
    assoc: "This university is an associate member of the AAU"
  };

  const ov = document.createElement("div");
  ov.id = "badgeOv";
  ov.className = "badge-ov";
  ov.setAttribute("role", "tooltip");
  document.body.appendChild(ov);

  let current = null;

  function close() {
    ov.classList.remove("show");
    if (current) { current.setAttribute("aria-expanded", "false"); current = null; }
  }

  function open(btn) {
    const type = btn.dataset.type;
    ov.textContent = btn.dataset.msg || messages[type];
    ov.className = "badge-ov " + type;

    const r = btn.getBoundingClientRect();
    const w = ov.offsetWidth, h = ov.offsetHeight;
    const up = r.bottom + 10 + h > window.innerHeight - 12;
    ov.style.left = Math.max(12, Math.min(r.left, window.innerWidth - w - 12)) + "px";
    ov.style.top  = (up ? r.top - 10 - h : r.bottom + 10) + "px";
    ov.classList.toggle("up", up);

    void ov.offsetWidth;
    ov.classList.add("show");
    btn.setAttribute("aria-expanded", "true");
    current = btn;
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("button.badge");
    if (btn) {
      if (btn === current) { close(); }
      else { close(); open(btn); }
    } else {
      close();
    }
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  document.addEventListener("scroll", close, true);
  window.addEventListener("resize", close);
})();
// ===== Support form (demo) =====
(function () {
  const form = document.getElementById("supportForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("formDone").hidden = false;
    form.reset();
  });
})();
// ===== Applications page =====
(function () {
  const body = document.getElementById("appBody");
  if (!body) return;

  // institution, country, date, status
  const applications = [
    ["Zetech University", "Kenya", "April 2026", "Approved"],
    ["Université Sultan Moulay Slimane", "Morocco", "21 July 2025", "Approved"],
    ["William V.S. Tubman University", "Liberia", "Aug 2024", "Approved"],
    ["IU International University of Applied Sciences", "Germany", "Nov 2022", "Approved"],
    ["AAU Institute of Science", "Ghana", "Nov 2019", "Pending"]
  ];

  const messages = {
    Approved: "This application has been approved",
    Pending:  "This application has not been approved"
  };

  body.innerHTML = applications.map(([name, country, date, status]) => {
    const type = status === "Approved" ? "full" : "assoc";    // green or gold
    return `
      <tr>
        <td>${name}</td>
        <td>${country}</td>
        <td>${date}</td>
        <td><button type="button" class="badge ${type}" data-type="${type}"
                    data-msg="${messages[status]}" aria-expanded="false">${status}</button></td>
      </tr>`;
  }).join("");

  const count = s => applications.filter(a => a[3] === s).length;
  document.getElementById("appTotal").textContent = applications.length;
  document.getElementById("appApproved").textContent = count("Approved");
  document.getElementById("appPending").textContent = count("Pending");
})();
// ===== Events page =====
(function () {
  const body  = document.getElementById("evBody");
  const input = document.getElementById("evSearch");
  if (!body || !input) return;

  // event, date, location, status
  const events = [
    ["Academic Leadership Summit", "5-9 Oct 2026", "Accra", "Ongoing"],
    ["DI-Hack (Disability Hackathon)", "21-23 Oct 2026", "Accra", "Scheduled"],
    ["Canada Immigration Seminar", "24 Oct 2026", "Accra", "Scheduled"],
    ["Businesses & Entrepreneurs Canadian Immigration Seminar", "24 Oct 2026", "Accra", "Scheduled"],
    ["Workshop on Safety and Security in African Universities", "2-4 Dec 2026", "Thohoyandou", "Scheduled"]
  ];

  const messages = {
    Ongoing:   "This event is currently happening",
    Scheduled: "This is yet to happen"
  };

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const empty = document.getElementById("evEmpty");
  const count = document.getElementById("evCount");

  function render(list) {
    body.innerHTML = list.map(([name, date, place, status]) => `
      <tr>
        <td>${esc(name)}</td>
        <td>${esc(date)}</td>
        <td>${esc(place)}</td>
        <td><button type="button" class="badge ${status.toLowerCase()}" data-type="full"
                    data-msg="${messages[status]}" aria-expanded="false">${status}</button></td>
      </tr>`).join("");

    count.textContent = `Showing ${list.length} of ${events.length} events`;
    empty.hidden = list.length !== 0;
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    render(events.filter(e => e.join(" ").toLowerCase().includes(q)));
  });

  // ---------- New Event form ----------
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const part = s => { const [y, m, d] = s.split("-").map(Number); return { y, m, d }; };

  function formatRange(start, end) {                  // turns two dates into text like "5-9 Oct 2026"
    const a = part(start);
    if (!end || end === start) return `${a.d} ${MONTHS[a.m - 1]} ${a.y}`;
    const b = part(end);
    if (a.y === b.y && a.m === b.m) return `${a.d}-${b.d} ${MONTHS[a.m - 1]} ${a.y}`;
    if (a.y === b.y) return `${a.d} ${MONTHS[a.m - 1]} - ${b.d} ${MONTHS[b.m - 1]} ${a.y}`;
    return `${a.d} ${MONTHS[a.m - 1]} ${a.y} - ${b.d} ${MONTHS[b.m - 1]} ${b.y}`;
  }

  const modal   = document.getElementById("evModal");
  const form    = document.getElementById("evForm");
  const openBtn = document.querySelector(".btn-new");
  const err     = document.getElementById("evErr");

  function openModal() {
    form.reset();
    err.hidden = true;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    setTimeout(() => document.getElementById("evName").focus(), 50);
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name   = document.getElementById("evName").value.trim();
    const start  = document.getElementById("evStart").value;
    const end    = document.getElementById("evEnd").value;
    const place  = document.getElementById("evPlace").value.trim();
    const status = document.getElementById("evStatus").value;

    if (end && end < start) {
      err.textContent = "The end date cannot be before the start date.";
      err.hidden = false;
      return;
    }

    events.unshift([name, formatRange(start, end), place, status]);   // new event goes to the top
    input.value = "";
    render(events);
    closeModal();
  });

  render(events);
})();
// ===== Programmes page =====
(function () {
  const body = document.getElementById("pgBody");
  if (!body) return;

  // programme, focus, listed in
  const programmes = [
    ["Database of African Theses and Dissertations (DATAD)", "Research visibility", "2016-2020 Strategic Plan"],
    ["Academic Staff Exchange Programme", "Staff mobility", "2016-2020 Strategic Plan"],
    ["Small Grants for Theses and Dissertations", "Research funding", "2016-2020 Strategic Plan"],
    ["Quality Assurance Support Programme", "Quality assurance", "2016-2020 Strategic Plan"],
    ["Research and Education Networks Unit (RENU)", "ICT for universities", "2016-2020 Strategic Plan"]
  ];

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function render() {
    body.innerHTML = programmes.map(([name, focus, listed], i) => `
      <tr>
        <td>${esc(name)}</td>
        <td>${esc(focus)}</td>
        <td>${esc(listed)}</td>
        <td>
          <div class="row-acts">
            <button type="button" class="act" data-view="${i}" aria-label="View"><i data-lucide="eye"></i></button>
            <button type="button" class="act" data-edit="${i}" aria-label="Edit"><i data-lucide="pencil"></i></button>
            <button type="button" class="act del" data-del="${i}" aria-label="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`).join("");
    lucide.createIcons();
  }

  const formModal = document.getElementById("pgModal");
  const viewModal = document.getElementById("pgView");
  const form      = document.getElementById("pgForm");
  const title     = document.getElementById("pgTitle");
  const submitBtn = form.querySelector('[type="submit"]');
  const openBtn   = document.getElementById("pgNew");
  const f = {
    name:   document.getElementById("pgName"),
    focus:  document.getElementById("pgFocus"),
    listed: document.getElementById("pgListed")
  };
  let editing = -1;      // -1 means "adding a new programme"
  let viewing = -1;

  const show = m => { m.classList.add("open");    m.setAttribute("aria-hidden", "false"); };
  const hide = m => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); };

  function openForm(i) {
    editing = i;
    form.reset();
    if (i >= 0) {                                   // edit: fill in the current details
      f.name.value   = programmes[i][0];
      f.focus.value  = programmes[i][1];
      f.listed.value = programmes[i][2];
      title.textContent = "Edit Programme";
      submitBtn.textContent = "Save changes";
    } else {                                        // add: empty form
      title.textContent = "Add Programme";
      submitBtn.textContent = "Add programme";
    }
    show(formModal);
    setTimeout(() => f.name.focus(), 50);
  }

  function openView(i) {
    viewing = i;
    document.getElementById("pvName").textContent   = programmes[i][0];
    document.getElementById("pvFocus").textContent  = programmes[i][1];
    document.getElementById("pvListed").textContent = programmes[i][2];
    show(viewModal);
  }

  // eye, pencil and trash icons in the table
  body.addEventListener("click", e => {
    const v  = e.target.closest("[data-view]");
    const ed = e.target.closest("[data-edit]");
    const d  = e.target.closest("[data-del]");
    if (v) openView(Number(v.dataset.view));
    else if (ed) openForm(Number(ed.dataset.edit));
    else if (d) {
      const i = Number(d.dataset.del);
      if (confirm(`Delete "${programmes[i][0]}"?`)) { programmes.splice(i, 1); render(); }
    }
  });

  openBtn.addEventListener("click", () => openForm(-1));
  document.getElementById("pvEdit").addEventListener("click", () => { hide(viewModal); openForm(viewing); });

  [formModal, viewModal].forEach(m =>
    m.addEventListener("click", e => { if (e.target.closest("[data-close]")) hide(m); }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { hide(formModal); hide(viewModal); }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const row = [f.name.value.trim(), f.focus.value.trim(), f.listed.value.trim()];
    if (editing >= 0) programmes[editing] = row;    // save changes to the existing row
    else programmes.unshift(row);                   // or add a new row at the top
    render();
    hide(formModal);
  });

  render();
})();
// ===== Partnerships page =====
(function () {
  const body = document.getElementById("pnBody");
  if (!body) return;

  // partner, type, since
  const partners = [
    ["African Union Commission", "Intergovernmental", 2007],
    ["UbuntuNet Alliance", "Research network", 2008],
    ["StarTimes", "Media", 2020],
    ["University of Nottingham", "University", 2023],
    ["Federal University of Rio de Janeiro (UFRJ)", "University", 2024]
  ];

  const MSG = "A Memorandum of Understanding has been signed";

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function render() {
    body.innerHTML = partners.map(([name, type, since], i) => `
      <tr>
        <td>${esc(name)}</td>
        <td>${esc(type)}</td>
        <td>${since}</td>
        <td><button type="button" class="badge full" data-type="full"
                    data-msg="${MSG}" aria-expanded="false">Signed MoU</button></td>
        <td>
          <div class="row-acts">
            <button type="button" class="act" data-view="${i}" aria-label="View"><i data-lucide="eye"></i></button>
            <button type="button" class="act" data-edit="${i}" aria-label="Edit"><i data-lucide="pencil"></i></button>
            <button type="button" class="act del" data-del="${i}" aria-label="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`).join("");
    lucide.createIcons();
  }

  const formModal = document.getElementById("pnModal");
  const viewModal = document.getElementById("pnView");
  const form      = document.getElementById("pnForm");
  const title     = document.getElementById("pnTitle");
  const submitBtn = form.querySelector('[type="submit"]');
  const openBtn   = document.getElementById("pnNew");
  const f = {
    name:  document.getElementById("pnName"),
    type:  document.getElementById("pnType"),
    since: document.getElementById("pnSince")
  };
  let editing = -1;      // -1 means "adding a new partnership"
  let viewing = -1;

  const show = m => { m.classList.add("open");    m.setAttribute("aria-hidden", "false"); };
  const hide = m => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); };

  function openForm(i) {
    editing = i;
    form.reset();
    if (i >= 0) {
      f.name.value  = partners[i][0];
      f.type.value  = partners[i][1];
      f.since.value = partners[i][2];
      title.textContent = "Edit Partnership";
      submitBtn.textContent = "Save changes";
    } else {
      title.textContent = "Add Partnership";
      submitBtn.textContent = "Add partnership";
    }
    show(formModal);
    setTimeout(() => f.name.focus(), 50);
  }

  function openView(i) {
    viewing = i;
    document.getElementById("pvName").textContent  = partners[i][0];
    document.getElementById("pvType").textContent  = partners[i][1];
    document.getElementById("pvSince").textContent = partners[i][2];
    show(viewModal);
  }

  body.addEventListener("click", e => {
    const v  = e.target.closest("[data-view]");
    const ed = e.target.closest("[data-edit]");
    const d  = e.target.closest("[data-del]");
    if (v) openView(Number(v.dataset.view));
    else if (ed) openForm(Number(ed.dataset.edit));
    else if (d) {
      const i = Number(d.dataset.del);
      if (confirm(`Delete "${partners[i][0]}"?`)) { partners.splice(i, 1); render(); }
    }
  });

  openBtn.addEventListener("click", () => openForm(-1));
  document.getElementById("pvEdit").addEventListener("click", () => { hide(viewModal); openForm(viewing); });

  [formModal, viewModal].forEach(m =>
    m.addEventListener("click", e => { if (e.target.closest("[data-close]")) hide(m); }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { hide(formModal); hide(viewModal); }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const row = [f.name.value.trim(), f.type.value, Number(f.since.value)];
    if (editing >= 0) partners[editing] = row;
    else partners.push(row);
    render();
    hide(formModal);
  });

  render();
})();
// ===== Settings page =====
(function () {
  const form = document.getElementById("setForm");
  if (!form) return;

  const ids = ["setOrg", "setEmail", "setLang", "setZone"];
  const KEY = "aauSettings";
  const note = document.getElementById("setNote");
  let timer;

  // show the saved values when the page opens
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    ids.forEach(id => { if (saved[id] !== undefined) document.getElementById(id).value = saved[id]; });
  } catch (e) {}

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = {};
    ids.forEach(id => { data[id] = document.getElementById(id).value.trim(); });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}

    note.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => note.classList.remove("show"), 2500);
  });
})();