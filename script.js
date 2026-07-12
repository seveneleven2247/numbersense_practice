// Number Sense Academy application logic.
// The app is intentionally framework-free so it can run by opening index.html.

const DATA = window.NumberSenseAcademyData;
const STORAGE_KEY = "numberSenseAcademy.progress.v1";
const THEME_KEY = "numberSenseAcademy.theme.v1";
const DAILY_COUNT = 10;
const SPEED_SECONDS = 60;

const app = document.querySelector("#app");
const themeLabel = document.querySelector("[data-theme-label]");

let practiceSession = null;
let practiceTimerId = null;
let speedTimerId = null;
let chartInstances = [];

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);

initialize();

function initialize() {
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
  renderHome();
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "home") renderHome();
  if (action === "toggle-theme") toggleTheme();
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
  if (action === "ai") renderAiGenerator();
  if (action === "clear-progress") clearProgress();
  if (action === "export-report") showToast("Export report is a mock UI action in this static version.");
}

function handleSubmit(event) {
  event.preventDefault();

  if (event.target.dataset.form === "answer") {
    submitCurrentAnswer();
  }

  if (event.target.dataset.form === "speed") {
    submitSpeedAnswer();
  }
}

function renderHome() {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const stats = getOverallStats(progress);

  app.innerHTML = `
    <section class="hero-panel">
      <div>
        <span class="eyebrow">Interactive number sense practice</span>
        <h1>Number Sense Academy</h1>
        <p>Practice, games, progress tracking, mistake review, and achievement badges for Grades 6-9 learners.</p>
      </div>
      <div class="hero-stats" aria-label="Progress summary">
        <div class="stat"><strong>${stats.completed}</strong><span>Questions completed</span></div>
        <div class="stat"><strong>${stats.accuracy}%</strong><span>Accuracy</span></div>
        <div class="stat"><strong>${progress.daily.streak}</strong><span>Daily streak</span></div>
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
        ${DATA.modules.map((module) => moduleCard(module, progress)).join("")}
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
      <p>Daily questions are generated from today's date, so the set stays stable all day and refreshes tomorrow.</p>
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

function renderTeacherDashboard() {
  stopTimers();
  destroyCharts();

  const progress = getProgress();
  const stats = getOverallStats(progress);
  const mockRows = mockTeacherRows(progress, stats).map((student) => `
    <tr>
      <td>${escapeHtml(student.name)}</td>
      <td>${student.accuracy}%</td>
      <td>${student.completion}%</td>
      <td>${escapeHtml(student.weakCategories)}</td>
    </tr>
  `).join("");

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">Mock Teacher Dashboard</span>
          <h1>Class Overview</h1>
          <p>This static mock shows how teacher reporting can look without a backend database.</p>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="export-report">Export Report</button>
          <button class="ghost-button" type="button" data-action="home">Home</button>
        </div>
      </div>
      <div class="teacher-grid">
        <article class="panel">
          <h2>Summary</h2>
          <div class="stat-grid teacher-stats">
            <div class="stat"><strong>4</strong><span>Students</span></div>
            <div class="stat"><strong>${stats.accuracy}%</strong><span>Your accuracy</span></div>
            <div class="stat"><strong>${stats.completed}</strong><span>Your completed questions</span></div>
          </div>
        </article>
        <article class="panel">
          <h2>Student List</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Accuracy</th>
                  <th>Completion</th>
                  <th>Weak Categories</th>
                </tr>
              </thead>
              <tbody>${mockRows}</tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  `;
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

function getProgress() {
  const fallback = {
    attempts: [],
    sessions: [],
    mistakes: {},
    daily: { streak: 0, lastCompletedDate: "", completions: {} },
    speed: { bestScore: 0, bestAccuracy: 0, bestAverageSeconds: 0, runs: [] }
  };
  const saved = safeJson(localStorage.getItem(STORAGE_KEY), fallback);
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

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function clearProgress() {
  if (!window.confirm("Clear all locally saved progress?")) return;
  localStorage.removeItem(STORAGE_KEY);
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
  return seededShuffle([...DATA.questions], hashString(dateKey)).slice(0, DAILY_COUNT);
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
