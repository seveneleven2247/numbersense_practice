const TEACHER_USERNAME = "Elven Zeng";
const TEACHER_PASSWORD = "Elven2026!";
const USERS_KEY = "numberSensePractice.users.v1";
const DATA_KEY = "numberSensePractice.data.v1";
const ASSIGNMENTS_KEY = "numberSensePractice.assignments.v1";
const SESSION_KEY = "numberSensePractice.currentUser.v1";
const THEME_KEY = "numberSensePractice.theme.v1";
const FILE_DB_NAME = "numberSensePractice.files.v1";
const FILE_STORE_NAME = "files";
const HOMEWORK_STATUSES = [
  "Not submitted",
  "Submitted",
  "Late",
  "Needs revision",
  "Reviewed",
  "Complete",
  "Missing"
];

const categories = [
  {
    id: "mental-math",
    title: "Mental Math",
    subtitle: "Fast mental calculations.",
    questions: [
      {
        question: "48 + 27 = ?",
        answer: "75",
        explanation: "Make 48 friendly by adding 2 to reach 50, then add the remaining 25. Friendly landmarks reduce memory load."
      },
      {
        question: "96 - 38 = ?",
        answer: "58",
        explanation: "Think 96 - 40 = 56, then give back 2 because 38 is 2 less than 40."
      },
      {
        question: "25 x 16 = ?",
        answer: "400",
        explanation: "Break 16 into 4 x 4. Since 25 x 4 = 100, four groups of 100 make 400."
      },
      {
        question: "144 / 12 = ?",
        answer: "12",
        explanation: "Recognize 12 x 12 = 144. Known square facts make division faster."
      },
      {
        question: "19 + 38 + 21 = ?",
        answer: "78",
        explanation: "Pair 19 and 21 to make 40, then add 38. Pairing nearby numbers creates friendly totals."
      },
      {
        question: "15% of 80 = ?",
        answer: "12",
        explanation: "Find 10% of 80 as 8 and 5% as half of that, 4. Together they make 12."
      },
      {
        question: "7 x 13 + 7 x 7 = ?",
        answer: "140",
        explanation: "Factor out the 7: 7 x (13 + 7). The inside becomes 20, so the expression is 7 x 20."
      },
      {
        question: "0.25 x 64 = ?",
        answer: "16",
        explanation: "0.25 means one fourth. One fourth of 64 is found by halving twice: 64 to 32 to 16."
      },
      {
        question: "125 x 8 = ?",
        answer: "1000",
        explanation: "Use the benchmark fact that 125 is one eighth of 1000, so eight 125s make 1000."
      },
      {
        question: "360 / 15 = ?",
        answer: "24",
        explanation: "Divide both numbers by 5 to get 72 / 3. Scaling both parts of a division keeps the quotient the same."
      }
    ]
  },
  {
    id: "friendly-numbers",
    title: "Make Numbers Friendly",
    subtitle: "Compensation, decomposition, tens, and hundreds.",
    questions: [
      {
        question: "99 + 46 = ?",
        answer: "145",
        explanation: "Move 1 from 46 to 99. Then 100 + 45 is easier than 99 + 46."
      },
      {
        question: "203 - 98 = ?",
        answer: "105",
        explanation: "Subtract 100 first to get 103, then add back 2 because 98 is 2 less than 100."
      },
      {
        question: "49 x 6 = ?",
        answer: "294",
        explanation: "Use 50 x 6 = 300, then subtract one group of 6. Compensation keeps the multiplication simple."
      },
      {
        question: "5.8 + 3.7 + 4.2 = ?",
        answer: "13.7",
        explanation: "Pair 5.8 and 4.2 to make 10, then add 3.7. Look for decimal pairs that make whole numbers."
      },
      {
        question: "32 x 25 = ?",
        answer: "800",
        explanation: "Since 25 is one fourth of 100, split 32 into 8 x 4. Then 25 x 4 = 100 and 8 x 100 = 800."
      },
      {
        question: "398 + 217 = ?",
        answer: "615",
        explanation: "Add 2 to 398 to make 400 and take 2 from 217. Then 400 + 215 is quick."
      },
      {
        question: "1000 - 476 = ?",
        answer: "524",
        explanation: "Count up from 476 to 500, then to 1000. The jumps are 24 and 500, so the difference is 524."
      },
      {
        question: "19 x 21 = ?",
        answer: "399",
        explanation: "Think of the numbers as 20 - 1 and 20 + 1. The product is 20 squared minus 1 squared."
      },
      {
        question: "75 + 68 + 25 = ?",
        answer: "168",
        explanation: "Combine 75 and 25 to make 100, then add 68. Friendly pairs make three-number sums easier."
      },
      {
        question: "12.5 x 48 = ?",
        answer: "600",
        explanation: "12.5 is one eighth of 100. Since 48 / 8 = 6, the product is 6 x 100."
      }
    ]
  },
  {
    id: "estimation",
    title: "Estimation",
    subtitle: "Estimate answers without exact calculations.",
    questions: [
      {
        question: "Estimate 198 + 305.",
        answer: "500",
        explanation: "Round 198 to 200 and 305 to 300. Estimation uses nearby landmarks to judge size quickly."
      },
      {
        question: "Estimate 49 x 21.",
        answer: "1000",
        explanation: "Use 50 x 20. Rounding one factor up and the other down gives a close mental benchmark."
      },
      {
        question: "Estimate 602 / 29.",
        answer: "20",
        explanation: "Use 600 / 30. Compatible numbers make division estimates fast."
      },
      {
        question: "Estimate $18.75 x 4.",
        answer: "80",
        explanation: "Round $18.75 to about $20. Four groups of about 20 dollars is about 80 dollars."
      },
      {
        question: "Estimate 7.9 + 12.2 + 5.1.",
        answer: "25",
        explanation: "Round to 8 + 12 + 5. The rounded values are close and easy to add."
      },
      {
        question: "Estimate 391 - 198.",
        answer: "200",
        explanation: "Use 400 - 200. Both numbers are close to these landmarks, so the estimate is stable."
      },
      {
        question: "Estimate 3.14 x 9.8.",
        answer: "30",
        explanation: "Use 3 x 10. The rounded factors make a quick estimate near the true product."
      },
      {
        question: "Estimate 58% of 402.",
        answer: "240",
        explanation: "Use about 60% of 400. Ten percent is 40, so sixty percent is 6 x 40."
      },
      {
        question: "Estimate 1,980 / 51.",
        answer: "40",
        explanation: "Use 2000 / 50. Compatible numbers show the quotient is about 40."
      },
      {
        question: "Estimate 24.7 x 39.5.",
        answer: "1000",
        explanation: "Use 25 x 40. Rounding to nearby friendly factors makes the product easy to judge."
      }
    ]
  },
  {
    id: "patterns",
    title: "Patterns",
    subtitle: "Discover numerical patterns.",
    questions: [
      {
        question: "4, 8, 12, 16, ?",
        answer: "20",
        explanation: "The sequence adds 4 each time. Constant differences signal an arithmetic pattern."
      },
      {
        question: "3, 6, 12, 24, ?",
        answer: "48",
        explanation: "Each term doubles. Multiplicative growth is easier to see by comparing each term with the previous one."
      },
      {
        question: "1, 4, 9, 16, ?",
        answer: "25",
        explanation: "These are square numbers: 1 squared, 2 squared, 3 squared, 4 squared, then 5 squared."
      },
      {
        question: "2, 5, 11, 23, ?",
        answer: "47",
        explanation: "Each term is double the previous term plus 1. Checking the operation between terms reveals the rule."
      },
      {
        question: "81, 72, 63, 54, ?",
        answer: "45",
        explanation: "The sequence subtracts 9 each time. Track the difference rather than the size of the terms."
      },
      {
        question: "5, 9, 17, 33, ?",
        answer: "65",
        explanation: "Each term is double the previous term minus 1. The pattern combines multiplication and subtraction."
      },
      {
        question: "1, 1, 2, 3, 5, 8, ?",
        answer: "13",
        explanation: "Each term is the sum of the two before it. This is a relationship pattern, not a fixed jump."
      },
      {
        question: "2, 6, 12, 20, 30, ?",
        answer: "42",
        explanation: "The differences are 4, 6, 8, 10, so the next difference is 12."
      },
      {
        question: "64, 32, 16, 8, ?",
        answer: "4",
        explanation: "Each term is divided by 2. Halving patterns move quickly toward smaller landmarks."
      },
      {
        question: "7, 10, 16, 28, 52, ?",
        answer: "100",
        explanation: "The differences are 3, 6, 12, 24, so the next difference doubles to 48."
      }
    ]
  },
  {
    id: "flexible-multiplication",
    title: "Flexible Multiplication",
    subtitle: "Multiple strategies for multiplication.",
    questions: [
      {
        question: "14 x 15 = ?",
        answer: "210",
        explanation: "Break 15 into 10 + 5. Then 14 x 10 and 14 x 5 are easy partial products."
      },
      {
        question: "28 x 5 = ?",
        answer: "140",
        explanation: "Multiplying by 5 is half of multiplying by 10. Half of 280 is 140."
      },
      {
        question: "19 x 8 = ?",
        answer: "152",
        explanation: "Use 20 x 8 = 160, then subtract one group of 8."
      },
      {
        question: "35 x 12 = ?",
        answer: "420",
        explanation: "Use 35 x 10 plus 35 x 2. Breaking 12 into 10 and 2 keeps both parts simple."
      },
      {
        question: "48 x 25 = ?",
        answer: "1200",
        explanation: "Think of 25 as one fourth of 100. Divide 48 by 4 to get 12, then multiply by 100."
      },
      {
        question: "16 x 17 = ?",
        answer: "272",
        explanation: "Use 16 x (10 + 7). Partial products 160 and 112 combine to 272."
      },
      {
        question: "99 x 7 = ?",
        answer: "693",
        explanation: "Use 100 x 7 = 700, then subtract 7. Near-hundred compensation is efficient."
      },
      {
        question: "42 x 18 = ?",
        answer: "756",
        explanation: "Use 42 x 20, then subtract 42 x 2. It is often easier to overshoot and adjust."
      },
      {
        question: "125 x 24 = ?",
        answer: "3000",
        explanation: "Break 24 into 3 x 8. Since 125 x 8 = 1000, the product is 3 groups of 1000."
      },
      {
        question: "37 x 63 = ?",
        answer: "2331",
        explanation: "Use 37 x 60 plus 37 x 3. Place value decomposition keeps the calculation organized."
      }
    ]
  },
  {
    id: "relationships",
    title: "Number Relationships",
    subtitle: "Compare numbers and reason without full calculation.",
    questions: [
      {
        question: "Which is larger: 5/8 or 0.6?",
        answer: "5/8|0.625",
        explanation: "5/8 equals 0.625, which is slightly greater than 0.6. Convert to a common form before comparing."
      },
      {
        question: "3/4 and 75% are ____.",
        answer: "equal|=",
        explanation: "3/4 means 75 out of 100, so it matches 75%. Fractions and percents can name the same amount."
      },
      {
        question: "Which is closer to 1: 0.98 or 1.03?",
        answer: "0.98",
        explanation: "0.98 is 0.02 away from 1, while 1.03 is 0.03 away. Compare distances from the target."
      },
      {
        question: "Fill in the symbol: 7 x 9 ____ 8 x 8",
        answer: "<",
        explanation: "7 x 9 is 63 and 8 x 8 is 64. Nearby products can be compared using known square facts."
      },
      {
        question: "Which is larger: 48 x 52 or 50 x 50?",
        answer: "50 x 50|50*50",
        explanation: "48 x 52 is 50 squared minus 2 squared, so it is 4 less than 50 x 50."
      },
      {
        question: "2/3 of 90 and 3/5 of 100 are ____.",
        answer: "equal|=",
        explanation: "Both expressions make 60. Different fractions can create the same amount when the wholes differ."
      },
      {
        question: "Which is smaller: 0.333 or 1/3?",
        answer: "0.333",
        explanation: "1/3 is 0.333 repeating, so 0.333 stops slightly short. Repeating decimals matter."
      },
      {
        question: "If a > b > 0, then a + 5 ____ b + 5.",
        answer: ">",
        explanation: "Adding the same amount to both numbers preserves their order."
      },
      {
        question: "Which has the greater unit rate: 180 km in 3 h or 250 km in 5 h?",
        answer: "180 km in 3 h|180/3|60",
        explanation: "Compare per-hour rates. 180 divided by 3 is 60, while 250 divided by 5 is 50."
      },
      {
        question: "Which is larger: 0.2 or 0.2 squared?",
        answer: "0.2",
        explanation: "A positive number less than 1 becomes smaller when multiplied by itself."
      }
    ]
  },
  {
    id: "logical-reasoning",
    title: "Logical Reasoning",
    subtitle: "Explain why a mathematical statement is true.",
    questions: [
      {
        question: "The sum of two even numbers is always ____.",
        answer: "even",
        explanation: "Even numbers are made of pairs. Combining two sets of pairs still leaves only complete pairs."
      },
      {
        question: "If a whole number ends in 0 or 5, it is divisible by ____.",
        answer: "5",
        explanation: "Multiples of 5 repeat a last-digit pattern of 0, 5, 0, 5. The last digit identifies divisibility."
      },
      {
        question: "Multiplying by 0.5 is the same as dividing by ____.",
        answer: "2",
        explanation: "0.5 means one half. Taking half of a number is the same as dividing it by 2."
      },
      {
        question: "If 3n is even, n must be ____.",
        answer: "even",
        explanation: "Multiplying by 3 does not change parity. If the product is even, the original number must already be even."
      },
      {
        question: "The product of two negative numbers is ____.",
        answer: "positive",
        explanation: "A negative factor reverses direction. Reversing direction twice returns to positive."
      },
      {
        question: "If a / b = 1 and b is not 0, then a and b are ____.",
        answer: "equal|the same",
        explanation: "A ratio of 1 means the numerator and denominator represent the same quantity."
      },
      {
        question: "A square number has an odd number of factors: true or false?",
        answer: "true",
        explanation: "Most factors pair up, but the square root pairs with itself only once, leaving an odd count."
      },
      {
        question: "A fraction with numerator greater than denominator is greater than ____.",
        answer: "1",
        explanation: "The numerator counts more parts than one whole denominator contains, so the value is above 1."
      },
      {
        question: "Adding the same number to both sides of an inequality keeps the direction the ____.",
        answer: "same",
        explanation: "Both values move by the same distance on the number line, so their order does not change."
      },
      {
        question: "If x is positive and x < 1, then x squared is ____ than x.",
        answer: "less|smaller",
        explanation: "Multiplying by a positive number less than 1 shrinks the value."
      }
    ]
  },
  {
    id: "challenge",
    title: "Challenge Problems",
    subtitle: "More difficult number sense questions.",
    questions: [
      {
        question: "97 x 103 = ?",
        answer: "9991",
        explanation: "Use difference of squares: 100 minus 3 times 100 plus 3 equals 100 squared minus 3 squared."
      },
      {
        question: "1 + 2 + 3 + ... + 20 = ?",
        answer: "210",
        explanation: "Pair first and last terms: 1 + 20, 2 + 19, and so on. Ten pairs of 21 make 210."
      },
      {
        question: "15 squared - 14 squared = ?",
        answer: "29",
        explanation: "Use a squared minus b squared as (a - b)(a + b). Here that is 1 x 29."
      },
      {
        question: "999 + 998 + 997 = ?",
        answer: "2994",
        explanation: "Compare each number with 1000. The sum is 3000 minus 1 minus 2 minus 3."
      },
      {
        question: "A price is reduced by 20%, then reduced by 25% again. What percent of the original price remains?",
        answer: "60%|60",
        explanation: "After 20% off, 80% remains. Taking 25% off that leaves 75% of 80%, which is 60%."
      },
      {
        question: "2 to the 10th power = ?",
        answer: "1024",
        explanation: "Double repeatedly: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024."
      },
      {
        question: "A square has perimeter 48. What is its area?",
        answer: "144",
        explanation: "A square has four equal sides, so each side is 12. The area is side squared."
      },
      {
        question: "What is the average of 10, 20, 30, 40, and 50?",
        answer: "30",
        explanation: "The numbers are evenly spaced, so the average is the middle value."
      },
      {
        question: "If 6 machines make 6 items in 6 minutes, how many minutes do 12 machines need to make 12 items?",
        answer: "6",
        explanation: "Each machine makes one item in 6 minutes. With 12 machines, 12 items still take 6 minutes."
      },
      {
        question: "1/2 + 1/4 + 1/8 + 1/16 = ?",
        answer: "15/16|0.9375",
        explanation: "These fractions fill a whole in halves of what remains. After four terms, only 1/16 is missing."
      }
    ]
  }
];

