const TEACHER_NAME = "Elven Zeng";
const STORE_KEY = "numbersensePractice.v1";
const TOTAL_DAYS = 10;
const QUESTIONS_PER_MODULE = 6;

const modules = [
  {
    id: "place",
    name: "位值与大小比较",
    shortName: "位值大小",
    goal: "看清每一位数字的价值，快速判断数的大小。"
  },
  {
    id: "mental",
    name: "心算加减与补整",
    shortName: "心算加减",
    goal: "用凑整、拆分和逆向思考提升计算速度。"
  },
  {
    id: "multiply",
    name: "乘除、倍数与余数",
    shortName: "乘除倍数",
    goal: "建立乘除之间的联系，理解倍数、因数和余数。"
  },
  {
    id: "fraction",
    name: "分数、小数、百分数",
    shortName: "分小百",
    goal: "在三种表示之间转换，形成比例大小感。"
  },
  {
    id: "estimate",
    name: "估算与合理性检查",
    shortName: "估算检查",
    goal: "先判断答案大概在哪，再检查结果是否合理。"
  },
  {
    id: "numberline",
    name: "数轴、正负数与距离",
    shortName: "数轴正负",
    goal: "用位置、方向和距离理解正负数。"
  },
  {
    id: "ratio",
    name: "比例、单位与量感",
    shortName: "比例单位",
    goal: "把数量放进真实单位和比例关系里理解。"
  },
  {
    id: "pattern",
    name: "规律、平均数与数据感",
    shortName: "规律数据",
    goal: "观察变化规律，理解平均、范围和数据中心。"
  }
];

const app = document.querySelector("#app");
const roleButtons = Array.from(document.querySelectorAll("[data-role-button]"));

let state = loadState();

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeRole = button.dataset.roleButton;
    saveState();
    render();
  });
});

app.addEventListener("input", (event) => {
  const answerInput = event.target.closest("[data-answer-input]");
  if (answerInput) {
    updateStudentAnswer(answerInput.dataset.qid, answerInput.value);
    refreshLiveCounters();
    return;
  }

  const noteInput = event.target.closest("[data-note-input]");
  if (noteInput) {
    const record = getRecord(noteInput.dataset.qid);
    record.teacherNote = noteInput.value;
    record.noteUpdatedAt = new Date().toISOString();
    setRecord(noteInput.dataset.qid, record);
  }
});

app.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    state.activeDay = Number(dayButton.dataset.day);
    saveState();
    render();
    return;
  }

  const moduleButton = event.target.closest("[data-module]");
  if (moduleButton) {
    state.activeModule = Number(moduleButton.dataset.module);
    saveState();
    render();
    return;
  }

  const unsureButton = event.target.closest("[data-unsure]");
  if (unsureButton) {
    const qid = unsureButton.dataset.unsure;
    const record = getRecord(qid);
    record.unsure = !record.unsure;
    record.unsureUpdatedAt = new Date().toISOString();
    setRecord(qid, record);
    render();
    return;
  }

  const jumpButton = event.target.closest("[data-jump]");
  if (jumpButton) {
    state.activeDay = Number(jumpButton.dataset.dayTarget);
    state.activeModule = Number(jumpButton.dataset.moduleTarget);
    saveState();
    render();
    requestAnimationFrame(() => {
      const target = document.querySelector(`[data-question-card="${jumpButton.dataset.jump}"]`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }

  const loginButton = event.target.closest("[data-login]");
  if (loginButton) {
    const input = document.querySelector("[data-teacher-name]");
    if (input && input.value.trim() === TEACHER_NAME) {
      state.teacherLoggedIn = true;
      saveState();
      render();
    } else {
      renderTeacherLogin("用户名需要与 Elven Zeng 完全一致。");
    }
    return;
  }

  const logoutButton = event.target.closest("[data-logout]");
  if (logoutButton) {
    state.teacherLoggedIn = false;
    saveState();
    render();
    return;
  }

  const gradeButton = event.target.closest("[data-grade]");
  if (gradeButton) {
    gradeQuestion(gradeButton.dataset.qid, gradeButton.dataset.grade);
    render();
    return;
  }

  const clearGradeButton = event.target.closest("[data-clear-grade]");
  if (clearGradeButton) {
    clearGrade(clearGradeButton.dataset.clearGrade);
    render();
    return;
  }

  const exportButton = event.target.closest("[data-export]");
  if (exportButton) {
    exportData();
    return;
  }

  const importButton = event.target.closest("[data-import]");
  if (importButton) {
    const fileInput = document.querySelector("[data-import-file]");
    if (fileInput) fileInput.click();
  }
});

app.addEventListener("change", (event) => {
  const filterSelect = event.target.closest("[data-module-filter]");
  if (filterSelect) {
    state.teacherModuleFilter = filterSelect.value;
    saveState();
    render();
    return;
  }

  const importFile = event.target.closest("[data-import-file]");
  if (importFile && importFile.files && importFile.files[0]) {
    importData(importFile.files[0]);
  }
});

render();

function loadState() {
  const fallback = {
    version: 1,
    activeRole: "student",
    activeDay: 1,
    activeModule: 0,
    teacherModuleFilter: "all",
    teacherLoggedIn: false,
    createdAt: new Date().toISOString(),
    answers: {}
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    return {
      ...fallback,
      ...saved,
      answers: saved && saved.answers ? saved.answers : {}
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  updateRoleButtons();
}

function render() {
  updateRoleButtons();
  if (state.activeRole === "teacher") {
    if (state.teacherLoggedIn) {
      renderTeacherDashboard();
    } else {
      renderTeacherLogin();
    }
  } else {
    renderStudent();
  }
}

function updateRoleButtons() {
  roleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.roleButton === state.activeRole);
  });
}

