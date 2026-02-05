// Graham’s Workout Plan — Logging + Profile + History (localStorage autosave)
// - Log weight + reps per set with target reps
// - Profile page stores athlete info
// - History page stores saved sessions (tap "Save Workout to History")

const PROGRAM = {
  day1: {
    title: "Day 1 – Lower Body Power",
    note: "Goal: strong legs + explosiveness. Leave 2 reps in the tank (RPE ~7–8).",
    exercises: [
      { name: "Back Squat", sets: 3, targetReps: 5, link: "https://www.youtube.com/watch?v=Dy28eq2PjcM" },
      { name: "Romanian Deadlift", sets: 3, targetReps: 8, link: "https://www.youtube.com/watch?v=0Y8sJzQGf0k" },
      { name: "Walking Lunges", sets: 2, targetReps: 10, link: "https://www.youtube.com/watch?v=ReNofXwy_js" },
      { name: "Box Jumps", sets: 3, targetReps: 3, link: "https://www.youtube.com/watch?v=52r_Ul5k03g" },
      { name: "Calf Raises", sets: 2, targetReps: 15, link: "https://www.youtube.com/watch?v=k8ipHzKeAkQ" }
    ]
  },
  day2: {
    title: "Day 2 – Upper Body Strength",
    note: "Goal: push + pull strength for blocking, tackling, and durability.",
    exercises: [
      { name: "Bench Press", sets: 3, targetReps: 5, link: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
      { name: "Pull-Ups (or Lat Pulldown)", sets: 3, targetReps: 6, link: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
      { name: "Dumbbell Shoulder Press", sets: 3, targetReps: 8, link: "https://www.youtube.com/watch?v=B-aVuyhvLHU" },
      { name: "Barbell Row", sets: 3, targetReps: 8, link: "https://www.youtube.com/watch?v=RQU8wZPbioA" },
      { name: "Plank Hold (seconds)", sets: 3, targetReps: 40, link: "https://www.youtube.com/watch?v=pSHjTRCQxIw" }
    ]
  },
  day3: {
    title: "Day 3 – Speed & Athleticism",
    note: "Goal: move heavy + move fast. Fast reps, perfect form, no grinding.",
    exercises: [
      { name: "Trap Bar Deadlift", sets: 3, targetReps: 5, link: "https://www.youtube.com/watch?v=JWz6KcRz3AI" },
      { name: "Broad Jumps", sets: 3, targetReps: 3, link: "https://www.youtube.com/watch?v=5Vb5P3X5VOU" },
      { name: "Sled Push (or Heavy March)", sets: 4, targetReps: 20, link: "https://www.youtube.com/watch?v=U5zrloYWwxw" }, // treat as seconds or yards
      { name: "Med Ball Slams", sets: 3, targetReps: 8, link: "https://www.youtube.com/watch?v=9RrR2nJ4zvM" },
      { name: "Farmer Carries (seconds)", sets: 3, targetReps: 40, link: "https://www.youtube.com/watch?v=lLAw6fUccKA" }
    ]
  }
};

// ---------- Storage ----------
const KEY = "grahams-workout-plan:v3";

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function uid() {
  // simple unique id
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return {
      activeTab: "day1",
      date: todayISO(),
      profile: {
        name: "Graham",
        age: "14",
        grade: "",
        height: "",
        weight: "",
        position: "",
        goals: "Strength + speed"
      },
      notes: { day1: "", day2: "", day3: "" },
      logs: { day1: {}, day2: {}, day3: {} },
      // history: array of saved sessions
      history: []
    };
  }
  const parsed = JSON.parse(raw);

  // Backward compatibility if older version had activeDay:
  if (parsed.activeDay && !parsed.activeTab) parsed.activeTab = parsed.activeDay;
  if (!parsed.history) parsed.history = [];

  return parsed;
}

function saveState() {
  localStorage.setItem(KEY, JSON.stringify(APP));
}

function ensureExerciseLog(day, ex) {
  if (!APP.logs[day][ex.name]) {
    APP.logs[day][ex.name] = Array.from({ length: ex.sets }).map(() => ({ weight: "", reps: "" }));
  } else if (APP.logs[day][ex.name].length !== ex.sets) {
    const current = APP.logs[day][ex.name];
    APP.logs[day][ex.name] = Array.from({ length: ex.sets }).map((_, i) => current[i] || ({ weight: "", reps: "" }));
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function hasAnyEntries(dayKey) {
  const dayLogs = APP.logs[dayKey] || {};
  return Object.values(dayLogs).some(sets =>
    (sets || []).some(s => (String(s.weight || "").trim() !== "" || String(s.reps || "").trim() !== ""))
  ) || String(APP.notes[dayKey] || "").trim() !== "";
}

// ---------- UI ----------
const view = document.getElementById("view");
const tabs = document.querySelectorAll(".tab");
let APP = loadState();

// Tabs
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    APP.activeTab = tab.dataset.day;
    saveState();
    render();
  });
});