let currentUser = null;
let authMode = "login";
let practiceSession = null;
let timerId = null;
let calendarMonth = new Date();
let selectedCalendarDate = toDateKey(new Date());

const app = document.querySelector("#app");
const logoutButton = document.querySelector("[data-action='logout']");
const themeLabel = document.querySelector("[data-theme-label]");

document.addEventListener("click", handleGlobalClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("input", handleInput);

initialize();

function initialize() {
  seedTeacherAccount();
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
  currentUser = getCurrentUser();
  updateAuthButtons();
  if (currentUser) {
    renderHome();
  } else {
    renderAuth();
  }
}

function handleGlobalClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "toggle-theme") {
    const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
  }

  if (action === "logout") {
    stopTimer();
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    updateAuthButtons();
    renderAuth();
  }

  if (action === "home") {
    if (currentUser) renderHome();
    else renderAuth();
  }

  if (action === "auth-mode") {
    authMode = actionTarget.dataset.mode;
    renderAuth();
  }

  if (action === "categories") {
    renderCategorySelect();
  }

  if (action === "teacher") {
    renderTeacherDashboard();
  }

  if (action === "calendar") {
    renderCalendarView();
  }

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
    selectedCalendarDate = actionTarget.dataset.date;
    calendarMonth = parseDateKey(selectedCalendarDate);
    renderCalendarView(selectedCalendarDate);
  }

  if (action === "download-file") {
    downloadStoredFile(actionTarget.dataset.fileId);
  }

  if (action === "delete-assignment") {
    deleteAssignment(actionTarget.dataset.assignmentId);
  }

  if (action === "start-category") {
    startCategory(actionTarget.dataset.categoryId);
  }

  if (action === "check-answer") {
    checkAnswer();
  }

  if (action === "show-answer") {
    showAnswer();
  }

  if (action === "next-question") {
    nextQuestion();
  }

  if (action === "retry-category") {
    startCategory(actionTarget.dataset.categoryId);
  }

  if (action === "view-student") {
    renderTeacherDashboard(actionTarget.dataset.username);
  }

  if (action === "clear-student") {
    clearStudentData(actionTarget.dataset.username);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  if (form.dataset.form === "auth") {
    if (authMode === "login") {
      login(form);
    } else {
      register(form);
    }
  }

  if (form.dataset.form === "assignment") {
    saveAssignment(form);
  }

  if (form.dataset.form === "submission") {
    saveSubmission(form);
  }

  if (form.dataset.form === "review") {
    saveReview(form);
  }
}