function renderStudent() {
  const day = clampDay(state.activeDay);
  const moduleIndex = clampModule(state.activeModule);
  state.activeDay = day;
  state.activeModule = moduleIndex;

  const dayStats = getDayStats(day);
  const overallStats = getOverallStats();
  const moduleStats = getModuleStats(day, moduleIndex);
  const currentModule = modules[moduleIndex];
  const questions = getQuestions(day, moduleIndex);
  const reminders = getPreviousDayReminders(day);
  const achievements = getAchievements();

  app.innerHTML = `
    <section class="panel hero-panel">
      <div>
        <h2 class="hero-title">第 ${day} 天 · ${currentModule.name}</h2>
        <p class="hero-copy">${currentModule.goal}</p>
        <div class="summary-line">
          ${statusBadge(`今日已答 ${dayStats.answered}/${dayStats.total}`, "blue")}
          ${statusBadge(`老师已批 ${dayStats.graded}/${dayStats.total}`, "neutral")}
          ${statusBadge(`做对 ${dayStats.correct} 题`, "good")}
          ${dayStats.incorrect ? statusBadge(`待订正 ${dayStats.incorrect} 题`, "warn") : statusBadge("错题清爽", "good")}
        </div>
      </div>
      <div class="stat-grid">
        ${statCard("总进度", `${overallStats.answered}/${overallStats.total}`, `${overallStats.percent}% 已完成`)}
        ${statCard("成就点", achievements.points, achievements.levelName)}
      </div>
    </section>

    ${reminders.length ? renderReminderPanel(reminders) : ""}

    <section class="panel">
      <h2>训练日</h2>
      <div class="day-tabs">
        ${Array.from({ length: TOTAL_DAYS }, (_, index) => renderDayButton(index + 1)).join("")}
      </div>
    </section>

    <div class="layout-grid">
      <section class="panel">
        <h2>八个模块</h2>
        <div class="module-tabs">
          ${modules.map((module, index) => renderModuleButton(day, module, index)).join("")}
        </div>

        <div class="module-summary">
          <div class="progress-row-top">
            <span>${currentModule.name}</span>
            <span>${moduleStats.answered}/${moduleStats.total}</span>
          </div>
          ${progressBar(moduleStats.percent)}
        </div>

        <div class="question-list">
          ${questions.map((question, index) => renderStudentQuestion(question, index)).join("")}
        </div>
      </section>

      <aside class="side-stack">
        <section class="panel" data-live-stats>
          ${renderLiveStats(day)}
        </section>
        <section class="panel">
          <h2>成就</h2>
          <div class="achievement-grid">
            ${achievements.items.map(renderAchievement).join("")}
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderTeacherLogin(error = "") {
  app.innerHTML = `
    <section class="login-box">
      <h2>教师批改</h2>
      <p class="hero-copy">教师用户名：<strong>${TEACHER_NAME}</strong></p>
      <div class="answer-line">
        <input class="login-input" data-teacher-name value="${escapeHtml(TEACHER_NAME)}" aria-label="教师用户名">
        <button class="primary-button" type="button" data-login>进入批改</button>
      </div>
      ${error ? `<p class="badge bad" role="alert">${escapeHtml(error)}</p>` : ""}
    </section>
  `;
}

function renderTeacherDashboard() {
  const day = clampDay(state.activeDay);
  const filter = state.teacherModuleFilter || "all";
  const dayStats = getDayStats(day);
  const overallStats = getOverallStats();
  const filteredQuestions = getTeacherQuestions(day, filter);

  app.innerHTML = `
    <section class="panel hero-panel">
      <div>
        <h2 class="hero-title">教师账号 · ${TEACHER_NAME}</h2>
        <p class="hero-copy">第 ${day} 天总结：学生已完成 ${dayStats.answered}/${dayStats.total} 题，已批改 ${dayStats.graded} 题，做对 ${dayStats.correct} 题，做错 ${dayStats.incorrect} 题。</p>
        <div class="summary-line">
          ${statusBadge(`总进度 ${overallStats.percent}%`, "blue")}
          ${statusBadge(`总作答 ${overallStats.answered}/${overallStats.total}`, "neutral")}
          ${statusBadge(`累计正确 ${overallStats.correct}`, "good")}
          ${statusBadge(`累计错题 ${overallStats.incorrect}`, overallStats.incorrect ? "warn" : "good")}
        </div>
      </div>
      <div class="teacher-tools">
        <button class="small-button" type="button" data-export>导出记录</button>
        <button class="small-button" type="button" data-import>导入记录</button>
        <button class="small-button" type="button" data-logout>退出教师</button>
        <input class="hidden-file" type="file" accept="application/json" data-import-file>
      </div>
    </section>

    <section class="panel">
      <h2>训练日</h2>
      <div class="day-tabs">
        ${Array.from({ length: TOTAL_DAYS }, (_, index) => renderDayButton(index + 1)).join("")}
      </div>
    </section>

    <div class="teacher-grid">
      <section class="panel">
        <div class="toolbar">
          <h2>批改列表</h2>
          <select class="filter-select" data-module-filter aria-label="模块筛选">
            <option value="all"${filter === "all" ? " selected" : ""}>全部模块</option>
            ${modules.map((module, index) => `<option value="${index}"${String(index) === String(filter) ? " selected" : ""}>${module.name}</option>`).join("")}
          </select>
        </div>
        <div class="teacher-list">
          ${filteredQuestions.length ? filteredQuestions.map(renderTeacherQuestion).join("") : `<div class="empty-state">没有题目。</div>`}
        </div>
      </section>

      <aside class="side-stack">
        <section class="panel">
          <h2>第 ${day} 天统计</h2>
          <div class="stat-grid">
            ${statCard("已作答", `${dayStats.answered}/${dayStats.total}`, `${dayStats.percent}%`)}
            ${statCard("已批改", `${dayStats.graded}/${dayStats.total}`, `${dayStats.gradePercent}%`)}
            ${statCard("正确", dayStats.correct, "老师标为正确")}
            ${statCard("不会", dayStats.unsure, "学生主动标注")}
          </div>
        </section>
        <section class="panel">
          <h2>十天进度</h2>
          <div class="progress-list">
            ${Array.from({ length: TOTAL_DAYS }, (_, index) => renderProgressRow(index + 1)).join("")}
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderDayButton(day) {
  const stats = getDayStats(day);
  return `
    <button class="day-button${state.activeDay === day ? " active" : ""}" type="button" data-day="${day}">
      第 ${day} 天
      <span>${stats.percent}%</span>
      <span class="mini-bar"><span class="mini-fill" style="width:${stats.percent}%"></span></span>
    </button>
  `;
}

function renderModuleButton(day, module, index) {
  const stats = getModuleStats(day, index);
  return `
    <button class="module-button${state.activeModule === index ? " active" : ""}" type="button" data-module="${index}">
      ${module.shortName}
      <span class="module-count">${stats.answered}/${stats.total}</span>
    </button>
  `;
}

function renderStudentQuestion(question, index) {
  const record = getRecord(question.id);
  const status = getQuestionStatus(record);
  const classes = ["question-card"];
  if (record.grade === "correct") classes.push("correct");
  if (record.grade === "incorrect") classes.push(isRevised(record) ? "revised" : "incorrect");

  return `
    <article class="${classes.join(" ")}" data-question-card="${question.id}">
      <div class="question-top">
        <div>
          <div class="question-index">第 ${index + 1} 题 · ${modules[question.moduleIndex].shortName}</div>
          <p class="question-text">${escapeHtml(question.prompt)}</p>
        </div>
        ${statusBadge(status.label, status.kind)}
      </div>
      <div class="answer-line">
        <input class="answer-input" data-answer-input data-qid="${question.id}" value="${escapeHtml(record.answer || "")}" placeholder="填写答案" aria-label="第 ${index + 1} 题答案">
        <button class="small-button${record.unsure ? " active" : ""}" type="button" data-unsure="${question.id}">
          ${record.unsure ? "已标不会" : "标不会"}
        </button>
      </div>
      <div class="status-row">
        ${record.unsure ? statusBadge("已记录为不会", "warn") : ""}
        ${record.grade === "incorrect" && isRevised(record) ? statusBadge("已订正，待复批", "warn") : ""}
        ${record.teacherNote ? statusBadge(`老师批注：${record.teacherNote}`, "blue") : ""}
      </div>
    </article>
  `;
}

function renderTeacherQuestion(question) {
  const record = getRecord(question.id);
  const status = getQuestionStatus(record);
  const studentAnswer = record.answer ? escapeHtml(record.answer) : "<span class=\"muted\">未作答</span>";

  return `
    <article class="teacher-row">
      <div class="teacher-row-header">
        <div>
          <div class="teacher-meta">
            ${statusBadge(`第 ${question.day} 天`, "neutral")}
            ${statusBadge(modules[question.moduleIndex].shortName, "blue")}
            ${statusBadge(status.label, status.kind)}
            ${record.unsure ? statusBadge("学生标不会", "warn") : ""}
            ${record.grade === "incorrect" && isRevised(record) ? statusBadge("已订正待复批", "warn") : ""}
          </div>
          <p class="question-text">${escapeHtml(question.prompt)}</p>
        </div>
        <div>
          <div class="stat-label">参考答案</div>
          <div class="answer-preview answer-key">${escapeHtml(question.answer)}</div>
        </div>
      </div>
      <div>
        <div class="stat-label">学生答案</div>
        <div class="answer-preview">${studentAnswer}</div>
      </div>
      <div class="grade-actions">
        <button class="grade-button correct${record.grade === "correct" ? " active" : ""}" type="button" data-grade="correct" data-qid="${question.id}">对</button>
        <button class="grade-button incorrect${record.grade === "incorrect" ? " active" : ""}" type="button" data-grade="incorrect" data-qid="${question.id}">错</button>
        <button class="small-button" type="button" data-clear-grade="${question.id}">清除批改</button>
      </div>
      <textarea class="note-input" data-note-input data-qid="${question.id}" placeholder="教师批注">${escapeHtml(record.teacherNote || "")}</textarea>
    </article>
  `;
}

function renderLiveStats(day) {
  const stats = getDayStats(day);
  return `
    <h2>今日总结</h2>
    <div class="progress-row-top">
      <span>完成度</span>
      <span>${stats.percent}%</span>
    </div>
    ${progressBar(stats.percent)}
    <div class="stat-grid" style="margin-top: 12px;">
      ${statCard("已答", `${stats.answered}/${stats.total}`, "每题都算进度")}
      ${statCard("正确", stats.correct, "老师批改后显示")}
      ${statCard("待批", stats.pending, "已答未批")}
      ${statCard("不会", stats.unsure, "主动标注")}
    </div>
  `;
}

function refreshLiveCounters() {
  const liveStats = document.querySelector("[data-live-stats]");
  if (liveStats && state.activeRole === "student") {
    liveStats.innerHTML = renderLiveStats(state.activeDay);
  }
}

function renderReminderPanel(reminders) {
  return `
    <section class="notice">
      <h2>昨日错题订正</h2>
      <p class="hero-copy">这些题老师已经标错，今天先把它们改掉，会额外计入订正成就。</p>
      <div class="reminder-list">
        ${reminders.map((item) => `
          <div class="reminder-item">
            <div>
              <strong>第 ${item.question.day} 天 · ${modules[item.question.moduleIndex].shortName} · 第 ${item.question.qNumber} 题</strong>
              <p class="stat-note">${escapeHtml(item.question.prompt)}</p>
            </div>
            <button class="small-button" type="button" data-jump="${item.question.id}" data-day-target="${item.question.day}" data-module-target="${item.question.moduleIndex}">去订正</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderProgressRow(day) {
  const stats = getDayStats(day);
  return `
    <div class="progress-row">
      <div class="progress-row-top">
        <span>第 ${day} 天</span>
        <span>${stats.answered}/${stats.total}</span>
      </div>
      ${progressBar(stats.percent)}
      <p class="stat-note">正确 ${stats.correct} · 错题 ${stats.incorrect} · 待批 ${stats.pending}</p>
    </div>
  `;
}

function renderAchievement(item) {
  return `
    <div class="achievement-card${item.unlocked ? " unlocked" : ""}">
      <div class="achievement-name">${item.unlocked ? "已获得" : "待解锁"} · ${item.name}</div>
      <p class="achievement-desc">${item.desc}</p>
    </div>
  `;
}

function statCard(label, value, note) {
  return `
    <div class="stat-card">
      <div class="stat-label">${escapeHtml(String(label))}</div>
      <div class="stat-value">${escapeHtml(String(value))}</div>
      <p class="stat-note">${escapeHtml(String(note))}</p>
    </div>
  `;
}

function statusBadge(text, kind = "neutral") {
  return `<span class="badge ${kind}">${escapeHtml(String(text))}</span>`;
}

function progressBar(percent) {
  return `<div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width:${clampPercent(percent)}%"></div></div>`;
}

function getQuestions(day, moduleIndex) {
  return Array.from({ length: QUESTIONS_PER_MODULE }, (_, index) => buildQuestion(day, moduleIndex, index + 1));
}

function getAllQuestionsForDay(day) {
  return modules.flatMap((_, moduleIndex) => getQuestions(day, moduleIndex));
}

function getAllQuestions() {
  return Array.from({ length: TOTAL_DAYS }, (_, index) => getAllQuestionsForDay(index + 1)).flat();
}

function getTeacherQuestions(day, filter) {
  if (filter === "all") return getAllQuestionsForDay(day);
  return getQuestions(day, Number(filter));
}

function buildQuestion(day, moduleIndex, qNumber) {
  const id = `d${day}-m${moduleIndex + 1}-q${qNumber}`;
  const base = day * 10 + qNumber;
  let prompt = "";
  let answer = "";

  if (moduleIndex === 0) {
    const n = 200 + day * 37 + qNumber * 14;
    const a = 120 + day * 19 + qNumber * 11;
    const b = 140 + day * 17 + qNumber * 9;
    if (qNumber === 1) {
      const tens = Math.floor((n % 100) / 10);
      prompt = `${n} 中十位上的数字表示多少？`;
      answer = String(tens * 10);
    } else if (qNumber === 2) {
      prompt = `${a} 和 ${b} 比较，填 >、< 或 =。`;
      answer = a > b ? ">" : a < b ? "<" : "=";
    } else if (qNumber === 3) {
      const value = 130 + day * 24 + qNumber * 7;
      prompt = `把 ${value} 四舍五入到最接近的十位。`;
      answer = String(Math.round(value / 10) * 10);
    } else if (qNumber === 4) {
      const left = 30 + day * 8 + qNumber;
      const right = left + 2 * ((day % 4) + 2);
      prompt = `${left} 和 ${right} 正中间的数是几？`;
      answer = String((left + right) / 2);
    } else if (qNumber === 5) {
      const nums = [98 + base * 2, 104 + day * 13 + qNumber, 87 + day * 16 + qNumber * 3];
      prompt = `把 ${nums.join("、")} 从小到大排列。`;
      answer = nums.slice().sort((x, y) => x - y).join("、");
    } else {
      const value = 300 + day * 41 + qNumber * 18;
      const h = Math.floor(value / 100) * 100;
      const t = Math.floor((value % 100) / 10) * 10;
      const o = value % 10;
      prompt = `${value} 可以拆成多少 + 多少 + 多少？`;
      answer = `${h} + ${t} + ${o}`;
    }
  }

  if (moduleIndex === 1) {
    if (qNumber === 1) {
      const a = 38 + day * 4;
      const b = 27 + day * 3;
      prompt = `${a} + ${b} =`;
      answer = String(a + b);
    } else if (qNumber === 2) {
      const a = 120 + day * 9 + qNumber * 5;
      const b = 46 + day * 3;
      prompt = `${a} - ${b} =`;
      answer = String(a - b);
    } else if (qNumber === 3) {
      const value = 57 + day * 6;
      const nextHundred = Math.ceil(value / 100) * 100;
      prompt = `${value} 还差多少到 ${nextHundred}？`;
      answer = String(nextHundred - value);
    } else if (qNumber === 4) {
      const result = 45 + day * 5;
      const missing = 18 + day;
      prompt = `□ - ${missing} = ${result}，□ =`;
      answer = String(result + missing);
    } else if (qNumber === 5) {
      const a = round1(2.4 + day * 0.3);
      const b = round1(1.7 + qNumber * 0.2);
      prompt = `${a} + ${b} =`;
      answer = String(round1(a + b));
    } else {
      const a = 75 + day * 7;
      const b = 28 + qNumber * 3;
      const c = 12 + day;
      prompt = `${a} + ${b} - ${c} =`;
      answer = String(a + b - c);
    }
  }

  if (moduleIndex === 2) {
    if (qNumber === 1) {
      const a = 4 + (day % 6);
      const b = 6 + qNumber + (day % 3);
      prompt = `${a} × ${b} =`;
      answer = String(a * b);
    } else if (qNumber === 2) {
      const divisor = 3 + (day % 5);
      const quotient = 7 + qNumber + day;
      prompt = `${divisor * quotient} ÷ ${divisor} =`;
      answer = String(quotient);
    } else if (qNumber === 3) {
      const factor = 4 + (day % 4);
      const missing = 5 + qNumber + (day % 5);
      prompt = `${factor} × □ = ${factor * missing}，□ =`;
      answer = String(missing);
    } else if (qNumber === 4) {
      const n = 4 + day;
      prompt = `${n} 的下一个倍数是多少？`;
      answer = String(n * 2);
    } else if (qNumber === 5) {
      const divisor = 5 + (day % 4);
      const quotient = 6 + day;
      const remainder = (day + qNumber) % divisor;
      prompt = `${divisor * quotient + remainder} ÷ ${divisor} 的余数是几？`;
      answer = String(remainder);
    } else {
      const n = 18 + day * 2;
      const candidate = n + (day % 3 === 0 ? 0 : 1);
      prompt = `${candidate} 是 ${n} 的因数吗？填 是 或 否。`;
      answer = n % candidate === 0 ? "是" : "否";
    }
  }

  if (moduleIndex === 3) {
    if (qNumber === 1) {
      const n = 30 + day * 4;
      prompt = `${n} 的 1/2 是多少？`;
      answer = String(n / 2);
    } else if (qNumber === 2) {
      const n = 40 + day * 4;
      prompt = `${n} 的 1/4 是多少？`;
      answer = String(n / 4);
    } else if (qNumber === 3) {
      const numerator = (day % 4) + 1;
      prompt = `${numerator}/10 写成小数是几？`;
      answer = String(round1(numerator / 10));
    } else if (qNumber === 4) {
      const numerator = (day % 5) + 1;
      prompt = `${numerator}/20 写成百分数是多少？`;
      answer = `${numerator * 5}%`;
    } else if (qNumber === 5) {
      const numerator = 2 + (day % 4);
      const denominator = numerator * 3;
      prompt = `把 ${numerator}/${denominator} 约分。`;
      answer = reduceFraction(numerator, denominator);
    } else {
      const decimal = round1(0.2 + (day % 6) * 0.1);
      prompt = `${decimal} 写成百分数是多少？`;
      answer = `${Math.round(decimal * 100)}%`;
    }
  }

  if (moduleIndex === 4) {
    if (qNumber === 1) {
      const a = 41 + day * 7;
      const b = 26 + day * 6;
      prompt = `估算 ${a} + ${b}，把两个数都看成最接近的十位，结果约是几？`;
      answer = String(Math.round(a / 10) * 10 + Math.round(b / 10) * 10);
    } else if (qNumber === 2) {
      const a = 18 + day;
      const b = 29 + qNumber * 2;
      prompt = `估算 ${a} × ${b}，把两个数都看成最接近的十位，结果约是几？`;
      answer = String(Math.round(a / 10) * 10 * Math.round(b / 10) * 10);
    } else if (qNumber === 3) {
      const a = 98 + day * 5;
      const b = 51 + day * 3;
      prompt = `${a} - ${b} 的结果更接近 40 还是 60？`;
      answer = Math.abs(a - b - 40) <= Math.abs(a - b - 60) ? "40" : "60";
    } else if (qNumber === 4) {
      const exact = 24 + day * 3;
      const estimate = Math.round(exact / 10) * 10;
      prompt = `${exact} 四舍五入到十位后是 ${estimate}，估算值比原数大还是小？`;
      answer = estimate > exact ? "大" : estimate < exact ? "小" : "一样";
    } else if (qNumber === 5) {
      const a = 58 + day * 4;
      const b = 7 + (day % 4);
      prompt = `${a} × ${b} 大约是几百？`;
      answer = String(Math.round((a * b) / 100) * 100);
    } else {
      const total = 240 + day * 30;
      const people = 6 + (day % 4);
      prompt = `${people} 人平均分 ${total} 个物品，每人大约分到几十个？`;
      answer = `${Math.round((total / people) / 10) * 10}`;
    }
  }

  if (moduleIndex === 5) {
    if (qNumber === 1) {
      const start = -8 + day;
      const change = 5 + (day % 4);
      prompt = `气温从 ${start}℃ 上升 ${change}℃，现在是几℃？`;
      answer = `${start + change}`;
    } else if (qNumber === 2) {
      const a = -12 + day;
      const b = 4 + qNumber;
      prompt = `数轴上 ${a} 到 ${b} 的距离是多少？`;
      answer = String(Math.abs(b - a));
    } else if (qNumber === 3) {
      const left = -10 + day;
      const right = left + 2 * (4 + (day % 3));
      prompt = `${left} 和 ${right} 的中点是多少？`;
      answer = String((left + right) / 2);
    } else if (qNumber === 4) {
      const a = -(3 + day);
      const b = -(6 + qNumber);
      prompt = `${a} 和 ${b} 哪个更大？`;
      answer = String(Math.max(a, b));
    } else if (qNumber === 5) {
      const balance = -20 - day * 3;
      const deposit = 35 + qNumber * 2;
      prompt = `账户余额 ${balance} 元，存入 ${deposit} 元后余额是多少？`;
      answer = String(balance + deposit);
    } else {
      const value = -5 - day;
      prompt = `${value} 的相反数是多少？`;
      answer = String(-value);
    }
  }

  if (moduleIndex === 6) {
    if (qNumber === 1) {
      const cm = 120 + day * 10;
      prompt = `${cm} 厘米 = 多少米？`;
      answer = String(round2(cm / 100));
    } else if (qNumber === 2) {
      const kg = round1(1.2 + day * 0.2);
      prompt = `${kg} 千克 = 多少克？`;
      answer = String(Math.round(kg * 1000));
    } else if (qNumber === 3) {
      const price = 3 + (day % 5);
      const count = 4 + qNumber;
      prompt = `每个 ${price} 元，买 ${count} 个一共多少元？`;
      answer = String(price * count);
    } else if (qNumber === 4) {
      const one = 2 + (day % 4);
      const many = 5 + qNumber;
      prompt = `${one} 本练习册需要 ${one * 3} 分钟，照这样 ${many} 本需要多少分钟？`;
      answer = String(many * 3);
    } else if (qNumber === 5) {
      const total = 7 * (5 + day);
      prompt = `红球和蓝球的数量比是 3:4，一共有 ${total} 个，其中红球有多少个？`;
      answer = String((total / 7) * 3);
    } else {
      const speed = 4 + (day % 4);
      const time = 3 + qNumber;
      prompt = `每小时走 ${speed} 千米，${time} 小时走多少千米？`;
      answer = String(speed * time);
    }
  }

  if (moduleIndex === 7) {
    if (qNumber === 1) {
      const start = 3 + day;
      const step = 2 + (day % 4);
      prompt = `${start}、${start + step}、${start + step * 2}、${start + step * 3}，下一个数是几？`;
      answer = String(start + step * 4);
    } else if (qNumber === 2) {
      const start = 2 + (day % 3);
      prompt = `${start}、${start * 2}、${start * 4}、${start * 8}，下一个数是几？`;
      answer = String(start * 16);
    } else if (qNumber === 3) {
      const a = 60 + day * 2;
      const b = 70 + day;
      const c = 80 + day * 3;
      prompt = `${a}、${b}、${c} 的平均数是多少？`;
      answer = String((a + b + c) / 3);
    } else if (qNumber === 4) {
      const target = 75 + day;
      const a = target - 5;
      const b = target + 3;
      prompt = `${a}、${b}、□ 的平均数是 ${target}，□ =`;
      answer = String(target * 3 - a - b);
    } else if (qNumber === 5) {
      const nums = [12 + day, 8 + qNumber, 17 + day, 10 + day * 2, 14 + qNumber];
      prompt = `${nums.join("、")} 的中位数是多少？`;
      answer = String(nums.slice().sort((x, y) => x - y)[2]);
    } else {
      const nums = [22 + day, 35 + qNumber, 28 + day * 2, 19 + qNumber];
      prompt = `${nums.join("、")} 的极差是多少？`;
      answer = String(Math.max(...nums) - Math.min(...nums));
    }
  }

  return {
    id,
    day,
    moduleIndex,
    qNumber,
    prompt,
    answer
  };
}

function getRecord(qid) {
  return { ...(state.answers[qid] || {}) };
}

function setRecord(qid, record) {
  state.answers[qid] = record;
  saveState();
}

function updateStudentAnswer(qid, value) {
  const record = getRecord(qid);
  const previous = record.answer || "";
  if (previous === value) return;

  record.answer = value;
  record.updatedAt = new Date().toISOString();
  if (value.trim() && !record.answeredAt) {
    record.answeredAt = record.updatedAt;
  }
  if (record.grade === "incorrect" && record.gradedAnswer && value.trim() !== record.gradedAnswer.trim()) {
    record.revisedAt = record.updatedAt;
  }
  setRecord(qid, record);
}

function gradeQuestion(qid, grade) {
  const record = getRecord(qid);
  record.grade = grade;
  record.gradedAt = new Date().toISOString();
  record.gradedBy = TEACHER_NAME;
  record.gradedAnswer = record.answer || "";
  if (grade === "incorrect") {
    record.everIncorrect = true;
  }
  if (grade === "correct" && record.everIncorrect) {
    record.correctedAt = record.gradedAt;
  }
  setRecord(qid, record);
}

function clearGrade(qid) {
  const record = getRecord(qid);
  delete record.grade;
  delete record.gradedAt;
  delete record.gradedBy;
  delete record.gradedAnswer;
  delete record.revisedAt;
  setRecord(qid, record);
}

function getQuestionStatus(record) {
  if (record.grade === "correct") return { label: "已批：对", kind: "good" };
  if (record.grade === "incorrect" && isRevised(record)) return { label: "已订正待复批", kind: "warn" };
  if (record.grade === "incorrect") return { label: "已批：错", kind: "bad" };
  if (record.answer && record.answer.trim()) return { label: "待批改", kind: "blue" };
  return { label: "未作答", kind: "neutral" };
}

function isAnswered(record) {
  return Boolean(record.answer && record.answer.trim());
}

function isRevised(record) {
  return Boolean(
    record.grade === "incorrect" &&
    record.gradedAnswer !== undefined &&
    (record.answer || "").trim() !== (record.gradedAnswer || "").trim()
  );
}

function getDayStats(day) {
  return getStats(getAllQuestionsForDay(day));
}

function getModuleStats(day, moduleIndex) {
  return getStats(getQuestions(day, moduleIndex));
}

function getOverallStats() {
  return getStats(getAllQuestions());
}

function getStats(questions) {
  const total = questions.length;
  let answered = 0;
  let graded = 0;
  let correct = 0;
  let incorrect = 0;
  let unsure = 0;
  let revised = 0;
  let corrected = 0;

  questions.forEach((question) => {
    const record = getRecord(question.id);
    if (isAnswered(record)) answered += 1;
    if (record.grade) graded += 1;
    if (record.grade === "correct") correct += 1;
    if (record.grade === "incorrect") incorrect += 1;
    if (record.unsure) unsure += 1;
    if (isRevised(record)) revised += 1;
    if (record.correctedAt) corrected += 1;
  });

  return {
    total,
    answered,
    graded,
    correct,
    incorrect,
    unsure,
    revised,
    corrected,
    pending: Math.max(answered - graded, 0),
    percent: total ? Math.round((answered / total) * 100) : 0,
    gradePercent: total ? Math.round((graded / total) * 100) : 0
  };
}

function getPreviousDayReminders(day) {
  if (day <= 1) return [];
  return getAllQuestionsForDay(day - 1)
    .map((question) => ({ question, record: getRecord(question.id) }))
    .filter((item) => item.record.grade === "incorrect" && !isRevised(item.record));
}

function getAchievements() {
  const overall = getOverallStats();
  const dayStats = Array.from({ length: TOTAL_DAYS }, (_, index) => getDayStats(index + 1));
  const fullDays = dayStats.filter((stats) => stats.answered === stats.total).length;
  const highDays = dayStats.filter((stats) => stats.graded >= 24 && stats.correct >= 20).length;
  const completedModules = countCompletedModules();
  const points =
    overall.answered +
    overall.correct * 2 +
    overall.corrected * 4 +
    fullDays * 10 +
    completedModules * 3;

  const level = Math.floor(points / 80) + 1;
  const levelName = `数感等级 ${level}`;

  const items = [
    {
      name: "开局星",
      desc: "完成第一道题。",
      unlocked: overall.answered >= 1
    },
    {
      name: "模块完成者",
      desc: "任意一天完成一个完整模块。",
      unlocked: completedModules >= 1
    },
    {
      name: "一日通关",
      desc: "完成任意一天 48 道题。",
      unlocked: fullDays >= 1
    },
    {
      name: "敢问敢标",
      desc: "主动标出 5 道不会的题。",
      unlocked: overall.unsure >= 5
    },
    {
      name: "订正高手",
      desc: "把 3 道错题订正后批为正确。",
      unlocked: overall.corrected >= 3
    },
    {
      name: "稳定发挥",
      desc: "至少 3 天获得 20 道以上正确批改。",
      unlocked: highDays >= 3
    }
  ];

  return {
    points,
    levelName,
    items
  };
}

function countCompletedModules() {
  let count = 0;
  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex += 1) {
      const stats = getModuleStats(day, moduleIndex);
      if (stats.answered === stats.total) count += 1;
    }
  }
  return count;
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "numbersense_practice",
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `numbersense-record-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedState = parsed.state || parsed;
      if (!importedState.answers || typeof importedState.answers !== "object") {
        throw new Error("invalid data");
      }
      state = {
        ...state,
        ...importedState,
        activeRole: "teacher",
        teacherLoggedIn: true,
        answers: importedState.answers
      };
      saveState();
      render();
    } catch {
      alert("导入失败：文件格式不正确。");
    }
  };
  reader.readAsText(file);
}

function clampDay(day) {
  return Math.min(Math.max(Number(day) || 1, 1), TOTAL_DAYS);
}

function clampModule(moduleIndex) {
  return Math.min(Math.max(Number(moduleIndex) || 0, 0), modules.length - 1);
}

function clampPercent(percent) {
  return Math.min(Math.max(Number(percent) || 0, 0), 100);
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function reduceFraction(numerator, denominator) {
  const factor = gcd(numerator, denominator);
  return `${numerator / factor}/${denominator / factor}`;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