// Set correct active tab on load
tabs.forEach(t => t.classList.toggle("active", t.dataset.day === APP.activeTab));

function render() {
  if (APP.activeTab === "profile") return renderProfile();
  if (APP.activeTab === "history") return renderHistory();
  return renderDay(APP.activeTab);
}

function renderProfile() {
  const p = APP.profile;

  view.innerHTML = `
    <div class="card">
      <h2>Profile</h2>
      <p class="small">Saved on this iPhone only (no account).</p>

      <div class="grid">
        <div>
          <label>Name</label>
          <input id="p_name" value="${escapeHtml(p.name)}" />
        </div>
        <div>
          <label>Age</label>
          <input id="p_age" inputmode="numeric" value="${escapeHtml(p.age)}" />
        </div>
        <div>
          <label>Grade</label>
          <input id="p_grade" value="${escapeHtml(p.grade)}" />
        </div>
      </div>

      <div class="grid">
        <div>
          <label>Height</label>
          <input id="p_height" placeholder="e.g., 5'8&quot;" value="${escapeHtml(p.height)}" />
        </div>
        <div>
          <label>Weight</label>
          <input id="p_weight" placeholder="e.g., 140 lb" value="${escapeHtml(p.weight)}" />
        </div>
        <div>
          <label>Football Position</label>
          <input id="p_position" placeholder="e.g., RB, LB, OL" value="${escapeHtml(p.position)}" />
        </div>
      </div>

      <div style="margin-top:10px;">
        <label>Goals</label>
        <input id="p_goals" value="${escapeHtml(p.goals)}" />
      </div>

      <div class="actions" style="margin-top:12px;">
        <button id="saveProfile">Save Profile</button>
        <button class="secondary" id="resetProfile">Reset Profile</button>
      </div>
    </div>
  `;

  view.querySelector("#saveProfile").addEventListener("click", () => {
    APP.profile = {
      name: view.querySelector("#p_name").value,
      age: view.querySelector("#p_age").value,
      grade: view.querySelector("#p_grade").value,
      height: view.querySelector("#p_height").value,
      weight: view.querySelector("#p_weight").value,
      position: view.querySelector("#p_position").value,
      goals: view.querySelector("#p_goals").value
    };
    saveState();
    alert("Profile saved ✅");
  });

  view.querySelector("#resetProfile").addEventListener("click", () => {
    if (!confirm("Reset profile info?")) return;
    APP.profile = {
      name: "Graham",
      age: "14",
      grade: "",
      height: "",
      weight: "",
      position: "",
      goals: "Strength + speed"
    };
    saveState();
    renderProfile();
  });
}

