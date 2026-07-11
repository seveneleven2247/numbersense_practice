const TEACHER_NAME = "Elven Zeng";
const STORE_KEY = "numbersensePractice.caGrade10.v1";
const TOTAL_DAYS = 10;
const QUESTIONS_PER_MODULE = 8;

const modules = [
  {
    id: "linear",
    name: "线性关系、斜率与变化率",
    shortName: "线性斜率",
    goal: "用斜率、截距、差分和实际费率理解线性变化。"
  },
  {
    id: "equations",
    name: "一元方程、方程组与建模",
    shortName: "方程建模",
    goal: "把文字关系转成方程，快速判断未知量的合理范围。"
  },
  {
    id: "polynomials",
    name: "多项式运算与因式分解",
    shortName: "多项式",
    goal: "在展开、合并、提公因式和分解中建立代数结构感。"
  },
  {
    id: "exponents",
    name: "指数、根式与科学记数法",
    shortName: "指数根式",
    goal: "熟练处理指数律、平方根估计和数量级。"
  },
  {
    id: "quadratics",
    name: "二次关系、抛物线与差分",
    shortName: "二次关系",
    goal: "从顶点、零点、对称轴和二阶差分理解二次函数。"
  },
  {
    id: "trig",
    name: "直角三角、勾股与三角比",
    shortName: "三角测量",
    goal: "用长度比、坡度和实际测量理解 sin、cos、tan。"
  },
  {
    id: "financial",
    name: "金融、比例、单位与估算",
    shortName: "金融比例",
    goal: "在 CAD、税、折扣、利息和单位率中训练现实数量感。"
  },
  {
    id: "data",
    name: "数据、概率与误差判断",
    shortName: "数据概率",
    goal: "用平均、离散程度、概率和误差判断数据是否合理。"
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
  let prompt = "";
  let answer = "";

  switch (moduleIndex) {
    case 0: {
      const slopes = [-3, -2, -1, 2, 3, 4];
      const m = slopes[(day + qNumber) % slopes.length];
      const b = day - qNumber;

      if (qNumber === 1) {
        const x1 = day - 4;
        const x2 = x1 + 2;
        const y1 = m * x1 + b;
        const y2 = m * x2 + b;
        prompt = `直线经过 (${x1}, ${y1}) 和 (${x2}, ${y2})，斜率是多少？`;
        answer = String(m);
      } else if (qNumber === 2) {
        const x = day + 3;
        prompt = `若 y = ${formatLinear(m, b)}，当 x = ${x} 时，y =`;
        answer = String(m * x + b);
      } else if (qNumber === 3) {
        const start = 18 + day;
        const step = slopes[(day + 2) % slopes.length];
        prompt = `表格的 y 值是 ${start}、${start + step}、${start + step * 2}、${start + step * 3}，每增加 1 个 x，y 的变化率是`;
        answer = String(step);
      } else if (qNumber === 4) {
        prompt = `线性关系 y = ${formatLinear(m, b)} 的 y-intercept 是多少？`;
        answer = String(b);
      } else if (qNumber === 5) {
        const x = qNumber + day;
        const target = m * x + b;
        prompt = `在 y = ${formatLinear(m, b)} 中，如果 y = ${target}，x =`;
        answer = String(x);
      } else if (qNumber === 6) {
        const first = 7 + day;
        const diff = 3 + (day % 5);
        prompt = `等差数列第 1 项是 ${first}，公差是 ${diff}，第 10 项是`;
        answer = String(first + 9 * diff);
      } else if (qNumber === 7) {
        const rate = 14 + day;
        const baseFee = 20 + qNumber;
        const cost2 = baseFee + rate * 2;
        const cost5 = baseFee + rate * 5;
        prompt = `补习收费是线性关系：2 小时 ${formatMoney(cost2)}，5 小时 ${formatMoney(cost5)}。每小时收费是多少？`;
        answer = formatMoney(rate);
      } else {
        const deltaX = 5 + day;
        prompt = `在线性关系 y = ${formatLinear(m, b)} 中，x 增加 ${deltaX}，y 会变化多少？`;
        answer = String(m * deltaX);
      }
      break;
    }

    case 1: {
      if (qNumber === 1) {
        const a = 2 + (day % 5);
        const x = 4 + day;
        const b = qNumber - day;
        prompt = `解方程：${formatLinear(a, b)} = ${a * x + b}，x =`;
        answer = String(x);
      } else if (qNumber === 2) {
        const a = 2 + (day % 4);
        const shift = (day % 5) - 2;
        const x = 6 + qNumber;
        prompt = `解方程：${a}(x${signTerm(shift)}) = ${a * (x + shift)}，x =`;
        answer = String(x);
      } else if (qNumber === 3) {
        const length = 10 + day;
        const width = 4 + day;
        const perimeter = 2 * length + 2 * width;
        prompt = `矩形周长 P = 2l + 2w。若 P = ${perimeter}，l = ${length}，w =`;
        answer = String(width);
      } else if (qNumber === 4) {
        const x = 7 + day;
        const y = 2 + qNumber;
        prompt = `方程组 x + y = ${x + y}，x - y = ${x - y}。x =`;
        answer = String(x);
      } else if (qNumber === 5) {
        const x = 3 + day;
        const y = 2 * day + qNumber;
        const b1 = y - 2 * x;
        const b2 = y + x;
        prompt = `两条直线 y = ${formatLinear(2, b1)} 和 y = ${formatLinear(-1, b2)} 的交点 x 坐标是`;
        answer = String(x);
      } else if (qNumber === 6) {
        const a = 2 + (day % 4);
        const x = 5 + day;
        const b = day - 3;
        prompt = `不等式 ${formatLinear(a, b)} > ${a * x + b - 1} 的最小整数解是`;
        answer = String(x);
      } else if (qNumber === 7) {
        const original = 100 + day * 20;
        const percent = 10 + day * 5;
        const finalValue = original * (1 + percent / 100);
        prompt = `一个数增加 ${percent}% 后变成 ${finalValue}，原数是`;
        answer = String(original);
      } else {
        const first = 72 + day;
        const second = 84 + day;
        const third = 90 + day;
        const average = (first + second + third) / 3;
        prompt = `三次数学小测 ${first}、${second}、□ 的平均分是 ${formatDecimal(average, 1)}，□ =`;
        answer = String(third);
      }
      break;
    }

    case 2: {
      if (qNumber === 1) {
        const a = 2 + (day % 5);
        const c = 3 + qNumber;
        const b = day - 6;
        const d = 4 - day;
        prompt = `合并同类项：(${formatLinear(a, b)}) + (${formatLinear(c, d)}) =`;
        answer = formatLinear(a + c, b + d);
      } else if (qNumber === 2) {
        const a = 2 + (day % 4);
        const b = 3 + qNumber;
        const c = day - 5;
        prompt = `展开：${a}x(${formatLinear(b, c)}) =`;
        answer = formatPolynomial([
          { coef: a * b, power: 2 },
          { coef: a * c, power: 1 }
        ]);
      } else if (qNumber === 3) {
        const r = 2 + (day % 5);
        const s = qNumber - 5;
        prompt = `展开：(x${signTerm(r)})(x${signTerm(s)}) =`;
        answer = formatPolynomial([
          { coef: 1, power: 2 },
          { coef: r + s, power: 1 },
          { coef: r * s, power: 0 }
        ]);
      } else if (qNumber === 4) {
        const a = 3 + (day % 4);
        const b = 2 + qNumber;
        prompt = `提公因式：${formatPolynomial([{ coef: a, power: 2 }, { coef: a * b, power: 1 }])} =`;
        answer = `${a}x(x + ${b})`;
      } else if (qNumber === 5) {
        const r = 2 + (day % 4);
        const s = 3 + (day % 5);
        prompt = `因式分解：${formatPolynomial([{ coef: 1, power: 2 }, { coef: r + s, power: 1 }, { coef: r * s, power: 0 }])} =`;
        answer = `${formatFactor(r)}${formatFactor(s)}`;
      } else if (qNumber === 6) {
        const r = 2 + (day % 6);
        prompt = `展开：(x + ${r})^2 =`;
        answer = formatPolynomial([
          { coef: 1, power: 2 },
          { coef: 2 * r, power: 1 },
          { coef: r * r, power: 0 }
        ]);
      } else if (qNumber === 7) {
        const x = day - 3;
        const c = 5 - qNumber;
        prompt = `若 p(x) = ${formatPolynomial([{ coef: 2, power: 2 }, { coef: -3, power: 1 }, { coef: c, power: 0 }])}，p(${x}) =`;
        answer = String(2 * x * x - 3 * x + c);
      } else {
        const degree = 3 + (day % 2);
        prompt = `多项式 ${formatPolynomial([{ coef: 4, power: degree }, { coef: -2, power: 2 }, { coef: 7, power: 0 }])} 的次数是`;
        answer = String(degree);
      }
      break;
    }

    case 3: {
      if (qNumber === 1) {
        const a = 2 + (day % 5);
        const b = 3 + (day % 4);
        prompt = `2^${a} × 2^${b} = 2^□，□ =`;
        answer = String(a + b);
      } else if (qNumber === 2) {
        const a = 5 + day;
        const b = 3 + qNumber;
        const c = 2 + (day % 3);
        prompt = `(x^${a} × x^${b}) ÷ x^${c} = x^□，□ =`;
        answer = String(a + b - c);
      } else if (qNumber === 3) {
        const n = 9 + day;
        prompt = `√${n * n} =`;
        answer = String(n);
      } else if (qNumber === 4) {
        const outside = 2 + (day % 4);
        const inside = [2, 3, 5, 6][day % 4];
        prompt = `化简根式：√${outside * outside * inside} =`;
        answer = `${outside}√${inside}`;
      } else if (qNumber === 5) {
        const coefficient = 2 + (day % 3);
        const multiplier = 2;
        const power = 4 + (day % 3);
        prompt = `(${coefficient} × 10^${power}) × (${multiplier} × 10^2) =`;
        answer = `${coefficient * multiplier} × 10^${power + 2}`;
      } else if (qNumber === 6) {
        const base = 2 + (day % 4);
        const exponent = 2 + (day % 2);
        prompt = `${base}^-${exponent} =`;
        answer = `1/${base ** exponent}`;
      } else if (qNumber === 7) {
        const coefficient = 3 + (day % 6);
        const power = 4 + (qNumber % 3);
        const value = coefficient * 10 ** power;
        prompt = `把 ${value} 写成科学记数法。`;
        answer = `${coefficient} × 10^${power}`;
      } else {
        const lower = 8 + day;
        const n = lower * lower + 2 * day + 3;
        prompt = `√${n} 介于哪两个连续整数之间？`;
        answer = `${lower} 和 ${lower + 1}`;
      }
      break;
    }

    case 4: {
      if (qNumber === 1) {
        const a = 1 + (day % 3);
        const b = qNumber - day;
        const c = 4 - day;
        const x = day - 2;
        prompt = `若 f(x) = ${formatPolynomial([{ coef: a, power: 2 }, { coef: b, power: 1 }, { coef: c, power: 0 }])}，f(${x}) =`;
        answer = String(a * x * x + b * x + c);
      } else if (qNumber === 2) {
        const h = day - 5;
        const k = qNumber - 6;
        prompt = `二次函数 y = (x${signTerm(-h)})^2${signTerm(k)} 的顶点是`;
        answer = `(${h}, ${k})`;
      } else if (qNumber === 3) {
        const r1 = -2 - (day % 4);
        const r2 = 3 + (day % 5);
        prompt = `二次函数 y = ${formatFactor(-r1)}${formatFactor(-r2)} 的零点是`;
        answer = `${r1}, ${r2}`;
      } else if (qNumber === 4) {
        const r1 = 2 + (day % 3);
        const r2 = r1 + 4;
        prompt = `抛物线的两个零点是 x = ${r1} 和 x = ${r2}，对称轴是 x =`;
        answer = String((r1 + r2) / 2);
      } else if (qNumber === 5) {
        const r1 = 2 + (day % 4);
        const r2 = 5 + (day % 3);
        const a = 1 + (qNumber % 2);
        prompt = `y = ${a}${formatFactor(-r1)}${formatFactor(-r2)} 的 y-intercept 是`;
        answer = String(a * r1 * r2);
      } else if (qNumber === 6) {
        const r = 2 + (day % 5);
        const s = 1 + qNumber;
        prompt = `展开：(x - ${r})(x + ${s}) =`;
        answer = formatPolynomial([
          { coef: 1, power: 2 },
          { coef: s - r, power: 1 },
          { coef: -r * s, power: 0 }
        ]);
      } else if (qNumber === 7) {
        const half = 3 + (day % 5);
        const b = 2 * half;
        prompt = `要让 x^2 + ${b}x + c 成为完全平方三项式，c =`;
        answer = String(half * half);
      } else {
        const a = 1 + (day % 4);
        const b = qNumber - 5;
        const c = 2 - day;
        const y0 = c;
        const y1 = a + b + c;
        const y2 = 4 * a + 2 * b + c;
        prompt = `二次关系在 x = 0, 1, 2 时的 y 值是 ${y0}、${y1}、${y2}，二阶差分是`;
        answer = String(y2 - 2 * y1 + y0);
      }
      break;
    }

    case 5: {
      const triples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
        [9, 12, 15],
        [6, 8, 10],
        [10, 24, 26],
        [12, 16, 20],
        [15, 20, 25],
        [20, 21, 29]
      ];
      const [legA, legB, hyp] = triples[(day + qNumber) % triples.length];

      if (qNumber === 1) {
        prompt = `直角三角形两条直角边是 ${legA} 和 ${legB}，斜边是`;
        answer = String(hyp);
      } else if (qNumber === 2) {
        prompt = `直角三角形斜边是 ${hyp}，一条直角边是 ${legA}，另一条直角边是`;
        answer = String(legB);
      } else if (qNumber === 3) {
        prompt = `直角三角形中，相对边 ${legA}，斜边 ${hyp}，sin θ =`;
        answer = reduceFraction(legA, hyp);
      } else if (qNumber === 4) {
        prompt = `直角三角形中，邻边 ${legB}，斜边 ${hyp}，cos θ 约等于多少？保留两位小数。`;
        answer = formatDecimal(legB / hyp, 2);
      } else if (qNumber === 5) {
        prompt = `直角三角形中，相对边 ${legA}，邻边 ${legB}，tan θ =`;
        answer = reduceFraction(legA, legB);
      } else if (qNumber === 6) {
        prompt = `一架梯子长 ${hyp} m，梯脚离墙 ${legA} m，梯子到墙上的高度是几 m？`;
        answer = String(legB);
      } else if (qNumber === 7) {
        prompt = `一条坡道 rise = ${legA}，run = ${legB}，坡度 tan θ =`;
        answer = reduceFraction(legA, legB);
      } else {
        prompt = `直角三角形两条直角边是 ${legA} cm 和 ${legB} cm，面积是几 cm²？`;
        answer = String((legA * legB) / 2);
      }
      break;
    }

    case 6: {
      if (qNumber === 1) {
        const price = 80 + day * 10;
        const discount = 10 + (day % 4) * 5;
        prompt = `加拿大商店一件外套 ${formatMoney(price)}，打 ${discount}% off。税前价格是`;
        answer = formatMoney(price * (1 - discount / 100));
      } else if (qNumber === 2) {
        const price = 100 + day * 10;
        prompt = `商品税前 ${formatMoney(price)}，按 13% HST 计算，税后总价是`;
        answer = formatMoney(price * 1.13);
      } else if (qNumber === 3) {
        const meal = 40 + day * 5;
        prompt = `餐费 ${formatMoney(meal)}，给 15% tip，总共支付`;
        answer = formatMoney(meal * 1.15);
      } else if (qNumber === 4) {
        const principal = 500 + day * 100;
        const rate = 3 + (day % 5);
        const years = 2 + (day % 3);
        prompt = `本金 ${formatMoney(principal)}，单利 ${rate}%/year，${years} 年的利息是`;
        answer = formatMoney(principal * (rate / 100) * years);
      } else if (qNumber === 5) {
        const cad = 100 + day * 50;
        const rate = 0.74;
        prompt = `若 1 CAD ≈ 0.74 USD，${formatMoney(cad)} CAD 约等于多少 USD？`;
        answer = `${formatMoney(cad * rate)} USD`;
      } else if (qNumber === 6) {
        const speed = 72 + day * 3;
        const time = 1.5 + (day % 3) * 0.5;
        prompt = `汽车平均速度 ${speed} km/h，行驶 ${time} h，距离是几 km？`;
        answer = formatDecimal(speed * time, 1);
      } else if (qNumber === 7) {
        const count = 4 + (day % 4);
        const unit = 3 + day;
        prompt = `${count} 个同款笔记本共 ${formatMoney(count * unit)}，单价是`;
        answer = formatMoney(unit);
      } else {
        const original = 80 + day * 10;
        const percent = 10 + (day % 5) * 5;
        const newer = original * (1 + percent / 100);
        prompt = `数量从 ${original} 增加到 ${formatDecimal(newer, 1)}，percent increase 是多少？`;
        answer = `${percent}%`;
      }
      break;
    }

    case 7: {
      if (qNumber === 1) {
        const nums = [60 + day, 70 + day, 80 + day];
        prompt = `${nums.join("、")} 的平均数是`;
        answer = String(70 + day);
      } else if (qNumber === 2) {
        const nums = [82 + day, 70 + day, 90 + day, 76 + day, 84 + day];
        prompt = `${nums.join("、")} 的中位数是`;
        answer = String(nums.slice().sort((a, b) => a - b)[2]);
      } else if (qNumber === 3) {
        const nums = [45 + day, 62 + day, 58 + day, 71 + day, 49 + day];
        prompt = `${nums.join("、")} 的 range 是`;
        answer = String(Math.max(...nums) - Math.min(...nums));
      } else if (qNumber === 4) {
        const test = 70 + day;
        const project = 80 + day;
        prompt = `成绩由 test 40% 和 project 60% 组成。test=${test}，project=${project}，总评是`;
        answer = formatDecimal(test * 0.4 + project * 0.6, 1);
      } else if (qNumber === 5) {
        const red = 3 + day;
        const blue = 5 + qNumber;
        prompt = `袋中有 ${red} 个红球和 ${blue} 个蓝球，随机取 1 个是红球的概率是`;
        answer = reduceFraction(red, red + blue);
      } else if (qNumber === 6) {
        const actual = 100 + day * 10;
        const percentError = 5 + (day % 4) * 5;
        const estimate = actual * (1 + percentError / 100);
        prompt = `实际值 ${actual}，估计值 ${formatDecimal(estimate, 1)}，percent error 是`;
        answer = `${percentError}%`;
      } else if (qNumber === 7) {
        const q1 = 18 + day;
        const q3 = 34 + day + qNumber;
        prompt = `一组数据的 Q1 = ${q1}，Q3 = ${q3}，IQR =`;
        answer = String(q3 - q1);
      } else {
        const start = 1200 + day * 80;
        const yearly = 150 + day * 10;
        prompt = `某社区人口从 ${start} 开始，每年线性增加 ${yearly}。4 年后人口是`;
        answer = String(start + 4 * yearly);
      }
      break;
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

function signTerm(value, variable = "") {
  if (value === 0) return "";
  const sign = value < 0 ? " - " : " + ";
  const abs = Math.abs(value);
  const body = variable ? `${abs === 1 ? "" : abs}${variable}` : String(abs);
  return `${sign}${body}`;
}

function formatLinear(coef, constant) {
  return formatPolynomial([
    { coef, power: 1 },
    { coef: constant, power: 0 }
  ]);
}

function formatPolynomial(terms) {
  const cleanTerms = terms.filter((term) => term.coef !== 0);
  if (!cleanTerms.length) return "0";

  return cleanTerms
    .map((term, index) => {
      const sign = term.coef < 0 ? (index === 0 ? "-" : " - ") : index === 0 ? "" : " + ";
      const abs = Math.abs(term.coef);
      let body = "";

      if (term.power === 0) {
        body = String(abs);
      } else if (term.power === 1) {
        body = `${abs === 1 ? "" : abs}x`;
      } else {
        body = `${abs === 1 ? "" : abs}x^${term.power}`;
      }

      return `${sign}${body}`;
    })
    .join("");
}

function formatFactor(constant) {
  return `(x${signTerm(constant)})`;
}

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function formatDecimal(value, places = 1) {
  return Number(value.toFixed(places)).toString();
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
  const highDays = dayStats.filter((stats) => stats.graded >= 32 && stats.correct >= 28).length;
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
      desc: "完成任意一天 64 道题。",
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
      desc: "至少 3 天获得 28 道以上正确批改。",
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
