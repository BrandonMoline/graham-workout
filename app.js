// Graham’s Workout Plan — Logging + Profile (localStorage autosave)
// Stores workout logs + notes + profile on the iPhone (no account).

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
      { name: "Sled Push (or Heavy March)", sets: 4, targetReps: 20, link: "https://www.youtube.com/watch?v=U5zrloYWwxw" },
      { name: "Med Ball Slams", sets: 3, targetReps: 8, link: "https://www.youtube.com/watch?v=9RrR2nJ4zvM" },
      { name: "Farmer Carries (seconds)", sets: 3, targetReps: 40, link: "https://www.youtube.com/watch?v=lLAw6fUccKA" }
    ]
  }
};

// ---------- Storage ----------
const KEY = "grahams-workout-plan:v2";

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return {
      activeDay: "day1",
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
      logs: { day1: {}, day2: {}, day3: {} }
    };
  }
  return JSON.parse(raw);
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

// ---------- UI ----------
const view = document.getElementById("view");
const tabs = document.querySelectorAll(".tab");
let APP = loadState();

// Tabs
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    APP.activeDay = tab.dataset.day;
    saveState();
    render();
  });
});

// Make correct tab active after refresh
tabs.forEach(t => t.classList.toggle("active", t.dataset.day === APP.activeDay));

function render() {
  if (APP.activeDay === "profile") {
    renderProfile();
    return;
  }
  renderDay();
}

function renderProfile() {
  const p = APP.profile;

  view.innerHTML = `
    <div class="card">
      <h2>Profile</h2>
      <p class="small">Saved on this iPhone only. No account needed.</p>

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

function renderDay() {
  const dayKey = APP.activeDay;
  const day = PROGRAM[dayKey];

  view.innerHTML = `
    <div class="card">
      <h2>${day.title}</h2>
      <p class="small"><b>${escapeHtml(APP.profile.name || "Player")}</b> • ${escapeHtml(APP.profile.position || "Football")} • ${escapeHtml(APP.profile.goals || "Strength + speed")}</p>

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
        <button class="secondary" id="clearDay">Clear Day Logs</button>
        <button class="secondary" id="clearAll">Reset All</button>
      </div>
    </div>
  `;

  view.querySelector("#date").addEventListener("change", (e) => {
    APP.date = e.target.value || todayISO();
    saveState();
  });

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
      renderDay();
    });
  });

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
      const exName = e.target.dataset.ex;
      const setIdx = Number(e.target.dataset.set);
      const field = e.target.dataset.field;

      // exName stored escaped; map back by searching keys
      const realName = Object.keys(APP.logs[dayKey]).find(k => escapeAttr(k) === exName) || exName;

      APP.logs[dayKey][realName][setIdx][field] = e.target.value;
      saveState();
    });
  });

  // Clear buttons
  view.querySelector("#clearDay").addEventListener("click", () => {
    if (!confirm("Clear logs for this day?")) return;
    APP.logs[dayKey] = {};
    saveState();
    renderDay();
  });

  view.querySelector("#clearAll").addEventListener("click", () => {
    if (!confirm("Reset ALL logs, notes, and profile?")) return;
    localStorage.removeItem(KEY);
    APP = loadState();
    tabs.forEach(t => t.classList.toggle("active", t.dataset.day === APP.activeDay));
    render();
  });
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
  // safe for HTML attributes
  return escapeHtml(str).replaceAll("`", "");
}

function cssEscape(s) {
  return String(s).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

render();