function renderDay(dayKey) {
  const day = PROGRAM[dayKey];

  view.innerHTML = `
    <div class="card">
      <h2>${day.title}</h2>
      <p class="small">
        <b>${escapeHtml(APP.profile.name || "Player")}</b>
        • ${escapeHtml(APP.profile.position || "Football")}
        • ${escapeHtml(APP.profile.goals || "Strength + speed")}
      </p>

      <div class="grid">
        <div>
          <label>Date</label>
          <input id="date" type="date" value="${APP.date}">
        </div>
        <div>
          <label>Rule</label>
          <input value="Add reps first → then +5 lb" disabled>
        </div>
        <div>
          <label>Intensity</label>
          <input value="No maxing (RPE 7–8)" disabled>
        </div>
      </div>

      <p class="small">${day.note}</p>

      <div class="actions">
        <button id="saveToHistory">Save Workout to History</button>
        <button class="secondary" id="clearDay">Clear Day Logs</button>
        <button class="secondary" id="resetAll">Reset All</button>
      </div>

      <p class="small">
        Tip: Save to History when you finish. (It won’t automatically create a history entry.)
      </p>
    </div>
  `;

  view.querySelector("#date").addEventListener("change", (e) => {
    APP.date = e.target.value || todayISO();
    saveState();
  });

  // Save to history button
  view.querySelector("#saveToHistory").addEventListener("click", () => {
    if (!hasAnyEntries(dayKey)) {
      alert("Nothing to save yet — log at least one set or a note.");
      return;
    }
    const entry = {
      id: uid(),
      savedAt: new Date().toISOString(),
      date: APP.date || todayISO(),
      dayKey,
      dayTitle: day.title,
      profileSnapshot: deepClone(APP.profile),
      logs: deepClone(APP.logs[dayKey] || {}),
      notes: String(APP.notes[dayKey] || "")
    };
    APP.history.unshift(entry);
    // keep last 200 entries so storage doesn't balloon
    APP.history = APP.history.slice(0, 200);
    saveState();
    alert("Saved to History ✅");
  });

  // Exercises
  day.exercises.forEach(ex => {
    ensureExerciseLog(dayKey, ex);
    const sets = APP.logs[dayKey][ex.name];

    const card = document.createElement("div");
    card.className = "card";

    const targetText = `${ex.sets}×${ex.targetReps} target`;

    card.innerHTML = `
      <div class="exerciseHeader">
        <div class="exerciseName">${ex.name}</div>
        <div class="targetBadge">${targetText}</div>
      </div>

      <div class="actions">
        <button onclick="window.open('${ex.link}','_blank')">YouTube</button>
        <button class="secondary" data-fill="${escapeAttr(ex.name)}">Auto-fill targets</button>
      </div>

      <hr />

      <div class="small">Log each set. Weight can be blank for jumps/carries; use reps/seconds.</div>

      ${sets.map((s, i) => `
        <div class="setRow">
          <div class="setLabel">Set ${i + 1}</div>

          <div>
            <label>Weight</label>
            <input inputmode="decimal"
              data-ex="${escapeAttr(ex.name)}" data-set="${i}" data-field="weight"
              placeholder="e.g., 95"
              value="${escapeAttr(s.weight)}">
          </div>

          <div>
            <label>Reps</label>
            <input inputmode="numeric"
              data-ex="${escapeAttr(ex.name)}" data-set="${i}" data-field="reps"
              placeholder="${ex.targetReps}"
              value="${escapeAttr(s.reps)}">
          </div>

          <div>
            <label>Target</label>
            <input value="${ex.targetReps}" disabled>
          </div>
        </div>
      `).join("")}
    `;

    view.appendChild(card);

    // Auto-fill targets
    card.querySelector(`[data-fill="${cssEscape(ex.name)}"]`)?.addEventListener("click", () => {
      APP.logs[dayKey][ex.name] = APP.logs[dayKey][ex.name].map(s => ({
        weight: s.weight,
        reps: s.reps || String(ex.targetReps)
      }));
      saveState();
      renderDay(dayKey);
    });
  });

  // Notes
  const notesCard = document.createElement("div");
  notesCard.className = "card";
  notesCard.innerHTML = `
    <h2>Notes</h2>
    <label>How did it feel? (sleep, soreness, speed, etc.)</label>
    <textarea id="notes" placeholder="Example: Squats felt fast today.">${escapeHtml(APP.notes[dayKey] || "")}</textarea>
  `;
  view.appendChild(notesCard);

  notesCard.querySelector("#notes").addEventListener("input", (e) => {
    APP.notes[dayKey] = e.target.value;
    saveState();
  });

  // Bind weight/rep inputs
  view.querySelectorAll("input[data-ex]").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const exNameEsc = e.target.dataset.ex;
      const setIdx = Number(e.target.dataset.set);
      const field = e.target.dataset.field;

      // Map escaped dataset value back to the real exercise name key
      const realName = Object.keys(APP.logs[dayKey]).find(k => escapeAttr(k) === exNameEsc) || exNameEsc;

      APP.logs[dayKey][realName][setIdx][field] = e.target.value;
      saveState();
    });
  });

  // Clear day logs
  view.querySelector("#clearDay").addEventListener("click", () => {
    if (!confirm("Clear logs for this day?")) return;
    APP.logs[dayKey] = {};
    APP.notes[dayKey] = "";
    saveState();
    renderDay(dayKey);
  });

  // Reset all
  view.querySelector("#resetAll").addEventListener("click", () => {
    if (!confirm("Reset ALL logs, notes, profile, and history?")) return;
    localStorage.removeItem(KEY);
    APP = loadState();
    tabs.forEach(t => t.classList.toggle("active", t.dataset.day === APP.activeTab));
    render();
  });
}

