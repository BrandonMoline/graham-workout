const PROGRAM = {
  day1: {
    title: "Day 1 – Lower Body Power",
    exercises: [
      ["Back Squat", "https://www.youtube.com/watch?v=Dy28eq2PjcM"],
      ["Romanian Deadlift", "https://www.youtube.com/watch?v=0Y8sJzQGf0k"],
      ["Walking Lunges", "https://www.youtube.com/watch?v=ReNofXwy_js"],
      ["Box Jumps", "https://www.youtube.com/watch?v=52r_Ul5k03g"],
      ["Calf Raises", "https://www.youtube.com/watch?v=k8ipHzKeAkQ"]
    ]
  },

  day2: {
    title: "Day 2 – Upper Body Strength",
    exercises: [
      ["Bench Press", "https://www.youtube.com/watch?v=rT7DgCr-3pg"],
      ["Pull-Ups", "https://www.youtube.com/watch?v=eGo4IYlbE5g"],
      ["Dumbbell Shoulder Press", "https://www.youtube.com/watch?v=B-aVuyhvLHU"],
      ["Barbell Rows", "https://www.youtube.com/watch?v=RQU8wZPbioA"],
      ["Plank Hold", "https://www.youtube.com/watch?v=pSHjTRCQxIw"]
    ]
  },

  day3: {
    title: "Day 3 – Speed & Athleticism",
    exercises: [
      ["Trap Bar Deadlift", "https://www.youtube.com/watch?v=JWz6KcRz3AI"],
      ["Broad Jumps", "https://www.youtube.com/watch?v=5Vb5P3X5VOU"],
      ["Sled Push (or Heavy March)", "https://www.youtube.com/watch?v=U5zrloYWwxw"],
      ["Med Ball Slams", "https://www.youtube.com/watch?v=9RrR2nJ4zvM"],
      ["Farmer Carries", "https://www.youtube.com/watch?v=lLAw6fUccKA"]
    ]
  }
};

const view = document.getElementById("view");
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    render(tab.dataset.day);
  });
});

function render(day) {
  const d = PROGRAM[day];
  view.innerHTML = `<div class="card"><h2>${d.title}</h2></div>`;

  d.exercises.forEach(([name, link]) => {
    const row = document.createElement("div");
    row.className = "exercise";
    row.innerHTML = `
      <div>${name}</div>
      <button onclick="window.open('${link}','_blank')">YouTube</button>
    `;
    view.appendChild(row);
  });
}

render("day1");
