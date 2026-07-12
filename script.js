// Number Sense Academy application logic.
// The app is intentionally framework-free so it can run by opening index.html.

const DATA = window.NumberSenseAcademyData;
const TEACHER_USERNAME = "Elven Zeng";
const TEACHER_PASSWORD = "Elven2026!";
const USERS_KEY = "numberSenseAcademy.users.v1";
const SESSION_KEY = "numberSenseAcademy.currentUser.v1";
const PROGRESS_BY_USER_KEY = "numberSenseAcademy.progressByUser.v1";
const LEGACY_PROGRESS_KEY = "numberSenseAcademy.progress.v1";
const ASSIGNMENTS_KEY = "numberSenseAcademy.assignments.v1";
const THEME_KEY = "numberSenseAcademy.theme.v1";
const FILE_DB_NAME = "numberSenseAcademy.files.v1";
const FILE_STORE_NAME = "files";
const DAILY_COUNT = 10;
const SPEED_SECONDS = 60;
const HOMEWORK_STATUSES = [
  "Not submitted",
  "Submitted",
  "Late",
  "Needs revision",
  "Reviewed",
  "Complete",
  "Missing"
];

const app = document.querySelector("#app");
const themeLabel = document.querySelector("[data-theme-label]");
const logoutButton = document.querySelector("[data-action='logout']");

let currentUser = null;
let authMode = "login";
let practiceSession = null;
let practiceTimerId = null;
let speedTimerId = null;
let chartInstances = [];
let calendarMonth = new Date();
let selectedCalendarDate = todayKey();

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);

initialize();

function initialize() {
  seedTeacherAccount();
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
  currentUser = getCurrentUser();
  updateAuthButtons();
  if (currentUser) renderHome();
  else renderAuth();
}

function renderAuth(message = "") {
  stopTimers();
  destroyCharts();

  app.innerHTML = `
    <section class="hero-panel auth-layout">
      <div>
        <span class="eyebrow">Number Sense Academy</span>
        <h1>Practice starts after sign in</h1>
        <p>Students get a daily 10-question set from the number sense modules. The teacher account can assign work, review submissions, record class time, and see all registered student progress.</p>
        <div class="stat-grid">
          <div class="stat"><strong>10</strong><span>Daily questions</span></div>
          <div class="stat"><strong>8</strong><span>Core modules</span></div>
          <div class="stat"><strong>80</strong><span>Question bank</span></div>
        </div>
      </div>
      <article class="panel auth-card">
        <div class="auth-tabs">
          <button class="tab-button ${authMode === "login" ? "active" : ""}" type="button" data-action="auth-mode" data-mode="login">Log in</button>
          <button class="tab-button ${authMode === "register" ? "active" : ""}" type="button" data-action="auth-mode" data-mode="register">Register</button>
        </div>
        <form class="form" data-form="auth">
          <div class="field">
            <label>Username</label>
            <input name="username" autocomplete="username" placeholder="${authMode === "login" ? "Username" : "Create a username"}" required>
          </div>
          <div class="field">
            <label>Password</label>
            <input name="password" type="password" autocomplete="${authMode === "login" ? "current-password" : "new-password"}" placeholder="Password" required>
          </div>
          ${message ? `<div class="message">${escapeHtml(message)}</div>` : ""}
          <button class="primary-button" type="submit">${authMode === "login" ? "Log in" : "Create student account"}</button>
          <p class="muted-note">Teacher login: ${TEACHER_USERNAME}</p>
        </form>
      </article>
    </section>
  `;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "toggle-theme") toggleTheme();
  if (action === "auth-mode") {
    authMode = target.dataset.mode;
    renderAuth();
    return;
  }
  if (action === "logout") {
    stopTimers();
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    updateAuthButtons();
    renderAuth();
    return;
  }

  if (!currentUser) {
    renderAuth();
    return;
  }

  if (action === "home") renderHome();
  if (action === "start-category") startCategory(target.dataset.category);
  if (action === "start-random") startRandomPractice();
  if (action === "start-daily") startDailyChallenge();
  if (action === "start-mistakes") startMistakeReview();
  if (action === "submit-answer") submitCurrentAnswer();
  if (action === "show-answer") showAnswer();
  if (action === "next-question") nextQuestion();
  if (action === "restart-session") restartCurrentSession();
  if (action === "speed") renderSpeedChallenge();
  if (action === "start-speed") startSpeedChallenge();
  if (action === "submit-speed") submitSpeedAnswer();
  if (action === "daily") renderDailyChallenge();
  if (action === "random") renderRandomPractice();
  if (action === "mistakes") renderMistakeBook();
  if (action === "progress") renderProgressDashboard();
  if (action === "achievements") renderAchievements();
  if (action === "teacher") renderTeacherDashboard();
  if (action === "view-student") renderTeacherDashboard(target.dataset.username);
  if (action === "calendar") renderCalendarView();
  if (action === "calendar-prev") {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    selectedCalendarDate = toDateKey(calendarMonth);
    renderCalendarView(selectedCalendarDate);
  }
  if (action === "calendar-next") {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    selectedCalendarDate = toDateKey(calendarMonth);
    renderCalendarView(selectedCalendarDate);
  }
  if (action === "select-date") {
    selectedCalendarDate = target.dataset.date;
    calendarMonth = parseDateKey(selectedCalendarDate);
    renderCalendarView(selectedCalendarDate);
  }
  if (action === "download-file") downloadStoredFile(target.dataset.fileId);
  if (action === "delete-assignment") deleteAssignment(target.dataset.assignmentId);
  if (action === "delete-lesson") deleteLesson(target.dataset.lessonId);
  if (action === "ai") renderAiGenerator();
  if (action === "clear-progress") clearProgress();
  if (action === "export-report") exportTeacherReport();
}

function handleSubmit(event) {
  event.preventDefault();

  if (event.target.dataset.form === "auth") {
    if (authMode === "login") login(event.target);
    else register(event.target);
  }

  if (!currentUser) return;

  if (event.target.dataset.form === "answer") {
    submitCurrentAnswer();
  }

  if (event.target.dataset.form === "speed") {
    submitSpeedAnswer();
  }

  if (event.target.dataset.form === "assignment") {
    saveAssignment(event.target);
  }

  if (event.target.dataset.form === "submission") {
    saveSubmission(event.target);
  }

  if (event.target.dataset.form === "review") {
    saveReview(event.target);
  }

  if (event.target.dataset.form === "lesson") {
    saveLesson(event.target);
  }
}

function renderHome() {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const stats = getOverallStats(progress);
  const isTeacher = currentUser.role === "teacher";
  const modules = DATA.modules.filter((module) => isTeacher || module.type !== "teacher");
  const today = todayKey();
  const dailyDone = Boolean(progress.daily.completions[today]);

  app.innerHTML = `
    <section class="hero-panel">
      <div>
        <span class="eyebrow">${isTeacher ? "Teacher access active" : "Student practice dashboard"}</span>
        <h1>Welcome, ${escapeHtml(currentUser.username)}</h1>
        <p>${isTeacher ? "Manage assignments, class time, student submissions, and all registered student progress." : "Complete today's 10-question number sense set, then continue with games and targeted modules."}</p>
        <div class="button-row">
          ${isTeacher ? `<button class="primary-button" type="button" data-action="teacher">Teacher Dashboard</button>` : `<button class="primary-button" type="button" data-action="start-daily">${dailyDone ? "Practice Today's Set Again" : "Start Today's 10 Questions"}</button>`}
          <button class="secondary-button" type="button" data-action="calendar">Calendar</button>
          <button class="ghost-button" type="button" data-action="progress">Progress</button>
        </div>
      </div>
      <div class="hero-stats" aria-label="Progress summary">
        <div class="stat"><strong>${stats.completed}</strong><span>Questions completed</span></div>
        <div class="stat"><strong>${stats.accuracy}%</strong><span>Accuracy</span></div>
        <div class="stat"><strong>${dailyDone ? "Done" : "Open"}</strong><span>Today's 10 questions</span></div>
      </div>
    </section>

    <section>
      <div class="section-head">
        <div>
          <h2>Choose a Module</h2>
          <p>Start with a focused skill, a challenge mode, or review your progress.</p>
        </div>
      </div>
      <div class="module-grid">
        ${modules.map((module) => moduleCard(module, progress)).join("")}
      </div>
    </section>
  `;
}

function moduleCard(module, progress) {
  const action = moduleAction(module);
  const category = DATA.categories.find((item) => item.id === module.id);
  const categoryProgress = category ? categoryCompletion(module.id, progress) : null;

  return `
    <button class="module-card" type="button" ${action}>
      <span class="module-mark">${escapeHtml(module.accent)}</span>
      <span class="module-type">${module.type === "category" ? "Practice" : "Tool"}</span>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.description)}</p>
      ${categoryProgress ? `
        <div class="progress-track" aria-label="${escapeHtml(module.title)} progress">
          <div class="progress-fill" style="width: ${categoryProgress.percent}%"></div>
        </div>
        <div class="mini-meta">
          <span>${categoryProgress.completed}/10 completed</span>
          <span>${categoryProgress.accuracy}% accuracy</span>
        </div>
      ` : `<div class="mini-meta"><span>${toolMeta(module, progress)}</span></div>`}
    </button>
  `;
}