function handleInput(event) {
  if (event.target.matches("#answerInput")) {
    const feedback = document.querySelector("#feedback");
    if (feedback) {
      feedback.className = "feedback";
      feedback.innerHTML = "";
    }
  }
}

function renderAuth(message = "") {
  stopTimer();
  app.innerHTML = `
    <section class="hero">
      <div class="panel">
        <h1 class="headline">Build stronger number sense one question at a time.</h1>
        <p class="lead">Practice mental math, estimation, patterns, reasoning, and flexible strategies across 80 focused questions.</p>
        <div class="stat-grid" aria-label="Practice summary">
          <div class="stat"><strong>8</strong><span>Categories</span></div>
          <div class="stat"><strong>80</strong><span>Questions</span></div>
          <div class="stat"><strong>10</strong><span>Per category</span></div>
        </div>
      </div>

      <section class="panel auth-card" aria-label="Account access">
        <div class="auth-tabs">
          <button class="tab-button ${authMode === "login" ? "active" : ""}" type="button" data-action="auth-mode" data-mode="login">Login</button>
          <button class="tab-button ${authMode === "register" ? "active" : ""}" type="button" data-action="auth-mode" data-mode="register">Register</button>
        </div>

        <form class="form" data-form="auth">
          <div class="field">
            <label for="username">Username</label>
            <input id="username" name="username" autocomplete="username" placeholder="Student name" required>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" autocomplete="${authMode === "login" ? "current-password" : "new-password"}" placeholder="Password" required>
          </div>
          <button class="primary-button" type="submit">${authMode === "login" ? "Login" : "Create account"}</button>
          <div class="message ${message.includes("created") ? "ok" : ""}" role="status">${message}</div>
        </form>
      </section>
    </section>
  `;
}