function renderHistory() {
  const items = APP.history || [];

  view.innerHTML = `
    <div class="card">
      <h2>History</h2>
      <p class="small">These are workouts you saved using “Save Workout to History.”</p>
      <div class="actions">
        <button class="secondary" id="clearHistory">Clear History</button>
      </div>
    </div>
  `;

  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gap = "12px";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `<p class="small">No history yet. Go to a Day tab, log your workout, then tap “Save Workout to History.”</p>`;
    container.appendChild(empty);
  } else {
    items.forEach(entry => {
      const card = document.createElement("div");
      card.className = "card";

      const when = new Date(entry.savedAt).toLocaleString();
      const name = entry.profileSnapshot?.name || "Player";

      card.innerHTML = `
        <div class="exerciseHeader">
          <div class="exerciseName">${escapeHtml(entry.dayTitle || entry.dayKey)} — ${escapeHtml(entry.date || "")}</div>
          <div class="targetBadge">${escapeHtml(name)}</div>
        </div>
        <p class="small">Saved: ${escapeHtml(when)}</p>

        <div class="actions">
          <button class="secondary" data-toggle="${escapeAttr(entry.id)}">Show / Hide Details</button>
          <button class="secondary" data-delete="${escapeAttr(entry.id)}">Delete</button>
        </div>

        <div id="details-${escapeAttr(entry.id)}" style="display:none; margin-top:10px;"></div>
      `;

      container.appendChild(card);

      // Toggle details
      card.querySelector(`[data-toggle="${cssEscape(entry.id)}"]`)?.addEventListener("click", () => {
        const details = card.querySelector(`#details-${cssEscape(entry.id)}`);
        const isOpen = details.style.display === "block";
        if (isOpen) {
          details.style.display = "none";
          details.innerHTML = "";
          return;
        }

        details.style.display = "block";
        details.innerHTML = buildHistoryDetailsHtml(entry);
      });

      // Delete entry
      card.querySelector(`[data-delete="${cssEscape(entry.id)}"]`)?.addEventListener("click", () => {
        if (!confirm("Delete this history entry?")) return;
        APP.history = (APP.history || []).filter(h => h.id !== entry.id);
        saveState();
        renderHistory();
      });
    });
  }

  view.appendChild(container);

  view.querySelector("#clearHistory").addEventListener("click", () => {
    if (!confirm("Clear ALL history?")) return;
    APP.history = [];
    saveState();
    renderHistory();
  });
}

function buildHistoryDetailsHtml(entry) {
  const logs = entry.logs || {};
  const notes = String(entry.notes || "").trim();

  const exBlocks = Object.keys(logs).map(exName => {
    const sets = logs[exName] || [];
    const rows = sets.map((s, i) => {
      const w = String(s.weight || "").trim();
      const r = String(s.reps || "").trim();
      const left = (w !== "") ? `${w}` : "—";
      const right = (r !== "") ? `${r}` : "—";
      return `<div class="small">Set ${i + 1}: Weight ${escapeHtml(left)} • Reps ${escapeHtml(right)}</div>`;
    }).join("");

    return `
      <div style="margin-top:10px;">
        <div style="font-weight:800; margin-bottom:6px;">${escapeHtml(exName)}</div>
        ${rows || `<div class="small">No sets logged.</div>`}
      </div>
    `;
  }).join("");

  const noteBlock = notes
    ? `<div style="margin-top:12px;"><div style="font-weight:800; margin-bottom:6px;">Notes</div><div class="small">${escapeHtml(notes)}</div></div>`
    : "";

  if (exBlocks === "" && !noteBlock) {
    return `<p class="small">No details logged.</p>`;
  }

  return `${exBlocks}${noteBlock}`;
}

// ---------- Escaping helpers ----------
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "");
}

function cssEscape(s) {
  return String(s).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

render();