function moduleAction(module) {
  if (module.type === "category") return `data-action="start-category" data-category="${module.id}"`;
  if (module.type === "speed") return `data-action="speed"`;
  if (module.type === "daily") return `data-action="daily"`;
  if (module.type === "random") return `data-action="random"`;
  if (module.type === "mistakes") return `data-action="mistakes"`;
  if (module.type === "ai") return `data-action="ai"`;
  if (module.type === "progress") return `data-action="progress"`;
  if (module.type === "achievements") return `data-action="achievements"`;
  if (module.type === "teacher") return `data-action="teacher"`;
  return `data-action="home"`;
}

function toolMeta(module, progress) {
  if (module.type === "speed") return `Best ${progress.speed.bestScore || 0}`;
  if (module.type === "daily") return `${progress.daily.streak} day streak`;
  if (module.type === "mistakes") return `${Object.keys(progress.mistakes).length} saved mistakes`;
  if (module.type === "achievements") return `${getUnlockedAchievements(progress).length} badges`;
  return "Open";
}

function startCategory(categoryId) {
  const category = DATA.categories.find((item) => item.id === categoryId);
  const questions = getQuestionsByCategory(categoryId);
  startPractice({
    mode: "category",
    title: category.title,
    categoryId,
    questions: shuffle([...questions]),
    restart: () => startCategory(categoryId)
  });
}

function startRandomPractice() {
  startPractice({
    mode: "random",
    title: "Random Practice",
    categoryId: "random",
    questions: shuffle([...DATA.questions]).slice(0, 10),
    restart: startRandomPractice
  });
}

function startDailyChallenge() {
  const today = todayKey();
  startPractice({
    mode: "daily",
    title: "Daily Challenge",
    categoryId: "daily",
    questions: dailyQuestions(today),
    dailyDate: today,
    restart: startDailyChallenge
  });
}

function startMistakeReview() {
  const progress = getProgress();
  const mistakeIds = Object.keys(progress.mistakes);
  const questions = mistakeIds
    .map((id) => getQuestionById(id))
    .filter(Boolean);

  if (!questions.length) {
    renderMistakeBook("No saved mistakes yet. Incorrect answers will appear here automatically.");
    return;
  }

  startPractice({
    mode: "mistakes",
    title: "Mistake Book Review",
    categoryId: "mistakes",
    questions: shuffle(questions),
    restart: startMistakeReview
  });
}

function startPractice(config) {
  stopTimers();
  destroyCharts();

  practiceSession = {
    ...config,
    index: 0,
    score: 0,
    submitted: false,
    revealed: false,
    answers: [],
    startedAt: Date.now(),
    questionStartedAt: Date.now()
  };

  renderQuestion();
}

function renderQuestion() {
  const question = currentQuestion();
  const elapsed = Math.round((Date.now() - practiceSession.startedAt) / 1000);
  const percent = ((practiceSession.index + 1) / practiceSession.questions.length) * 100;

  stopPracticeTimer();

  app.innerHTML = `
    <section class="question-shell">
      <div class="section-head">
        <div>
          <span class="eyebrow">${escapeHtml(practiceSession.title)}</span>
          <h1>Question ${practiceSession.index + 1}</h1>
          <p>${categoryTitle(question.category)} · Difficulty ${question.difficulty}</p>
        </div>
        <div class="button-row">
          <button class="ghost-button" type="button" data-action="home">Home</button>
          <button class="secondary-button" type="button" data-action="restart-session">Restart</button>
        </div>
      </div>

      <div class="progress-row">
        <span>Question ${practiceSession.index + 1} / ${practiceSession.questions.length}</span>
        <span>Score ${practiceSession.score}</span>
        <span>Time <span id="practiceTime">${formatDuration(elapsed)}</span></span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>

      <article class="question-card" id="questionCard">
        <div class="question-meta">
          <span class="pill">${categoryTitle(question.category)}</span>
          <span class="pill">Difficulty ${question.difficulty}</span>
          <span class="pill">${practiceSession.mode}</span>
        </div>
        <h2 class="question-text">${escapeHtml(question.question)}</h2>
        <form class="answer-area" data-form="answer">
          <input class="answer-input" id="answerInput" autocomplete="off" placeholder="Type your answer">
          <div class="button-row">
            <button class="primary-button" type="submit">Submit</button>
            <button class="secondary-button" type="button" data-action="show-answer">Show Answer</button>
            <button class="ghost-button" type="button" data-action="next-question">${practiceSession.index + 1 === practiceSession.questions.length ? "Finish" : "Next Question"}</button>
          </div>
          <div class="feedback" id="feedback" aria-live="polite"></div>
        </form>
      </article>
    </section>
  `;

  const input = document.querySelector("#answerInput");
  if (input) input.focus();
  startPracticeTimer();
}

function submitCurrentAnswer() {
  if (!practiceSession || practiceSession.submitted) return;

  const input = document.querySelector("#answerInput");
  const value = input?.value.trim() || "";
  const feedback = document.querySelector("#feedback");
  const question = currentQuestion();

  if (!value) {
    showInlineFeedback("incorrect", "Enter an answer first.");
    return;
  }

  const elapsed = Math.round((Date.now() - practiceSession.questionStartedAt) / 1000);
  const correct = answerMatches(value, question.answer) && !practiceSession.revealed;

  practiceSession.submitted = true;
  if (correct) practiceSession.score += 1;

  const attempt = saveAttempt(question, {
    answer: value,
    correct,
    revealed: practiceSession.revealed,
    elapsed,
    mode: practiceSession.mode
  });

  practiceSession.answers.push(attempt);
  renderAnswerFeedback(feedback, question, correct, practiceSession.revealed);
}

function showAnswer() {
  if (!practiceSession) return;
  practiceSession.revealed = true;

  const question = currentQuestion();
  const feedback = document.querySelector("#feedback");
  feedback.className = "feedback show";
  feedback.innerHTML = `<strong>Answer: ${formatAnswer(question.answer)}</strong>${escapeHtml(question.explanation)}`;
}

function nextQuestion() {
  if (!practiceSession) return;

  if (practiceSession.revealed && !practiceSession.submitted) {
    const question = currentQuestion();
    const elapsed = Math.round((Date.now() - practiceSession.questionStartedAt) / 1000);
    const attempt = saveAttempt(question, {
      answer: "",
      correct: false,
      revealed: true,
      elapsed,
      mode: practiceSession.mode
    });
    practiceSession.answers.push(attempt);
  }

  if (practiceSession.index + 1 >= practiceSession.questions.length) {
    finishPractice();
    return;
  }

  practiceSession.index += 1;
  practiceSession.submitted = false;
  practiceSession.revealed = false;
  practiceSession.questionStartedAt = Date.now();
  renderQuestion();
}