function renderHome() {
  stopTimer();
  const data = getPracticeData();
  const stats = getUserStats(currentUser.username, data);
  const teacherButton = currentUser.role === "teacher"
    ? `<button class="secondary-button" type="button" data-action="teacher">Teacher Dashboard</button>`
    : "";

  app.innerHTML = `
    <section class="panel">
      <div class="section-head">
        <div>
          <h1>Welcome, ${escapeHtml(currentUser.username)}</h1>
          <p>${currentUser.role === "teacher" ? "Teacher access is active." : "Ready for today's practice."}</p>
        </div>
        <div class="button-row">
          ${teacherButton}
          <button class="secondary-button" type="button" data-action="calendar">Calendar</button>
          <button class="primary-button" type="button" data-action="categories">Choose Category</button>
        </div>
      </div>

      <div class="progress-row">
        <span>Question ${Math.min(stats.attempted + 1, 80)} / 80</span>
        <span>${stats.correct} correct answers</span>
      </div>
      <div class="progress-track" aria-label="Overall progress">
        <div class="progress-fill" style="width: ${stats.progressPercent}%"></div>
      </div>

      <div class="stat-grid">
        <div class="stat"><strong>${stats.attempted}</strong><span>Answered</span></div>
        <div class="stat"><strong>${stats.correct}</strong><span>Correct</span></div>
        <div class="stat"><strong>${stats.completed}</strong><span>Categories finished</span></div>
      </div>
    </section>
  `;
}

function renderCategorySelect() {
  stopTimer();
  const data = getPracticeData();
  const stats = getUserStats(currentUser.username, data);

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <h1>Choose Category</h1>
          <p>Question ${Math.min(stats.attempted + 1, 80)} / 80</p>
        </div>
        <div class="mode-row" aria-label="Practice mode">
          <button class="mode-button active" type="button" data-mode-button="normal">Ordered</button>
          <button class="mode-button" type="button" data-mode-button="random">Random</button>
        </div>
      </div>

      <div class="category-grid">
        ${categories.map((category, index) => categoryCard(category, index, data)).join("")}
      </div>
    </section>
  `;

  document.querySelectorAll("[data-mode-button]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-mode-button]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function categoryCard(category, index, data) {
  const categoryData = getCategoryData(currentUser.username, category.id, data);
  const attempted = Object.keys(categoryData.answers || {}).length;
  const bestScore = categoryData.bestScore ?? 0;

  return `
    <button class="category-card" type="button" data-action="start-category" data-category-id="${category.id}">
      <span class="category-number">${index + 1}</span>
      <h3>${category.title}</h3>
      <p>${category.subtitle}</p>
      <div class="progress-track" aria-label="${category.title} progress">
        <div class="progress-fill" style="width: ${attempted * 10}%"></div>
      </div>
      <div class="mini-meta">
        <span class="pill">${attempted}/10 tried</span>
        <span class="pill">Best ${bestScore}/10</span>
      </div>
    </button>
  `;
}

function startCategory(categoryId) {
  const selectedMode = document.querySelector("[data-mode-button].active")?.dataset.modeButton || "normal";
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return;

  const order = Array.from({ length: category.questions.length }, (_, index) => index);
  if (selectedMode === "random") shuffle(order);

  practiceSession = {
    categoryId,
    order,
    position: 0,
    answers: {},
    revealed: {},
    startedAt: Date.now(),
    questionStartedAt: Date.now()
  };

  renderQuestion();
}

function renderQuestion() {
  const category = getCurrentCategory();
  const questionIndex = practiceSession.order[practiceSession.position];
  const question = category.questions[questionIndex];
  const data = getPracticeData();
  const stats = getUserStats(currentUser.username, data);
  const categoryProgress = ((practiceSession.position + 1) / category.questions.length) * 100;
  const sessionScore = Object.values(practiceSession.answers).filter((answer) => answer.correct).length;

  stopTimer();
  practiceSession.questionStartedAt = Date.now();

  app.innerHTML = `
    <section class="question-shell">
      <div class="practice-top">
        <div class="progress-row">
          <span>Question ${Math.min(stats.attempted + 1, 80)} / 80</span>
          <span>${category.title}: ${practiceSession.position + 1} / 10</span>
        </div>
        <div class="progress-track" aria-label="Category progress">
          <div class="progress-fill" style="width: ${categoryProgress}%"></div>
        </div>
      </div>

      <article class="question-card" id="questionCard">
        <div class="question-meta">
          <span class="pill">${category.title}</span>
          <span class="pill">Score ${sessionScore}/10</span>
          <span class="pill" id="timer">00:00</span>
        </div>

        <h2 class="question-text">${question.question}</h2>

        <div class="answer-area">
          <input class="answer-input" id="answerInput" placeholder="Type your answer" autocomplete="off" inputmode="decimal">
          <div class="button-row">
            <button class="primary-button" type="button" data-action="check-answer">Check Answer</button>
            <button class="secondary-button" type="button" data-action="show-answer">Show Answer</button>
            <button class="ghost-button" type="button" data-action="next-question">${practiceSession.position === 9 ? "Finish" : "Next Question"}</button>
          </div>
          <div class="feedback" id="feedback" aria-live="polite"></div>
        </div>
      </article>
    </section>
  `;

  document.querySelector("#answerInput").focus();
  startTimer();
}

function checkAnswer() {
  if (!practiceSession) return;

  const input = document.querySelector("#answerInput");
  const feedback = document.querySelector("#feedback");
  const questionCard = document.querySelector("#questionCard");
  const category = getCurrentCategory();
  const questionIndex = practiceSession.order[practiceSession.position];
  const question = category.questions[questionIndex];
  const value = input.value.trim();

  if (!value) {
    feedback.className = "feedback show incorrect";
    feedback.innerHTML = "<strong>Enter an answer first.</strong>";
    return;
  }

  const wasRevealed = Boolean(practiceSession.revealed[questionIndex]);
  const correct = isCorrectAnswer(value, question.answer) && !wasRevealed;
  const elapsed = Math.round((Date.now() - practiceSession.questionStartedAt) / 1000);

  practiceSession.answers[questionIndex] = {
    answer: value,
    correct,
    revealed: wasRevealed,
    elapsed
  };

  saveQuestionAttempt(category.id, questionIndex, practiceSession.answers[questionIndex]);

  if (correct) {
    feedback.className = "feedback show correct";
    feedback.innerHTML = `<strong>Correct.</strong>${question.explanation}`;
    questionCard.classList.remove("correct-burst");
    void questionCard.offsetWidth;
    questionCard.classList.add("correct-burst");
  } else {
    const reason = wasRevealed ? "Answer shown first, saved as review." : "Not quite.";
    feedback.className = "feedback show incorrect";
    feedback.innerHTML = `<strong>${reason}</strong>Answer: ${formatAnswer(question.answer)}<br>${question.explanation}`;
  }
}

function showAnswer() {
  if (!practiceSession) return;

  const feedback = document.querySelector("#feedback");
  const category = getCurrentCategory();
  const questionIndex = practiceSession.order[practiceSession.position];
  const question = category.questions[questionIndex];
  practiceSession.revealed[questionIndex] = true;

  feedback.className = "feedback show";
  feedback.innerHTML = `<strong>Answer: ${formatAnswer(question.answer)}</strong>${question.explanation}`;
}

function nextQuestion() {
  if (!practiceSession) return;

  if (practiceSession.position < 9) {
    practiceSession.position += 1;
    renderQuestion();
    return;
  }

  finishCategory();
}

function finishCategory() {
  const category = getCurrentCategory();
  const score = Object.values(practiceSession.answers).filter((answer) => answer.correct).length;
  const answered = Object.keys(practiceSession.answers).length;
  saveCategorySession(category.id, score, answered);
  stopTimer();
  burstConfetti();
  renderScore(category, score, answered);
}

function renderScore(category, score, answered) {
  const message = score >= 8
    ? "Strong strategy work."
    : score >= 5
      ? "Good progress. Review the missed strategies."
      : "Use the explanations, then try this category again.";

  app.innerHTML = `
    <section class="score-card">
      <span class="pill">${category.title}</span>
      <h1>Category Complete</h1>
      <div class="score-number">${score}/10</div>
      <p>${message}</p>
      <p>${answered} questions were answered in this session.</p>
      <div class="button-row" style="justify-content: center;">
        <button class="primary-button" type="button" data-action="retry-category" data-category-id="${category.id}">Try Again</button>
        <button class="secondary-button" type="button" data-action="categories">Choose Category</button>
        <button class="ghost-button" type="button" data-action="home">Home</button>
      </div>
    </section>
  `;
}

function renderCalendarView(dateKey = selectedCalendarDate, message = "") {
  stopTimer();
  selectedCalendarDate = dateKey || toDateKey(new Date());
  const assignmentData = getAssignmentData();
  const selectedDateResources = assignmentData.assignments
    .filter((assignment) => assignment.date === selectedCalendarDate)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const selectedNotes = selectedDateResources.filter((assignment) => getResourceType(assignment) === "note");
  const selectedHomework = selectedDateResources.filter((assignment) => getResourceType(assignment) === "homework");
  const isTeacher = currentUser.role === "teacher";

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <h1>Calendar</h1>
          <p>${isTeacher ? "Upload notes, publish homework, and review private student submissions." : "Download notes, download homework, and upload homework by date."}</p>
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
            ${calendarCells(calendarMonth, assignmentData).join("")}
          </div>
        </section>

        <section class="panel date-panel">
          <div class="section-head compact-head">
            <div>
              <h2>${formatDateForDisplay(selectedCalendarDate)}</h2>
              <p>${selectedNotes.length} note${selectedNotes.length === 1 ? "" : "s"} · ${selectedHomework.length} homework item${selectedHomework.length === 1 ? "" : "s"}</p>
            </div>
          </div>
          ${message ? `<div class="message ${calendarMessageClass(message)}">${escapeHtml(message)}</div>` : ""}
          ${isTeacher ? teacherCalendarTools(selectedDateResources, assignmentData) : studentCalendarTools(selectedDateResources, assignmentData)}
        </section>
      </div>
    </section>
  `;
}

function teacherCalendarTools(resourcesForDate, assignmentData) {
  const notes = resourcesForDate.filter((assignment) => getResourceType(assignment) === "note");
  const homework = resourcesForDate.filter((assignment) => getResourceType(assignment) === "homework");

  return `
    <div class="resource-columns">
      <section class="resource-section">
        <h3>Upload Notes</h3>
        ${resourceUploadForm("note")}
      </section>
      <section class="resource-section">
        <h3>Upload Homework</h3>
        ${resourceUploadForm("homework")}
      </section>
    </div>

    <div class="resource-columns">
      <section class="resource-strip">
        <h3>Notes for This Date</h3>
        <div class="assignment-stack">
          ${notes.length ? notes.map((note) => teacherNoteCard(note)).join("") : `<div class="empty">No notes uploaded for this date.</div>`}
        </div>
      </section>
      <section class="resource-strip">
        <h3>Homework for This Date</h3>
        <div class="assignment-stack">
          ${homework.length ? homework.map((assignment) => teacherHomeworkCard(assignment, assignmentData)).join("") : `<div class="empty">No homework uploaded for this date.</div>`}
        </div>
      </section>
    </div>

    <section class="resource-strip">
      <h3>My Uploaded Resources</h3>
      ${teacherCoursewareList(assignmentData)}
    </section>
  `;
}