function finishPractice() {
  stopTimers();

  const progress = getProgress();
  const total = practiceSession.questions.length;
  const score = practiceSession.score;
  const accuracy = total ? Math.round((score / total) * 100) : 0;

  progress.sessions.push({
    id: createId("session"),
    mode: practiceSession.mode,
    title: practiceSession.title,
    categoryId: practiceSession.categoryId,
    score,
    total,
    accuracy,
    completedAt: new Date().toISOString()
  });

  if (practiceSession.mode === "daily") {
    recordDailyCompletion(progress, practiceSession.dailyDate, score, total);
  }

  saveProgress(progress);
  burstConfetti();

  app.innerHTML = `
    <section class="score-card">
      <span class="pill">${escapeHtml(practiceSession.title)}</span>
      <h1>Session Complete</h1>
      <div class="score-number">${score}/${total}</div>
      <p>${scoreMessage(accuracy)}</p>
      <div class="button-row center">
        <button class="primary-button" type="button" data-action="restart-session">Restart</button>
        <button class="secondary-button" type="button" data-action="progress">Progress Dashboard</button>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function restartCurrentSession() {
  if (practiceSession?.restart) {
    practiceSession.restart();
  } else {
    renderHome();
  }
}

function renderAnswerFeedback(feedback, question, correct, revealed) {
  const card = document.querySelector("#questionCard");
  const reason = correct
    ? "Correct."
    : revealed
      ? "Answer was shown first, so this is saved for review."
      : "Not quite.";

  feedback.className = `feedback show ${correct ? "correct" : "incorrect"}`;
  feedback.innerHTML = `<strong>${reason}</strong>Answer: ${formatAnswer(question.answer)}<br>${escapeHtml(question.explanation)}`;

  card.classList.remove("correct-burst", "wrong-shake");
  void card.offsetWidth;
  card.classList.add(correct ? "correct-burst" : "wrong-shake");
}

function showInlineFeedback(type, message) {
  const feedback = document.querySelector("#feedback");
  if (!feedback) return;
  feedback.className = `feedback show ${type}`;
  feedback.innerHTML = `<strong>${escapeHtml(message)}</strong>`;
}

function renderRandomPractice() {
  stopTimers();
  destroyCharts();

  app.innerHTML = `
    <section class="panel intro-panel">
      <span class="eyebrow">Random Practice</span>
      <h1>Mixed Skill Session</h1>
      <p>Practice 10 shuffled questions from the full question bank. This mode is useful when a student needs flexible retrieval instead of category-by-category practice.</p>
      <div class="button-row">
        <button class="primary-button" type="button" data-action="start-random">Start Random Practice</button>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function renderDailyChallenge(message = "") {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const today = todayKey();
  const completion = progress.daily.completions[today];

  app.innerHTML = `
    <section class="panel intro-panel">
      <span class="eyebrow">Daily Challenge</span>
      <h1>Today's 10 Questions</h1>
      <p>Every day has exactly 10 questions: one from each of the 8 number sense modules, plus 2 extra rotating module questions. The set stays fixed for the day and refreshes tomorrow.</p>
      <div class="stat-grid">
        <div class="stat"><strong>${progress.daily.streak}</strong><span>Daily streak</span></div>
        <div class="stat"><strong>${completion ? `${completion.score}/${completion.total}` : "Open"}</strong><span>Today status</span></div>
        <div class="stat"><strong>${Object.keys(progress.daily.completions).length}</strong><span>Days completed</span></div>
      </div>
      ${completion ? `<div class="message ok">Daily completion badge unlocked for ${today}.</div>` : ""}
      ${message ? `<div class="message">${escapeHtml(message)}</div>` : ""}
      <div class="button-row">
        <button class="primary-button" type="button" data-action="start-daily">${completion ? "Practice Again" : "Start Daily Challenge"}</button>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function renderMistakeBook(message = "") {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const mistakes = Object.values(progress.mistakes)
    .map((mistake) => ({ ...mistake, question: getQuestionById(mistake.questionId) }))
    .filter((item) => item.question)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">Mistake Book</span>
          <h1>Review Incorrect Questions</h1>
          <p>Incorrect answers and shown-answer questions are saved automatically. Correct answers remove a question from this list.</p>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="start-mistakes" ${mistakes.length ? "" : "disabled"}>Review Mistakes</button>
          <button class="ghost-button" type="button" data-action="home">Home</button>
        </div>
      </div>
      ${message ? `<div class="message">${escapeHtml(message)}</div>` : ""}
      <div class="mistake-list">
        ${mistakes.length ? mistakes.map(mistakeCard).join("") : `<div class="empty">No mistakes yet. Keep practicing and this book will fill automatically.</div>`}
      </div>
    </section>
  `;
}

function mistakeCard(item) {
  return `
    <article class="record-card">
      <div>
        <span class="pill">${categoryTitle(item.question.category)}</span>
        <h3>${escapeHtml(item.question.question)}</h3>
        <p>Last answer: ${escapeHtml(item.lastAnswer || "Answer shown")}</p>
      </div>
      <div>
        <strong>${formatDateTime(item.savedAt)}</strong>
        <span>${item.count} mistake${item.count === 1 ? "" : "s"}</span>
      </div>
    </article>
  `;
}

function renderAiGenerator() {
  stopTimers();
  destroyCharts();

  app.innerHTML = `
    <section class="panel intro-panel">
      <span class="eyebrow">Placeholder UI</span>
      <h1>AI Question Generator</h1>
      <p>This mock interface shows where future personalized question generation can live. The static version does not call any AI service.</p>
      <div class="generator-mock">
        <div class="field">
          <label>Topic</label>
          <input value="Percent estimation" readonly>
        </div>
        <div class="field">
          <label>Difficulty</label>
          <select disabled>
            <option>Grade 8 - medium</option>
          </select>
        </div>
        <button class="primary-button" type="button" disabled>Generate Question</button>
      </div>
      <div class="button-row">
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function renderSpeedChallenge() {
  stopTimers();
  destroyCharts();

  const progress = getProgress();

  app.innerHTML = `
    <section class="panel intro-panel">
      <span class="eyebrow">Speed Challenge</span>
      <h1>60-Second Sprint</h1>
      <p>Answer random questions quickly. The sprint tracks score, accuracy, average response time, and your best score.</p>
      <div class="stat-grid">
        <div class="stat"><strong>${progress.speed.bestScore || 0}</strong><span>Best score</span></div>
        <div class="stat"><strong>${progress.speed.bestAccuracy || 0}%</strong><span>Best accuracy</span></div>
        <div class="stat"><strong>${progress.speed.bestAverageSeconds ? `${progress.speed.bestAverageSeconds}s` : "-"}</strong><span>Best avg time</span></div>
      </div>
      <div class="button-row">
        <button class="primary-button" type="button" data-action="start-speed">Start Sprint</button>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function startSpeedChallenge() {
  stopTimers();
  destroyCharts();

  practiceSession = {
    mode: "speed",
    questions: shuffle([...DATA.questions]),
    index: 0,
    score: 0,
    answered: 0,
    correct: 0,
    responseTimes: [],
    startedAt: Date.now(),
    questionStartedAt: Date.now(),
    remaining: SPEED_SECONDS
  };

  renderSpeedQuestion();
  speedTimerId = window.setInterval(updateSpeedTimer, 1000);
}

function renderSpeedQuestion() {
  const question = practiceSession.questions[practiceSession.index % practiceSession.questions.length];

  app.innerHTML = `
    <section class="question-shell speed-shell">
      <div class="progress-row speed-row">
        <span>Time <strong id="speedTime">${practiceSession.remaining}</strong>s</span>
        <span>Score ${practiceSession.score}</span>
        <span>Answered ${practiceSession.answered}</span>
      </div>
      <article class="question-card" id="questionCard">
        <div class="question-meta">
          <span class="pill">Speed Challenge</span>
          <span class="pill">${categoryTitle(question.category)}</span>
          <span class="pill">Best ${getProgress().speed.bestScore || 0}</span>
        </div>
        <h2 class="question-text">${escapeHtml(question.question)}</h2>
        <form class="answer-area" data-form="speed">
          <input class="answer-input" id="speedInput" autocomplete="off" placeholder="Type answer and press Enter">
          <div class="button-row">
            <button class="primary-button" type="submit">Submit</button>
            <button class="ghost-button" type="button" data-action="home">End</button>
          </div>
          <div class="feedback" id="feedback" aria-live="polite"></div>
        </form>
      </article>
    </section>
  `;

  document.querySelector("#speedInput")?.focus();
}

function submitSpeedAnswer() {
  if (!practiceSession || practiceSession.mode !== "speed") return;

  const input = document.querySelector("#speedInput");
  const value = input?.value.trim() || "";
  if (!value) return;

  const question = practiceSession.questions[practiceSession.index % practiceSession.questions.length];
  const elapsed = Math.round((Date.now() - practiceSession.questionStartedAt) / 1000);
  const correct = answerMatches(value, question.answer);

  practiceSession.answered += 1;
  practiceSession.correct += correct ? 1 : 0;
  practiceSession.score += correct ? 1 : 0;
  practiceSession.responseTimes.push(elapsed);

  saveAttempt(question, {
    answer: value,
    correct,
    revealed: false,
    elapsed,
    mode: "speed"
  });

  practiceSession.index += 1;
  practiceSession.questionStartedAt = Date.now();
  renderSpeedQuestion();
}

function updateSpeedTimer() {
  if (!practiceSession || practiceSession.mode !== "speed") return;

  practiceSession.remaining -= 1;
  const timer = document.querySelector("#speedTime");
  if (timer) timer.textContent = String(Math.max(0, practiceSession.remaining));

  if (practiceSession.remaining <= 0) {
    finishSpeedChallenge();
  }
}

function finishSpeedChallenge() {
  stopTimers();

  const progress = getProgress();
  const answered = practiceSession.answered;
  const accuracy = answered ? Math.round((practiceSession.correct / answered) * 100) : 0;
  const average = averageSeconds(practiceSession.responseTimes);

  progress.speed.bestScore = Math.max(progress.speed.bestScore || 0, practiceSession.score);
  progress.speed.bestAccuracy = Math.max(progress.speed.bestAccuracy || 0, accuracy);
  progress.speed.bestAverageSeconds = progress.speed.bestAverageSeconds
    ? Math.min(progress.speed.bestAverageSeconds, average || progress.speed.bestAverageSeconds)
    : average;
  progress.speed.runs.push({
    score: practiceSession.score,
    answered,
    accuracy,
    averageSeconds: average,
    completedAt: new Date().toISOString()
  });
  saveProgress(progress);

  app.innerHTML = `
    <section class="score-card">
      <span class="pill">Speed Challenge</span>
      <h1>Time</h1>
      <div class="score-number">${practiceSession.score}</div>
      <div class="stat-grid">
        <div class="stat"><strong>${accuracy}%</strong><span>Accuracy</span></div>
        <div class="stat"><strong>${average || 0}s</strong><span>Average response</span></div>
        <div class="stat"><strong>${progress.speed.bestScore}</strong><span>Best record</span></div>
      </div>
      <div class="button-row center">
        <button class="primary-button" type="button" data-action="start-speed">Try Again</button>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function renderProgressDashboard() {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const stats = getOverallStats(progress);
  const historyRows = progress.sessions
    .slice(-10)
    .reverse()
    .map((session) => `
      <tr>
        <td>${escapeHtml(session.title)}</td>
        <td>${session.score}/${session.total}</td>
        <td>${session.accuracy}%</td>
        <td>${formatDateTime(session.completedAt)}</td>
      </tr>
    `).join("");

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">Progress Dashboard</span>
          <h1>Learning Analytics</h1>
          <p>Progress is saved locally in this browser.</p>
        </div>
        <div class="button-row">
          <button class="danger-button" type="button" data-action="clear-progress">Clear Progress</button>
          <button class="ghost-button" type="button" data-action="home">Home</button>
        </div>
      </div>

      <div class="stat-grid dashboard-stats">
        <div class="stat"><strong>${stats.completed}</strong><span>Questions completed</span></div>
        <div class="stat"><strong>${stats.accuracy}%</strong><span>Accuracy</span></div>
        <div class="stat"><strong>${stats.strongest || "-"}</strong><span>Strongest category</span></div>
        <div class="stat"><strong>${stats.weakest || "-"}</strong><span>Weakest category</span></div>
        <div class="stat"><strong>${stats.averageTime}s</strong><span>Average solving time</span></div>
      </div>

      <div class="chart-grid">
        <article class="chart-card">
          <h3>Category Accuracy</h3>
          <canvas id="categoryChart" height="220"></canvas>
        </article>
        <article class="chart-card">
          <h3>Learning History</h3>
          <canvas id="historyChart" height="220"></canvas>
        </article>
      </div>
      <p class="chart-note" id="chartNote"></p>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Session</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>${historyRows || `<tr><td colspan="4">No completed sessions yet.</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;

  renderCharts(progress);
}

function renderAchievements() {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const badges = getAchievementDefinitions(progress);

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">Achievements</span>
          <h1>Badge Collection</h1>
          <p>Badges unlock automatically from practice, speed, and perfect sessions.</p>
        </div>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
      <div class="badge-grid">
        ${badges.map((badge) => `
          <article class="badge-card ${badge.unlocked ? "unlocked" : ""}">
            <span>${badge.code}</span>
            <h3>${badge.title}</h3>
            <p>${badge.description}</p>
            <strong>${badge.unlocked ? "Unlocked" : "Locked"}</strong>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTeacherDashboard(selectedUsername = "") {
  if (currentUser.role !== "teacher") {
    showToast("Only Elven Zeng has teacher dashboard access.");
    renderHome();
    return;
  }

  stopTimers();
  destroyCharts();

  const students = getUsers().filter((user) => user.role !== "teacher");
  const selected = selectedUsername || students[0]?.username || "";
  const rows = students.map((student) => teacherStudentRow(student, selected)).join("");
  const totals = students.reduce((summary, student) => {
    const stats = getOverallStats(getProgress(student.username));
    summary.completed += stats.completed;
    summary.correct += stats.correct;
    return summary;
  }, { completed: 0, correct: 0 });
  const classAccuracy = totals.completed ? Math.round((totals.correct / totals.completed) * 100) : 0;

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">Teacher Dashboard</span>
          <h1>All Registered Students</h1>
          <p>Signed in as ${TEACHER_USERNAME}. You can see every registered student's daily work, accuracy, completion, weak modules, submissions, and private feedback.</p>
        </div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="calendar">Calendar</button>
          <button class="primary-button" type="button" data-action="export-report">Export Report</button>
          <button class="ghost-button" type="button" data-action="home">Home</button>
        </div>
      </div>
      <div class="stat-grid teacher-stats">
        <div class="stat"><strong>${students.length}</strong><span>Registered students</span></div>
        <div class="stat"><strong>${totals.completed}</strong><span>Total answers</span></div>
        <div class="stat"><strong>${classAccuracy}%</strong><span>Class accuracy</span></div>
      </div>
      <div class="teacher-grid">
        <article class="panel">
          <h2>Student List</h2>
          <div class="student-list">
            ${students.length ? rows : `<div class="empty">No student accounts yet.</div>`}
          </div>
        </article>
        <article class="panel">
          ${selected ? teacherStudentDetail(selected) : `<div class="empty">Select a student to view practice progress.</div>`}
        </article>
      </div>
    </section>
  `;
}

function teacherStudentRow(student, selectedUsername) {
  const progress = getProgress(student.username);
  const stats = getOverallStats(progress);
  const completion = Math.min(100, Math.round((uniqueAnsweredCount(progress) / DATA.questions.length) * 100));
  const daily = progress.daily.completions[todayKey()] ? "Today done" : "Today open";

  return `
    <button class="student-row ${selectedUsername === student.username ? "active" : ""}" type="button" data-action="view-student" data-username="${escapeHtml(student.username)}">
      <strong>${escapeHtml(student.username)}</strong>
      <span>${stats.accuracy}% accuracy · ${completion}% completion · ${daily}</span>
    </button>
  `;
}

function teacherStudentDetail(username) {
  const progress = getProgress(username);
  const stats = getOverallStats(progress);
  const completion = Math.min(100, Math.round((uniqueAnsweredCount(progress) / DATA.questions.length) * 100));
  const categoryRows = DATA.categories.map((category) => {
    const attempts = progress.attempts.filter((attempt) => attempt.category === category.id);
    const correct = attempts.filter((attempt) => attempt.correct).length;
    const accuracy = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
    return `
      <tr>
        <td>${escapeHtml(category.title)}</td>
        <td>${attempts.length}</td>
        <td>${accuracy}%</td>
        <td>${attempts.filter((attempt) => !attempt.correct).length}</td>
      </tr>
    `;
  }).join("");
  const todayCompletion = progress.daily.completions[todayKey()];
  const recentAttempts = progress.attempts.slice(-12).reverse().map((attempt) => {
    const question = getQuestionById(attempt.questionId);
    return `
      <tr>
        <td>${escapeHtml(question?.question || attempt.questionId)}</td>
        <td>${escapeHtml(attempt.answer || "Shown / blank")}</td>
        <td>${attempt.correct ? "Correct" : "Needs review"}</td>
        <td>${formatDateTime(attempt.date)}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="section-head">
      <div>
        <h2>${escapeHtml(username)}</h2>
        <p>${stats.completed} answers · ${stats.accuracy}% accuracy · weakest: ${escapeHtml(stats.weakest || "No data yet")}</p>
      </div>
    </div>
    <div class="stat-grid teacher-stats">
      <div class="stat"><strong>${completion}%</strong><span>Question bank completion</span></div>
      <div class="stat"><strong>${todayCompletion ? `${todayCompletion.score}/${todayCompletion.total}` : "Open"}</strong><span>Today's 10 questions</span></div>
      <div class="stat"><strong>${progress.daily.streak}</strong><span>Daily streak</span></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Attempts</th>
            <th>Accuracy</th>
            <th>Wrong/review</th>
          </tr>
        </thead>
        <tbody>${categoryRows}</tbody>
      </table>
    </div>
    <h3>Recent Answers</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Student Answer</th>
            <th>Status</th>
            <th>Saved</th>
          </tr>
        </thead>
        <tbody>${recentAttempts || `<tr><td colspan="4">No answers yet.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderCalendarView(dateKey = selectedCalendarDate, message = "") {
  stopTimers();
  destroyCharts();

  selectedCalendarDate = dateKey || todayKey();
  calendarMonth = parseDateKey(selectedCalendarDate);

  const data = getAssignmentData();
  const isTeacher = currentUser.role === "teacher";
  const resources = data.assignments
    .filter((assignment) => assignment.date === selectedCalendarDate)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const notes = resources.filter((assignment) => assignment.type === "note");
  const homework = resources.filter((assignment) => assignment.type === "homework");
  const lessons = getLessonsForDate(data, selectedCalendarDate, currentUser.username, isTeacher);

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">${isTeacher ? "Teacher calendar" : "Student calendar"}</span>
          <h1>Calendar</h1>
          <p>${isTeacher ? "Upload notes, assign homework, review student submissions, and record class time." : "Download notes/homework, see class time, and upload homework by date."}</p>
        </div>
        <div class="button-row">
          ${isTeacher ? `<button class="secondary-button" type="button" data-action="teacher">Teacher Dashboard</button>` : ""}
          <button class="ghost-button" type="button" data-action="home">Home</button>
        </div>
      </div>
      <div class="calendar-layout">
        <section class="panel calendar-panel">
          <div class="calendar-toolbar">
            <button class="ghost-button" type="button" data-action="calendar-prev">Prev</button>
            <h2>${monthTitle(calendarMonth)}</h2>
            <button class="ghost-button" type="button" data-action="calendar-next">Next</button>
          </div>
          <div class="calendar-grid" aria-label="Assignment calendar">
            ${calendarWeekdays().map((day) => `<span class="calendar-weekday">${day}</span>`).join("")}
            ${calendarCells(calendarMonth, data).join("")}
          </div>
        </section>
        <section class="panel date-panel">
          <div class="section-head compact-head">
            <div>
              <h2>${formatDateForDisplay(selectedCalendarDate)}</h2>
              <p>${notes.length} notes · ${homework.length} homework · ${lessons.length} class time</p>
            </div>
          </div>
          ${message ? `<div class="message ${calendarMessageClass(message)}">${escapeHtml(message)}</div>` : ""}
          ${isTeacher ? teacherCalendarTools(resources, lessons, data) : studentCalendarTools(resources, lessons, data)}
        </section>
      </div>
    </section>
  `;
}

function teacherCalendarTools(resources, lessons, data) {
  const notes = resources.filter((assignment) => assignment.type === "note");
  const homework = resources.filter((assignment) => assignment.type === "homework");

  return `
    <div class="resource-columns teacher-action-grid">
      <section class="resource-section">
        <h3>Upload Notes</h3>
        ${resourceUploadForm("note")}
      </section>
      <section class="resource-section">
        <h3>Upload Homework</h3>
        ${resourceUploadForm("homework")}
      </section>
      <section class="resource-section">
        <h3>Add Class Time</h3>
        ${lessonRecordForm()}
      </section>
    </div>
    <div class="resource-columns">
      <section class="resource-strip">
        <h3>Notes for This Date</h3>
        <div class="assignment-stack">${notes.length ? notes.map(teacherNoteCard).join("") : `<div class="empty">No notes uploaded.</div>`}</div>
      </section>
      <section class="resource-strip">
        <h3>Homework for This Date</h3>
        <div class="assignment-stack">${homework.length ? homework.map((assignment) => teacherHomeworkCard(assignment, data)).join("") : `<div class="empty">No homework uploaded.</div>`}</div>
      </section>
    </div>
    <section class="resource-strip">
      <h3>Class Time</h3>
      <div class="assignment-stack">${lessons.length ? lessons.map(teacherLessonCard).join("") : `<div class="empty">No class time recorded.</div>`}</div>
    </section>
    <section class="resource-strip">
      <h3>My Uploaded Resources</h3>
      ${teacherCoursewareList(data)}
    </section>
  `;
}

function studentCalendarTools(resources, lessons, data) {
  const notes = resources.filter((assignment) => assignment.type === "note");
  const homework = resources.filter((assignment) => assignment.type === "homework");

  return `
    <section class="resource-strip student-category">
      <h3>Download Notes</h3>
      ${notes.length ? notes.map(studentResourceCard).join("") : `<div class="empty">No notes for this date.</div>`}
    </section>
    <section class="resource-strip student-category">
      <h3>Download Homework</h3>
      ${homework.length ? homework.map(studentResourceCard).join("") : `<div class="empty">No homework files for this date.</div>`}
    </section>
    <section class="resource-strip student-category">
      <h3>Class Time</h3>
      ${lessons.length ? lessons.map(studentLessonCard).join("") : `<div class="empty">No class time recorded for this date.</div>`}
    </section>
    <section class="resource-strip student-category">
      <h3>Upload Homework</h3>
      ${homework.length ? homework.map((assignment) => studentAssignmentCard(assignment, data)).join("") : `<div class="empty">No homework to submit.</div>`}
    </section>
  `;
}

function resourceUploadForm(kind) {
  const isNote = kind === "note";
  return `
    <form class="form assignment-form" data-form="assignment">
      <input type="hidden" name="assignmentDate" value="${selectedCalendarDate}">
      <input type="hidden" name="assignmentKind" value="${kind}">
      <div class="field">
        <label>${isNote ? "Note title" : "Homework title"}</label>
        <input name="assignmentTitle" required>
      </div>
      <div class="field">
        <label>${isNote ? "Note description" : "Homework instructions"}</label>
        <input name="assignmentInstructions" required>
      </div>
      <div class="field">
        <label>${isNote ? "Upload note files" : "Upload homework files"}</label>
        <input name="assignmentFiles" type="file" multiple>
      </div>
      <button class="${isNote ? "secondary-button" : "primary-button"}" type="submit">${isNote ? "Upload Notes" : "Upload Homework"}</button>
    </form>
  `;
}

function lessonRecordForm() {
  const studentOptions = getUsers()
    .filter((user) => user.role !== "teacher")
    .map((student) => `<option value="${escapeHtml(student.username)}">${escapeHtml(student.username)}</option>`)
    .join("");

  return `
    <form class="form lesson-form" data-form="lesson">
      <input type="hidden" name="lessonDate" value="${selectedCalendarDate}">
      <div class="field">
        <label>Class topic</label>
        <input name="lessonTitle" required>
      </div>
      <div class="field">
        <label>Visible to</label>
        <select name="lessonStudent">
          <option value="all">All students</option>
          ${studentOptions}
        </select>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Start time</label>
          <input name="lessonStart" type="time" required>
        </div>
        <div class="field">
          <label>Duration (hours)</label>
          <input name="lessonDuration" type="number" min="0.25" step="0.25" value="1" required>
        </div>
      </div>
      <div class="field">
        <label>Teacher note</label>
        <input name="lessonNotes">
      </div>
      <button class="primary-button" type="submit">Save Class Time</button>
    </form>
  `;
}

function teacherNoteCard(note) {
  return `
    <article class="assignment-card">
      <div class="assignment-head">
        <div>
          <span class="pill">Note</span>
          <h3>${escapeHtml(note.title)}</h3>
          <p>${escapeHtml(note.instructions)}</p>
        </div>
        <button class="danger-button" type="button" data-action="delete-assignment" data-assignment-id="${note.id}">Delete</button>
      </div>
      ${renderFileList(note.files)}
    </article>
  `;
}

function teacherHomeworkCard(assignment, data) {
  const students = getUsers().filter((user) => user.role !== "teacher");
  return `
    <article class="assignment-card">
      <div class="assignment-head">
        <div>
          <span class="pill">Homework</span>
          <h3>${escapeHtml(assignment.title)}</h3>
          <p>${escapeHtml(assignment.instructions)}</p>
        </div>
        <button class="danger-button" type="button" data-action="delete-assignment" data-assignment-id="${assignment.id}">Delete</button>
      </div>
      ${renderFileList(assignment.files)}
      <div class="submission-list">
        <h4>Student Review</h4>
        ${students.length ? students.map((student) => teacherStudentReviewCard(assignment, student.username, data)).join("") : `<div class="empty">No student accounts yet.</div>`}
      </div>
    </article>
  `;
}

function teacherStudentReviewCard(assignment, student, data) {
  const submission = getStudentSubmission(data, assignment.id, student);
  const review = getStudentReview(data, assignment.id, student);
  const status = review?.status || (submission ? "Submitted" : "Not submitted");
  return `
    <article class="submission-card">
      <div class="submission-head">
        <div>
          <strong>${escapeHtml(student)}</strong>
          <span>${submission ? `Submitted ${formatDateTime(submission.submittedAt)}` : "No submission yet"}</span>
        </div>
        <span class="pill status-pill ${statusClass(status)}">${escapeHtml(status)}</span>
      </div>
      ${submission?.note ? `<p>${escapeHtml(submission.note)}</p>` : ""}
      ${submission ? renderFileList(submission.files) : `<div class="file-list empty">No submitted files.</div>`}
      <form class="form feedback-form" data-form="review">
        <input type="hidden" name="assignmentId" value="${assignment.id}">
        <input type="hidden" name="student" value="${escapeHtml(student)}">
        <div class="field">
          <label>Submission status</label>
          <select name="status">${HOMEWORK_STATUSES.map((item) => `<option value="${item}" ${item === status ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label>Private 1:1 comment</label>
          <input name="comment" value="${escapeHtml(review?.comment || "")}" placeholder="Only teacher and this student should see it">
        </div>
        <button class="secondary-button" type="submit">Save Status and Comment</button>
      </form>
    </article>
  `;
}

function studentResourceCard(assignment) {
  return `
    <article class="assignment-card">
      <div class="assignment-head">
        <div>
          <span class="pill">${assignment.type === "note" ? "Note" : "Homework"}</span>
          <h3>${escapeHtml(assignment.title)}</h3>
          <p>${escapeHtml(assignment.instructions)}</p>
        </div>
      </div>
      ${renderFileList(assignment.files)}
    </article>
  `;
}

function studentAssignmentCard(assignment, data) {
  const submission = getStudentSubmission(data, assignment.id, currentUser.username);
  const review = getStudentReview(data, assignment.id, currentUser.username);
  const status = review?.status || (submission ? "Submitted" : "Not submitted");
  return `
    <article class="assignment-card">
      <div class="assignment-head">
        <div>
          <span class="pill status-pill ${statusClass(status)}">${escapeHtml(status)}</span>
          <h3>${escapeHtml(assignment.title)}</h3>
          <p>${escapeHtml(assignment.instructions)}</p>
        </div>
      </div>
      ${submission ? `<div class="submission-card"><strong>Your submission</strong><span>${formatDateTime(submission.submittedAt)}</span>${renderFileList(submission.files)}</div>` : ""}
      ${review?.comment ? `<div class="feedback show correct"><strong>Private teacher comment</strong>${escapeHtml(review.comment)}</div>` : `<div class="feedback show">No private teacher comment yet.</div>`}
      <form class="form submission-form" data-form="submission">
        <input type="hidden" name="assignmentId" value="${assignment.id}">
        <div class="field">
          <label>Submission note</label>
          <input name="submissionNote" value="${submission ? escapeHtml(submission.note || "") : ""}">
        </div>
        <div class="field">
          <label>Upload homework files</label>
          <input name="submissionFiles" type="file" multiple>
        </div>
        <button class="primary-button" type="submit">${submission ? "Resubmit Homework" : "Submit Homework"}</button>
      </form>
    </article>
  `;
}

function teacherLessonCard(lesson) {
  return `
    <article class="assignment-card lesson-card">
      <div class="assignment-head">
        <div>
          <span class="pill lesson-pill">Class Time</span>
          <h3>${escapeHtml(lesson.title)}</h3>
          ${lesson.notes ? `<p>${escapeHtml(lesson.notes)}</p>` : ""}
        </div>
        <button class="danger-button" type="button" data-action="delete-lesson" data-lesson-id="${lesson.id}">Delete</button>
      </div>
      ${lessonMeta(lesson, true)}
    </article>
  `;
}

function studentLessonCard(lesson) {
  return `
    <article class="assignment-card lesson-card">
      <div class="assignment-head">
        <div>
          <span class="pill lesson-pill">Class Time</span>
          <h3>${escapeHtml(lesson.title)}</h3>
          ${lesson.notes ? `<p>${escapeHtml(lesson.notes)}</p>` : ""}
        </div>
      </div>
      ${lessonMeta(lesson, false)}
    </article>
  `;
}

function lessonMeta(lesson, showStudent) {
  return `
    <div class="lesson-meta">
      <span><strong>Date</strong>${formatDateForDisplay(lesson.date)}</span>
      <span><strong>Start</strong>${escapeHtml(formatClockTime(lesson.startTime))}</span>
      <span><strong>Duration</strong>${formatLessonHours(lesson.durationHours)}</span>
      ${showStudent ? `<span><strong>Visible to</strong>${escapeHtml(lesson.student === "all" ? "All students" : lesson.student)}</span>` : ""}
    </div>
  `;
}

function getAssignmentData() {
  const data = safeJson(localStorage.getItem(ASSIGNMENTS_KEY), null);
  return {
    assignments: Array.isArray(data?.assignments) ? data.assignments : [],
    submissions: Array.isArray(data?.submissions) ? data.submissions : [],
    reviews: Array.isArray(data?.reviews) ? data.reviews : [],
    lessons: Array.isArray(data?.lessons) ? data.lessons : []
  };
}

function saveAssignmentData(data) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify({
    assignments: data.assignments || [],
    submissions: data.submissions || [],
    reviews: data.reviews || [],
    lessons: data.lessons || []
  }));
}

async function saveAssignment(form) {
  if (currentUser.role !== "teacher") return;

  const date = form.elements.assignmentDate.value;
  const kind = form.elements.assignmentKind.value === "note" ? "note" : "homework";
  const title = form.elements.assignmentTitle.value.trim();
  const instructions = form.elements.assignmentInstructions.value.trim();
  const files = Array.from(form.elements.assignmentFiles.files || []);

  if (!date || !title || !instructions) {
    renderCalendarView(date || selectedCalendarDate, "Please add a title and instructions.");
    return;
  }

  try {
    const assignmentId = createId("assignment");
    const fileRecords = await storeFiles(files, { kind, owner: currentUser.username, assignmentId });
    const data = getAssignmentData();
    const now = new Date().toISOString();
    data.assignments.push({
      id: assignmentId,
      type: kind,
      date,
      title,
      instructions,
      teacher: currentUser.username,
      files: fileRecords,
      createdAt: now,
      updatedAt: now
    });
    saveAssignmentData(data);
    renderCalendarView(date, `${kind === "note" ? "Notes" : "Homework"} uploaded.`);
  } catch (error) {
    renderCalendarView(date, `Upload failed: ${error.message}`);
  }
}

async function saveSubmission(form) {
  if (currentUser.role !== "student") return;

  const assignmentId = form.elements.assignmentId.value;
  const note = form.elements.submissionNote.value.trim();
  const files = Array.from(form.elements.submissionFiles.files || []);
  const data = getAssignmentData();
  const assignment = data.assignments.find((item) => item.id === assignmentId);
  const existing = data.submissions.find((item) => item.assignmentId === assignmentId && item.student === currentUser.username);

  if (!assignment) {
    renderCalendarView(selectedCalendarDate, "This homework no longer exists.");
    return;
  }

  if (!files.length && !note && !existing) {
    renderCalendarView(assignment.date, "Add a file or note before submitting.");
    return;
  }

  try {
    const fileRecords = files.length
      ? await storeFiles(files, { kind: "submission", owner: currentUser.username, assignmentId })
      : existing?.files || [];
    const now = new Date().toISOString();

    if (existing) {
      existing.note = note;
      existing.files = fileRecords;
      existing.submittedAt = now;
    } else {
      data.submissions.push({
        id: createId("submission"),
        assignmentId,
        student: currentUser.username,
        note,
        files: fileRecords,
        submittedAt: now
      });
    }

    saveAssignmentData(data);
    renderCalendarView(assignment.date, "Homework submitted.");
  } catch (error) {
    renderCalendarView(assignment.date, `Submission failed: ${error.message}`);
  }
}

function saveReview(form) {
  if (currentUser.role !== "teacher") return;

  const assignmentId = form.elements.assignmentId.value;
  const student = form.elements.student.value;
  const status = form.elements.status.value;
  const comment = form.elements.comment.value.trim();
  const data = getAssignmentData();
  const assignment = data.assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    renderCalendarView(selectedCalendarDate, "Homework not found.");
    return;
  }

  data.reviews = data.reviews || [];
  const existing = data.reviews.find((item) => item.assignmentId === assignmentId && item.student === student);
  const now = new Date().toISOString();

  if (existing) {
    existing.status = status;
    existing.comment = comment;
    existing.updatedAt = now;
  } else {
    data.reviews.push({
      id: createId("review"),
      assignmentId,
      student,
      status,
      comment,
      updatedAt: now,
      updatedBy: currentUser.username
    });
  }

  saveAssignmentData(data);
  renderCalendarView(assignment.date, "Private status and comment saved.");
}

function saveLesson(form) {
  if (currentUser.role !== "teacher") return;

  const date = form.elements.lessonDate.value;
  const title = form.elements.lessonTitle.value.trim();
  const student = form.elements.lessonStudent.value || "all";
  const startTime = form.elements.lessonStart.value;
  const durationHours = Number(form.elements.lessonDuration.value);
  const notes = form.elements.lessonNotes.value.trim();

  if (!date || !title || !startTime || !Number.isFinite(durationHours) || durationHours <= 0) {
    renderCalendarView(date || selectedCalendarDate, "Please add a class topic, start time, and valid duration.");
    return;
  }

  const data = getAssignmentData();
  const now = new Date().toISOString();
  data.lessons.push({
    id: createId("lesson"),
    date,
    title,
    student,
    startTime,
    durationHours,
    notes,
    teacher: currentUser.username,
    createdAt: now,
    updatedAt: now
  });
  saveAssignmentData(data);
  renderCalendarView(date, "Class time saved.");
}

function deleteAssignment(assignmentId) {
  if (currentUser.role !== "teacher") return;
  if (!window.confirm("Delete this resource and its submission records?")) return;

  const data = getAssignmentData();
  const assignment = data.assignments.find((item) => item.id === assignmentId);
  if (!assignment) return;

  data.assignments = data.assignments.filter((item) => item.id !== assignmentId);
  data.submissions = data.submissions.filter((item) => item.assignmentId !== assignmentId);
  data.reviews = data.reviews.filter((item) => item.assignmentId !== assignmentId);
  saveAssignmentData(data);
  renderCalendarView(assignment.date, "Resource deleted.");
}

function deleteLesson(lessonId) {
  if (currentUser.role !== "teacher") return;
  if (!window.confirm("Delete this class time record?")) return;

  const data = getAssignmentData();
  const lesson = data.lessons.find((item) => item.id === lessonId);
  if (!lesson) return;

  data.lessons = data.lessons.filter((item) => item.id !== lessonId);
  saveAssignmentData(data);
  renderCalendarView(lesson.date, "Class time deleted.");
}

async function storeFiles(files, context) {
  const records = [];

  for (const file of files) {
    const record = {
      id: createId("file"),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      uploadedBy: context.owner,
      uploadedAt: new Date().toISOString(),
      kind: context.kind,
      assignmentId: context.assignmentId,
      blob: file
    };
    await putFileRecord(record);
    records.push({
      id: record.id,
      name: record.name,
      type: record.type,
      size: record.size,
      uploadedBy: record.uploadedBy,
      uploadedAt: record.uploadedAt,
      kind: record.kind
    });
  }

  return records;
}

function openFileDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(FILE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FILE_STORE_NAME)) {
        db.createObjectStore(FILE_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putFileRecord(record) {
  const db = await openFileDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_STORE_NAME, "readwrite");
    transaction.objectStore(FILE_STORE_NAME).put(record);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function getFileRecord(fileId) {
  const db = await openFileDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_STORE_NAME, "readonly");
    const request = transaction.objectStore(FILE_STORE_NAME).get(fileId);
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function downloadStoredFile(fileId) {
  try {
    const record = await getFileRecord(fileId);
    if (!record) {
      window.alert("File not found in this browser.");
      return;
    }
    const url = URL.createObjectURL(record.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = record.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    window.alert(`Could not open file: ${error.message}`);
  }
}

function teacherCoursewareList(data) {
  const files = data.assignments
    .filter((assignment) => assignment.teacher === currentUser.username)
    .flatMap((assignment) => (assignment.files || []).map((file) => ({
      ...file,
      title: assignment.title,
      date: assignment.date,
      resourceType: assignment.type
    })))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  if (!files.length) return `<div class="empty">No uploaded resources yet.</div>`;

  return `
    <div class="file-list">
      ${files.map((file) => `
        <div class="file-row">
          <div>
            <strong>${escapeHtml(file.name)}</strong>
            <span>${file.resourceType === "note" ? "Notes" : "Homework"} · ${escapeHtml(file.title)} · ${formatDateForDisplay(file.date)} · ${formatFileSize(file.size)}</span>
          </div>
          <button class="ghost-button" type="button" data-action="download-file" data-file-id="${file.id}">Download</button>
        </div>
      `).join("")}
    </div>
  `;
}

function renderFileList(files = []) {
  if (!files.length) return `<div class="file-list empty">No files attached.</div>`;

  return `
    <div class="file-list">
      ${files.map((file) => `
        <div class="file-row">
          <div>
            <strong>${escapeHtml(file.name)}</strong>
            <span>${formatFileSize(file.size)} · ${escapeHtml(file.type || "file")}</span>
          </div>
          <button class="ghost-button" type="button" data-action="download-file" data-file-id="${file.id}">Download</button>
        </div>
      `).join("")}
    </div>
  `;
}

function calendarCells(monthDate, data) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(`<span class="calendar-cell calendar-empty"></span>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = toDateKey(new Date(year, month, day));
    const assignments = data.assignments.filter((assignment) => assignment.date === dateKey);
    const notes = assignments.filter((assignment) => assignment.type === "note");
    const homework = assignments.filter((assignment) => assignment.type === "homework");
    const lessons = getLessonsForDate(data, dateKey, currentUser.username, currentUser.role === "teacher");
    const submissions = data.submissions.filter((submission) => {
      const assignment = data.assignments.find((item) => item.id === submission.assignmentId);
      return assignment?.date === dateKey;
    });
    const selected = selectedCalendarDate === dateKey ? "selected" : "";
    const today = todayKey() === dateKey ? "today" : "";
    const noteBadge = notes.length ? `<span class="calendar-tag note-tag">${notes.length}N</span>` : "";
    const homeworkBadge = homework.length ? `<span class="calendar-tag homework-tag">${homework.length}H</span>` : "";
    const lessonBadge = lessons.length ? `<span class="calendar-tag lesson-tag">${lessons.length}L</span>` : "";

    cells.push(`
      <button class="calendar-cell ${selected} ${today}" type="button" data-action="select-date" data-date="${dateKey}">
        <strong>${day}</strong>
        <span class="calendar-badges">${noteBadge}${homeworkBadge}${lessonBadge}</span>
        ${submissions.length ? `<small>${submissions.length} submitted</small>` : ""}
      </button>
    `);
  }

  return cells;
}

function getStudentSubmission(data, assignmentId, student) {
  return data.submissions.find((item) => item.assignmentId === assignmentId && item.student === student);
}

function getStudentReview(data, assignmentId, student) {
  return data.reviews.find((item) => item.assignmentId === assignmentId && item.student === student);
}

function getLessonsForDate(data, dateKey, username, isTeacher = false) {
  return data.lessons
    .filter((lesson) => lesson.date === dateKey && (isTeacher || lesson.student === "all" || lesson.student === username))
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
}

function statusClass(status) {
  return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function calendarMessageClass(message) {
  return /uploaded|submitted|saved|deleted/i.test(message) ? "ok" : "";
}

function calendarWeekdays() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function monthTitle(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatDateForDisplay(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatClockTime(value) {
  if (!value) return "Time not set";
  const match = String(value).match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  return new Date(2000, 0, 1, Number(match[1]), Number(match[2])).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatLessonHours(hours) {
  const rounded = Math.round((Number(hours) || 0) * 100) / 100;
  return `${rounded.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${rounded === 1 ? "hr" : "hrs"}`;
}

function formatFileSize(size) {
  if (!Number.isFinite(size)) return "Unknown size";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function renderCharts(progress) {
  const note = document.querySelector("#chartNote");
  if (!window.Chart) {
    if (note) note.textContent = "Chart.js is not available. Open this file with internet access to load interactive charts.";
    return;
  }

  const categoryStats = DATA.categories.map((category) => {
    const attempts = progress.attempts.filter((attempt) => attempt.category === category.id);
    const accuracy = attempts.length
      ? Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100)
      : 0;
    return { label: category.title, accuracy };
  });

  const history = lastSevenDays().map((date) => ({
    date,
    count: progress.attempts.filter((attempt) => attempt.date.startsWith(date)).length
  }));

  chartInstances.push(new Chart(document.querySelector("#categoryChart"), {
    type: "bar",
    data: {
      labels: categoryStats.map((item) => item.label),
      datasets: [{
        label: "Accuracy %",
        data: categoryStats.map((item) => item.accuracy),
        borderRadius: 8,
        backgroundColor: "#2563eb"
      }]
    },
    options: chartOptions()
  }));

  chartInstances.push(new Chart(document.querySelector("#historyChart"), {
    type: "line",
    data: {
      labels: history.map((item) => item.date.slice(5)),
      datasets: [{
        label: "Questions",
        data: history.map((item) => item.count),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.14)",
        tension: 0.35,
        fill: true
      }]
    },
    options: chartOptions()
  }));
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };
}

function saveAttempt(question, attemptData) {
  const progress = getProgress();
  const attempt = {
    id: createId("attempt"),
    questionId: question.id,
    category: question.category,
    date: new Date().toISOString(),
    ...attemptData
  };

  progress.attempts.push(attempt);

  if (!attempt.correct) {
    const existing = progress.mistakes[question.id];
    progress.mistakes[question.id] = {
      questionId: question.id,
      lastAnswer: attempt.answer,
      savedAt: attempt.date,
      count: existing ? existing.count + 1 : 1
    };
  } else if (progress.mistakes[question.id]) {
    delete progress.mistakes[question.id];
  }

  saveProgress(progress);
  return attempt;
}

function recordDailyCompletion(progress, date, score, total) {
  const completedBefore = Boolean(progress.daily.completions[date]);
  progress.daily.completions[date] = { score, total, completedAt: new Date().toISOString() };

  if (!completedBefore) {
    const yesterday = offsetDateKey(-1);
    progress.daily.streak = progress.daily.lastCompletedDate === yesterday
      ? progress.daily.streak + 1
      : 1;
    progress.daily.lastCompletedDate = date;
  }
}

function login(form) {
  const username = form.username.value.trim();
  const password = form.password.value;
  const user = getUsers().find((item) => item.username === username);

  if (!user || user.password !== password) {
    renderAuth("Username or password is incorrect.");
    return;
  }

  currentUser = { username: user.username, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  updateAuthButtons();
  renderHome();
}

function register(form) {
  const username = form.username.value.trim();
  const password = form.password.value;

  if (username.length < 2 || password.length < 4) {
    renderAuth("Use at least 2 characters for username and 4 for password.");
    return;
  }

  if (username === TEACHER_USERNAME) {
    renderAuth(`${TEACHER_USERNAME} is reserved for the teacher account.`);
    return;
  }

  const users = getUsers();
  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    renderAuth("That username already exists.");
    return;
  }

  users.push({
    username,
    password,
    role: "student",
    createdAt: new Date().toISOString()
  });
  saveUsers(users);

  currentUser = { username, role: "student" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  updateAuthButtons();
  saveProgress(getProgress(username), username);
  renderHome();
}

function seedTeacherAccount() {
  const users = getUsers(false);
  const teacher = users.find((user) => user.username === TEACHER_USERNAME);

  if (!teacher) {
    users.push({
      username: TEACHER_USERNAME,
      password: TEACHER_PASSWORD,
      role: "teacher",
      createdAt: new Date().toISOString()
    });
  } else {
    teacher.password = TEACHER_PASSWORD;
    teacher.role = "teacher";
  }

  saveUsers(users);
}

function getUsers(seed = true) {
  const users = safeJson(localStorage.getItem(USERS_KEY), []);
  if (seed && !users.some((user) => user.username === TEACHER_USERNAME)) {
    users.push({
      username: TEACHER_USERNAME,
      password: TEACHER_PASSWORD,
      role: "teacher",
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }
  return users;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const saved = safeJson(localStorage.getItem(SESSION_KEY), null);
  if (!saved) return null;

  const user = getUsers().find((item) => item.username === saved.username);
  if (!user) return null;
  return { username: user.username, role: user.role };
}

function updateAuthButtons() {
  if (logoutButton) logoutButton.classList.toggle("hidden", !currentUser);
}

function emptyProgress() {
  return {
    attempts: [],
    sessions: [],
    mistakes: {},
    daily: { streak: 0, lastCompletedDate: "", completions: {} },
    speed: { bestScore: 0, bestAccuracy: 0, bestAverageSeconds: 0, runs: [] }
  };
}

function normalizeProgress(saved = {}) {
  const fallback = emptyProgress();
  return {
    ...fallback,
    ...saved,
    attempts: Array.isArray(saved.attempts) ? saved.attempts : [],
    sessions: Array.isArray(saved.sessions) ? saved.sessions : [],
    mistakes: saved.mistakes || {},
    daily: { ...fallback.daily, ...(saved.daily || {}) },
    speed: { ...fallback.speed, ...(saved.speed || {}) }
  };
}

function getProgress(username = currentUser?.username || "Guest") {
  const allProgress = safeJson(localStorage.getItem(PROGRESS_BY_USER_KEY), {});
  const legacy = safeJson(localStorage.getItem(LEGACY_PROGRESS_KEY), null);

  if (!allProgress[username] && legacy && username !== TEACHER_USERNAME) {
    allProgress[username] = normalizeProgress(legacy);
    localStorage.setItem(PROGRESS_BY_USER_KEY, JSON.stringify(allProgress));
    localStorage.removeItem(LEGACY_PROGRESS_KEY);
  }

  return normalizeProgress(allProgress[username]);
}

function saveProgress(progress, username = currentUser?.username || "Guest") {
  const allProgress = safeJson(localStorage.getItem(PROGRESS_BY_USER_KEY), {});
  allProgress[username] = normalizeProgress(progress);
  localStorage.setItem(PROGRESS_BY_USER_KEY, JSON.stringify(allProgress));
}

function clearProgress() {
  if (!window.confirm("Clear all locally saved progress?")) return;
  const allProgress = safeJson(localStorage.getItem(PROGRESS_BY_USER_KEY), {});
  delete allProgress[currentUser.username];
  localStorage.setItem(PROGRESS_BY_USER_KEY, JSON.stringify(allProgress));
  renderProgressDashboard();
}

function getOverallStats(progress = getProgress()) {
  const completed = progress.attempts.length;
  const correct = progress.attempts.filter((attempt) => attempt.correct).length;
  const accuracy = completed ? Math.round((correct / completed) * 100) : 0;
  const averageTime = averageSeconds(progress.attempts.map((attempt) => attempt.elapsed));
  const categoryBreakdown = DATA.categories.map((category) => {
    const attempts = progress.attempts.filter((attempt) => attempt.category === category.id);
    const categoryAccuracy = attempts.length
      ? Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100)
      : 0;
    return { title: category.title, attempts: attempts.length, accuracy: categoryAccuracy };
  }).filter((item) => item.attempts > 0);

  const strongest = [...categoryBreakdown].sort((a, b) => b.accuracy - a.accuracy)[0]?.title || "";
  const weakest = [...categoryBreakdown].sort((a, b) => a.accuracy - b.accuracy)[0]?.title || "";

  return { completed, correct, accuracy, averageTime, strongest, weakest };
}

function uniqueAnsweredCount(progress) {
  return new Set(progress.attempts.map((attempt) => attempt.questionId)).size;
}

function exportTeacherReport() {
  if (currentUser.role !== "teacher") {
    showToast("Only the teacher account can export reports.");
    return;
  }

  const students = getUsers().filter((user) => user.role !== "teacher");
  const lines = [
    ["Student", "Answers", "Accuracy", "Daily Streak", "Weakest Category"].join(",")
  ];

  students.forEach((student) => {
    const progress = getProgress(student.username);
    const stats = getOverallStats(progress);
    lines.push([
      student.username,
      stats.completed,
      `${stats.accuracy}%`,
      progress.daily.streak,
      stats.weakest || "No data"
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `number-sense-report-${todayKey()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function categoryCompletion(categoryId, progress) {
  const questionIds = getQuestionsByCategory(categoryId).map((question) => question.id);
  const latestCorrect = new Set(progress.attempts
    .filter((attempt) => questionIds.includes(attempt.questionId) && attempt.correct)
    .map((attempt) => attempt.questionId));
  const attempts = progress.attempts.filter((attempt) => questionIds.includes(attempt.questionId));
  const accuracy = attempts.length
    ? Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100)
    : 0;
  return {
    completed: latestCorrect.size,
    percent: latestCorrect.size * 10,
    accuracy
  };
}

function getAchievementDefinitions(progress = getProgress()) {
  const stats = getOverallStats(progress);
  const categoryMastery = (categoryId) => categoryCompletion(categoryId, progress).completed >= 10;
  const perfectScore = progress.sessions.some((session) => session.score === session.total && session.total > 0);
  const fastRun = progress.speed.runs.some((run) => run.averageSeconds > 0 && run.averageSeconds <= 5 && run.score >= 8);

  return [
    { code: "MM", title: "Mental Math Master", description: "Complete all Mental Math questions correctly.", unlocked: categoryMastery("mental-math") },
    { code: "PF", title: "Pattern Finder", description: "Complete all Patterns questions correctly.", unlocked: categoryMastery("patterns") },
    { code: "EE", title: "Estimation Expert", description: "Complete all Estimation questions correctly.", unlocked: categoryMastery("estimation") },
    { code: "LG", title: "Logic Genius", description: "Complete all Logical Reasoning questions correctly.", unlocked: categoryMastery("logical-reasoning") },
    { code: "100", title: "100 Questions Completed", description: "Answer 100 total questions across all modes.", unlocked: stats.completed >= 100 },
    { code: "10", title: "Perfect Score", description: "Finish any session with every question correct.", unlocked: perfectScore },
    { code: "FT", title: "Fast Thinker", description: "Score at least 8 in Speed Challenge with 5s average or faster.", unlocked: fastRun }
  ];
}

function getUnlockedAchievements(progress) {
  return getAchievementDefinitions(progress).filter((badge) => badge.unlocked);
}

function mockTeacherRows(progress, stats) {
  const weak = stats.weakest || "No data yet";
  return [
    { name: "Current Learner", accuracy: stats.accuracy, completion: Math.min(100, Math.round((stats.completed / 80) * 100)), weakCategories: weak },
    { name: "Avery Chen", accuracy: 82, completion: 76, weakCategories: "Estimation, Challenge Problems" },
    { name: "Maya Singh", accuracy: 91, completion: 88, weakCategories: "Logical Reasoning" },
    { name: "Leo Martinez", accuracy: 68, completion: 54, weakCategories: "Fractions, Patterns" }
  ];
}

function dailyQuestions(dateKey) {
  const seed = hashString(dateKey);
  const daily = [];

  DATA.categories.forEach((category, index) => {
    const pool = getQuestionsByCategory(category.id);
    daily.push(pool[(seed + index * 7) % pool.length]);
  });

  const extraCategories = seededShuffle([...DATA.categories], seed + 17).slice(0, DAILY_COUNT - daily.length);
  extraCategories.forEach((category, index) => {
    const pool = getQuestionsByCategory(category.id).filter((question) => !daily.some((item) => item.id === question.id));
    daily.push(pool[(seed + index * 11) % pool.length]);
  });

  return seededShuffle(daily, seed + 31).slice(0, DAILY_COUNT);
}

function getQuestionsByCategory(categoryId) {
  return DATA.questions.filter((question) => question.category === categoryId);
}

function getQuestionById(questionId) {
  return DATA.questions.find((question) => question.id === questionId);
}

function currentQuestion() {
  return practiceSession.questions[practiceSession.index];
}

function categoryTitle(categoryId) {
  return DATA.categories.find((category) => category.id === categoryId)?.title || categoryId;
}

function answerMatches(input, answer) {
  return String(answer).split("|").some((accepted) => normalizedAnswer(input) === normalizedAnswer(accepted) || numberMatches(input, accepted));
}

function normalizedAnswer(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .replace(/\$/g, "");
}

function numberMatches(input, accepted) {
  const inputNumber = parseAnswerNumber(input);
  const acceptedNumber = parseAnswerNumber(accepted);
  if (inputNumber === null || acceptedNumber === null) return false;
  return Math.abs(inputNumber - acceptedNumber) < 0.000001;
}

function parseAnswerNumber(value) {
  let text = normalizedAnswer(value);
  if (!text) return null;
  if (text.endsWith("%")) text = text.slice(0, -1);

  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(text)) {
    const [top, bottom] = text.split("/").map(Number);
    return bottom === 0 ? null : top / bottom;
  }

  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return null;
}

function formatAnswer(answer) {
  return escapeHtml(String(answer).split("|")[0]);
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return minutes ? `${minutes}m ${String(remainder).padStart(2, "0")}s` : `${remainder}s`;
}

function averageSeconds(values) {
  const valid = values.map(Number).filter((value) => Number.isFinite(value) && value >= 0);
  if (!valid.length) return 0;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
}

function scoreMessage(accuracy) {
  if (accuracy === 100) return "Perfect score. Strong number sense strategy work.";
  if (accuracy >= 80) return "Strong session. Review the explanation language and keep speed steady.";
  if (accuracy >= 60) return "Good progress. Use the mistake book to strengthen weaker strategies.";
  return "Slow down and study the strategy explanations before trying again.";
}

function startPracticeTimer() {
  const timer = document.querySelector("#practiceTime");
  if (!timer) return;
  practiceTimerId = window.setInterval(() => {
    timer.textContent = formatDuration((Date.now() - practiceSession.startedAt) / 1000);
  }, 1000);
}

function stopPracticeTimer() {
  if (practiceTimerId) {
    window.clearInterval(practiceTimerId);
    practiceTimerId = null;
  }
}

function stopTimers() {
  stopPracticeTimer();
  if (speedTimerId) {
    window.clearInterval(speedTimerId);
    speedTimerId = null;
  }
}

function destroyCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
}

function toggleTheme() {
  const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
}

function burstConfetti() {
  const colors = ["#2563eb", "#38bdf8", "#16a34a", "#f59e0b", "#ef4444"];
  for (let index = 0; index < 80; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 240}px`);
    piece.style.animationDelay = `${Math.random() * 180}ms`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1200);
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function offsetDateKey(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function lastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => offsetDateKey(index - 6));
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function seededShuffle(items, seed) {
  const result = [...items];
  let value = seed || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swapIndex = Math.floor((value / 233280) * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function hashString(value) {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0) >>> 0;
}

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