function resourceUploadForm(kind) {
  const isNote = kind === "note";
  const title = isNote ? "Note title" : "Homework title";
  const instructions = isNote ? "Note description" : "Homework instructions";
  const fileLabel = isNote ? "Upload note files" : "Upload homework files";
  const placeholder = isNote ? "Example: Linear relationships notes" : "Example: Estimation practice set";

  return `
    <form class="form assignment-form" data-form="assignment">
      <input type="hidden" name="assignmentDate" value="${selectedCalendarDate}">
      <input type="hidden" name="assignmentKind" value="${kind}">
      <div class="field">
        <label>${title}</label>
        <input name="assignmentTitle" placeholder="${placeholder}" required>
      </div>
      <div class="field">
        <label>${instructions}</label>
        <textarea name="assignmentInstructions" placeholder="${isNote ? "Write a short description for this note." : "Write the homework instructions."}" required></textarea>
      </div>
      <div class="field">
        <label>${fileLabel}</label>
        <input name="assignmentFiles" type="file" multiple>
      </div>
      <button class="${isNote ? "secondary-button" : "primary-button"}" type="submit">${isNote ? "Upload Notes" : "Upload Homework"}</button>
    </form>
  `;
}

function studentCalendarTools(resourcesForDate, assignmentData) {
  const notes = resourcesForDate.filter((assignment) => getResourceType(assignment) === "note");
  const homework = resourcesForDate.filter((assignment) => getResourceType(assignment) === "homework");

  return `
    <section class="resource-strip student-category">
      <h3>Download Notes</h3>
      ${notes.length ? notes.map((note) => studentNoteCard(note)).join("") : `<div class="empty">No notes for this date.</div>`}
    </section>

    <section class="resource-strip student-category">
      <h3>Download Homework</h3>
      ${homework.length ? homework.map((assignment) => studentHomeworkDownloadCard(assignment)).join("") : `<div class="empty">No homework files for this date.</div>`}
    </section>

    <section class="resource-strip student-category">
      <h3>Upload Homework</h3>
      ${homework.length ? homework.map((assignment) => studentAssignmentCard(assignment, assignmentData)).join("") : `<div class="empty">No homework to submit for this date.</div>`}
    </section>
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

function teacherHomeworkCard(assignment, assignmentData) {
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
        ${students.length ? students.map((student) => teacherStudentReviewCard(assignment, student.username, assignmentData)).join("") : `<div class="empty">No student accounts yet.</div>`}
      </div>
    </article>
  `;
}

function teacherStudentReviewCard(assignment, student, assignmentData) {
  const submission = getStudentSubmission(assignmentData, assignment.id, student);
  const review = getStudentReview(assignmentData, assignment.id, student);
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
          <select class="status-select" name="status">
            ${statusOptions(status)}
          </select>
        </div>
        <div class="field">
          <label>Private 1:1 comment</label>
          <textarea name="comment" placeholder="Only you and ${escapeHtml(student)} should see this comment.">${escapeHtml(review?.comment || "")}</textarea>
        </div>
        <button class="secondary-button" type="submit">Save Status and Comment</button>
        ${review?.updatedAt ? `<span class="pill">Saved ${formatDateTime(review.updatedAt)}</span>` : ""}
      </form>
    </article>
  `;
}

function statusOptions(selectedStatus) {
  return HOMEWORK_STATUSES
    .map((status) => `<option value="${status}" ${status === selectedStatus ? "selected" : ""}>${status}</option>`)
    .join("");
}

function statusClass(status) {
  return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function studentNoteCard(note) {
  return `
    <article class="assignment-card">
      <div class="assignment-head">
        <div>
          <span class="pill">Note</span>
          <h3>${escapeHtml(note.title)}</h3>
          <p>${escapeHtml(note.instructions)}</p>
        </div>
      </div>
      ${renderFileList(note.files)}
    </article>
  `;
}

function studentHomeworkDownloadCard(assignment) {
  return `
    <article class="assignment-card">
      <div class="assignment-head">
        <div>
          <span class="pill">Homework</span>
          <h3>${escapeHtml(assignment.title)}</h3>
          <p>${escapeHtml(assignment.instructions)}</p>
        </div>
      </div>
      ${renderFileList(assignment.files)}
    </article>
  `;
}

function studentAssignmentCard(assignment, assignmentData) {
  const submission = getStudentSubmission(assignmentData, assignment.id, currentUser.username);
  const review = getStudentReview(assignmentData, assignment.id, currentUser.username);
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
      ${submission ? studentSubmissionSummary(submission, review) : studentPrivateReview(review)}
      <form class="form submission-form" data-form="submission">
        <input type="hidden" name="assignmentId" value="${assignment.id}">
        <div class="field">
          <label for="submissionNote-${assignment.id}">Submission note</label>
          <textarea id="submissionNote-${assignment.id}" name="submissionNote" placeholder="Write a short note for your teacher.">${submission ? escapeHtml(submission.note || "") : ""}</textarea>
        </div>
        <div class="field">
          <label for="submissionFiles-${assignment.id}">Upload homework files</label>
          <input id="submissionFiles-${assignment.id}" name="submissionFiles" type="file" multiple>
        </div>
        <button class="primary-button" type="submit">${submission ? "Resubmit Homework" : "Submit Homework"}</button>
      </form>
    </article>
  `;
}

function studentSubmissionSummary(submission, review) {
  return `
    <div class="submission-card">
      <div class="submission-head">
        <strong>Your submission</strong>
        <span>${formatDateTime(submission.submittedAt)}</span>
      </div>
      ${renderFileList(submission.files)}
      ${studentPrivateReview(review)}
    </div>
  `;
}

function studentPrivateReview(review) {
  if (!review?.comment) {
    return `<div class="feedback show">No private teacher comment yet.</div>`;
  }

  return `
    <div class="feedback show correct">
      <strong>Private teacher comment</strong>
      ${escapeHtml(review.comment)}
    </div>
  `;
}

function getResourceType(assignment) {
  return assignment?.type === "note" ? "note" : "homework";
}

function labelForResourceType(type) {
  return type === "note" ? "Notes" : "Homework";
}

function getStudentSubmission(assignmentData, assignmentId, student) {
  return assignmentData.submissions.find((item) => (
    item.assignmentId === assignmentId && item.student === student
  ));
}

function getStudentReview(assignmentData, assignmentId, student) {
  const review = (assignmentData.reviews || []).find((item) => (
    item.assignmentId === assignmentId && item.student === student
  ));

  if (review) return review;

  const legacySubmission = getStudentSubmission(assignmentData, assignmentId, student);
  if (legacySubmission?.feedback) {
    return {
      status: legacySubmission.correctedStatus || "Reviewed",
      comment: legacySubmission.feedback,
      updatedAt: legacySubmission.feedbackAt,
      updatedBy: legacySubmission.feedbackBy
    };
  }

  return null;
}

function teacherCoursewareList(assignmentData) {
  const files = assignmentData.assignments
    .filter((assignment) => assignment.teacher === currentUser.username)
    .flatMap((assignment) => (assignment.files || []).map((file) => ({
      ...file,
      assignmentTitle: assignment.title,
      date: assignment.date,
      resourceType: getResourceType(assignment)
    })))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  if (!files.length) return `<div class="empty">No courseware uploaded yet.</div>`;

  return `
    <div class="file-list">
      ${files.map((file) => `
        <div class="file-row">
          <div>
            <strong>${escapeHtml(file.name)}</strong>
            <span>${escapeHtml(labelForResourceType(file.resourceType))} · ${escapeHtml(file.assignmentTitle)} · ${formatDateForDisplay(file.date)} · ${formatFileSize(file.size)}</span>
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

function calendarCells(monthDate, assignmentData) {
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
    const assignments = assignmentData.assignments.filter((assignment) => assignment.date === dateKey);
    const notes = assignments.filter((assignment) => getResourceType(assignment) === "note");
    const homework = assignments.filter((assignment) => getResourceType(assignment) === "homework");
    const submissions = assignmentData.submissions.filter((submission) => {
      const assignment = assignmentData.assignments.find((item) => item.id === submission.assignmentId);
      return assignment?.date === dateKey && getResourceType(assignment) === "homework";
    });
    const selected = selectedCalendarDate === dateKey ? "selected" : "";
    const today = toDateKey(new Date()) === dateKey ? "today" : "";

    const noteBadge = notes.length ? `<span class="calendar-tag note-tag">${notes.length}N</span>` : "";
    const homeworkBadge = homework.length ? `<span class="calendar-tag homework-tag">${homework.length}H</span>` : "";
    const submissionBadge = submissions.length ? `<small>${submissions.length} submitted</small>` : "";

    cells.push(`
      <button class="calendar-cell ${selected} ${today}" type="button" data-action="select-date" data-date="${dateKey}" aria-label="${dateKey}: ${notes.length} notes, ${homework.length} homework, ${submissions.length} submissions">
        <strong>${day}</strong>
        <span class="calendar-badges">${noteBadge}${homeworkBadge}</span>
        ${submissionBadge}
      </button>
    `);
  }

  return cells;
}

function renderTeacherDashboard(selectedUsername = "") {
  if (!currentUser || currentUser.role !== "teacher") {
    renderHome();
    return;
  }

  stopTimer();
  const users = getUsers().filter((user) => user.role !== "teacher");
  const data = getPracticeData();
  const selected = selectedUsername || users[0]?.username || "";

  app.innerHTML = `
    <section>
      <div class="section-head">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Signed in as ${TEACHER_USERNAME}</p>
        </div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="calendar">Calendar</button>
          <button class="secondary-button" type="button" data-action="categories">Open Practice</button>
        </div>
      </div>

      <div class="teacher-grid">
        <aside class="panel">
          <h2>Students</h2>
          <div class="student-list">
            ${users.length ? users.map((user) => studentRow(user, selected, data)).join("") : `<div class="empty">No student accounts yet.</div>`}
          </div>
        </aside>

        <section class="panel">
          ${selected ? studentDetail(selected, data) : `<div class="empty">Select a student to view progress.</div>`}
        </section>
      </div>
    </section>
  `;
}

function studentRow(user, selected, data) {
  const stats = getUserStats(user.username, data);
  return `
    <button class="student-row ${selected === user.username ? "active" : ""}" type="button" data-action="view-student" data-username="${escapeHtml(user.username)}">
      <strong>${escapeHtml(user.username)}</strong>
      <span>${stats.attempted}/80 answered, ${stats.correct} correct</span>
    </button>
  `;
}

function studentDetail(username, data) {
  const stats = getUserStats(username, data);
  const userData = data[username] || { categories: {} };
  const rows = categories.map((category) => {
    const categoryData = userData.categories?.[category.id] || {};
    const answers = categoryData.answers || {};
    const attempted = Object.keys(answers).length;
    const correct = Object.values(answers).filter((answer) => answer.correct).length;
    const bestScore = categoryData.bestScore ?? 0;
    return `
      <tr>
        <td>${category.title}</td>
        <td>${attempted}/10</td>
        <td>${correct}</td>
        <td>${bestScore}/10</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="section-head">
      <div>
        <h2>${escapeHtml(username)}</h2>
        <p>${stats.attempted}/80 answered, ${stats.correct} correct</p>
      </div>
      <button class="danger-button" type="button" data-action="clear-student" data-username="${escapeHtml(username)}">Clear Data</button>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width: ${stats.progressPercent}%"></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Progress</th>
            <th>Correct</th>
            <th>Best</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
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
    renderAuth("Use at least 2 characters for name and 4 for password.");
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

  const user = { username, password, role: "student", createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  currentUser = { username, role: "student" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  updateAuthButtons();
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
    saveUsers(users);
    return;
  }

  teacher.role = "teacher";
  saveUsers(users);
}

function getUsers(seed = true) {
  const raw = localStorage.getItem(USERS_KEY);
  const users = raw ? safeJson(raw, []) : [];
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

function getPracticeData() {
  return safeJson(localStorage.getItem(DATA_KEY), {});
}

function savePracticeData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function getAssignmentData() {
  const data = safeJson(localStorage.getItem(ASSIGNMENTS_KEY), null);
  if (!data) return { assignments: [], submissions: [], reviews: [] };

  return {
    assignments: Array.isArray(data.assignments) ? data.assignments : [],
    submissions: Array.isArray(data.submissions) ? data.submissions : [],
    reviews: Array.isArray(data.reviews) ? data.reviews : []
  };
}

function saveAssignmentData(data) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify({
    assignments: data.assignments || [],
    submissions: data.submissions || [],
    reviews: data.reviews || []
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
    renderCalendarView(date || selectedCalendarDate, "Please add a date, title, and instructions.");
    return;
  }

  try {
    const assignmentId = createId("assignment");
    const fileRecords = await storeFiles(files, {
      kind,
      owner: currentUser.username,
      assignmentId
    });
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
    selectedCalendarDate = date;
    calendarMonth = parseDateKey(date);
    renderCalendarView(date, `${labelForResourceType(kind)} uploaded.`);
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
  const existing = data.submissions.find((item) => (
    item.assignmentId === assignmentId && item.student === currentUser.username
  ));

  if (!assignment) {
    renderCalendarView(selectedCalendarDate, "This homework no longer exists.");
    return;
  }

  if (getResourceType(assignment) !== "homework") {
    renderCalendarView(assignment.date, "Notes are download-only. Submit files under homework.");
    return;
  }

  if (!files.length && !note && !existing) {
    renderCalendarView(assignment.date, "Add a file or a note before submitting.");
    return;
  }

  try {
    const fileRecords = files.length
      ? await storeFiles(files, {
          kind: "submission",
          owner: currentUser.username,
          assignmentId
        })
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

  if (!assignment || getResourceType(assignment) !== "homework") {
    renderCalendarView(selectedCalendarDate, "Homework not found.");
    return;
  }

  data.reviews = data.reviews || [];
  const existing = data.reviews.find((item) => (
    item.assignmentId === assignmentId && item.student === student
  ));
  const now = new Date().toISOString();

  if (existing) {
    existing.status = status;
    existing.comment = comment;
    existing.updatedAt = now;
    existing.updatedBy = currentUser.username;
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

function deleteAssignment(assignmentId) {
  if (currentUser.role !== "teacher") return;
  if (!window.confirm("Delete this homework and its submission records?")) return;

  const data = getAssignmentData();
  const assignment = data.assignments.find((item) => item.id === assignmentId);
  if (!assignment) return;

  data.assignments = data.assignments.filter((item) => item.id !== assignmentId);
  data.submissions = data.submissions.filter((item) => item.assignmentId !== assignmentId);
  data.reviews = (data.reviews || []).filter((item) => item.assignmentId !== assignmentId);
  saveAssignmentData(data);
  renderCalendarView(assignment.date, `${labelForResourceType(getResourceType(assignment))} deleted.`);
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
    const store = transaction.objectStore(FILE_STORE_NAME);
    store.put(record);
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
    const store = transaction.objectStore(FILE_STORE_NAME);
    const request = store.get(fileId);

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

function getCategoryData(username, categoryId, data = getPracticeData()) {
  return data[username]?.categories?.[categoryId] || { answers: {}, bestScore: 0, sessions: [] };
}

function saveQuestionAttempt(categoryId, questionIndex, attempt) {
  const data = getPracticeData();
  ensureUserData(data, currentUser.username);
  ensureCategoryData(data, currentUser.username, categoryId);
  data[currentUser.username].categories[categoryId].answers[questionIndex] = {
    ...attempt,
    savedAt: new Date().toISOString()
  };
  savePracticeData(data);
}

function saveCategorySession(categoryId, score, answered) {
  const data = getPracticeData();
  ensureUserData(data, currentUser.username);
  ensureCategoryData(data, currentUser.username, categoryId);
  const categoryData = data[currentUser.username].categories[categoryId];

  categoryData.bestScore = Math.max(categoryData.bestScore || 0, score);
  categoryData.lastScore = score;
  categoryData.completedAt = new Date().toISOString();
  categoryData.sessions = categoryData.sessions || [];
  categoryData.sessions.push({
    score,
    answered,
    completedAt: new Date().toISOString()
  });

  savePracticeData(data);
}

function ensureUserData(data, username) {
  data[username] = data[username] || { categories: {} };
  data[username].categories = data[username].categories || {};
}

function ensureCategoryData(data, username, categoryId) {
  data[username].categories[categoryId] = data[username].categories[categoryId] || {
    answers: {},
    bestScore: 0,
    sessions: []
  };
  data[username].categories[categoryId].answers = data[username].categories[categoryId].answers || {};
}

function getUserStats(username, data = getPracticeData()) {
  const userData = data[username] || { categories: {} };
  let attempted = 0;
  let correct = 0;
  let completed = 0;

  categories.forEach((category) => {
    const categoryData = userData.categories?.[category.id];
    const answers = categoryData?.answers || {};
    attempted += Object.keys(answers).length;
    correct += Object.values(answers).filter((answer) => answer.correct).length;
    if ((categoryData?.sessions || []).length > 0) completed += 1;
  });

  return {
    attempted,
    correct,
    completed,
    progressPercent: Math.round((attempted / 80) * 100)
  };
}

function clearStudentData(username) {
  if (!window.confirm(`Clear all practice data for ${username}?`)) return;
  const data = getPracticeData();
  delete data[username];
  savePracticeData(data);
  renderTeacherDashboard(username);
}

function getCurrentCategory() {
  return categories.find((category) => category.id === practiceSession.categoryId);
}

function isCorrectAnswer(input, answer) {
  return answer.split("|").some((accepted) => answersMatch(input, accepted));
}

function answersMatch(input, accepted) {
  const inputText = normalizeAnswer(input);
  const acceptedText = normalizeAnswer(accepted);
  if (inputText === acceptedText) return true;

  const inputNumber = parseAnswerNumber(input);
  const acceptedNumber = parseAnswerNumber(accepted);
  if (inputNumber === null || acceptedNumber === null) return false;

  return Math.abs(inputNumber - acceptedNumber) < 0.000001;
}

function normalizeAnswer(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .replace(/\$/g, "");
}

function parseAnswerNumber(value) {
  let text = normalizeAnswer(value);
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
  return escapeHtml(answer.split("|")[0]);
}

function startTimer() {
  const timer = document.querySelector("#timer");
  if (!timer) return;

  const update = () => {
    const totalSeconds = Math.floor((Date.now() - practiceSession.questionStartedAt) / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    timer.textContent = `${minutes}:${seconds}`;
  };

  update();
  timerId = window.setInterval(update, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function burstConfetti() {
  const colors = ["#2563eb", "#38bdf8", "#16a34a", "#f59e0b", "#ef4444"];
  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 260}px`);
    piece.style.animationDelay = `${Math.random() * 220}ms`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1300);
  }
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
}

function updateAuthButtons() {
  logoutButton.classList.toggle("hidden", !currentUser);
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function monthTitle(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
}

function calendarWeekdays() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

function formatDateForDisplay(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
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

function formatFileSize(size) {
  if (!Number.isFinite(size)) return "Unknown size";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function calendarMessageClass(message) {
  return /uploaded|submitted|saved|deleted|private/i.test(message) ? "ok" : "";
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
