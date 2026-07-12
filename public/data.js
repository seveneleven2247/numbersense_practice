// Number Sense Academy question and module data.
// Each practice question uses the required shape:
// { id, category, difficulty, question, answer, explanation }

const academyCategories = [
  { id: "mental-math", title: "Mental Math", subtitle: "Fast mental calculations." },
  { id: "friendly-numbers", title: "Make Numbers Friendly", subtitle: "Compensation, decomposition, and friendly landmarks." },
  { id: "estimation", title: "Estimation", subtitle: "Estimate without needing exact calculation first." },
  { id: "patterns", title: "Patterns", subtitle: "Find numerical structure and predictable change." },
  { id: "flexible-multiplication", title: "Flexible Multiplication", subtitle: "Use multiple strategies for products." },
  { id: "relationships", title: "Number Relationships", subtitle: "Compare values and reason from structure." },
  { id: "logical-reasoning", title: "Logical Reasoning", subtitle: "Explain why mathematical statements are true." },
  { id: "challenge", title: "Challenge Problems", subtitle: "Harder number sense problems with multiple ideas." }
];

const academyModules = [
  { id: "mental-math", title: "Mental Math", type: "category", accent: "01", description: "Build speed with efficient mental calculations." },
  { id: "friendly-numbers", title: "Make Numbers Friendly", type: "category", accent: "02", description: "Use compensation, decomposition, tens, and hundreds." },
  { id: "estimation", title: "Estimation", type: "category", accent: "03", description: "Judge reasonable answers before calculating exactly." },
  { id: "patterns", title: "Patterns", type: "category", accent: "04", description: "Spot arithmetic, geometric, and recursive patterns." },
  { id: "flexible-multiplication", title: "Flexible Multiplication", type: "category", accent: "05", description: "Break products into useful parts." },
  { id: "relationships", title: "Number Relationships", type: "category", accent: "06", description: "Compare numbers using structure, benchmarks, and rates." },
  { id: "logical-reasoning", title: "Logical Reasoning", type: "category", accent: "07", description: "Explain why a claim must be true." },
  { id: "challenge", title: "Challenge Problems", type: "category", accent: "08", description: "Combine multiple strategies in harder questions." },
  { id: "speed", title: "Speed Challenge", type: "speed", accent: "60", description: "Answer as many random questions as possible in 60 seconds." },
  { id: "daily", title: "Daily Challenge", type: "daily", accent: "D", description: "A fresh set of 10 questions every day." },
  { id: "random", title: "Random Practice", type: "random", accent: "R", description: "Shuffle questions from every category." },
  { id: "mistakes", title: "Mistake Book", type: "mistakes", accent: "M", description: "Review questions that were answered incorrectly." },
  { id: "ai-generator", title: "AI Question Generator", type: "ai", accent: "AI", description: "Placeholder UI for future personalized questions." },
  { id: "progress", title: "Progress Dashboard", type: "progress", accent: "P", description: "View accuracy, history, and category trends." },
  { id: "achievements", title: "Achievements", type: "achievements", accent: "A", description: "Unlock badges for consistency and mastery." },
  { id: "teacher", title: "Teacher Dashboard", type: "teacher", accent: "T", description: "Teacher-only student progress, homework review, and report export." }
];

const questionBank = [
  {
    id: "mental-math-01",
    category: "mental-math",
    difficulty: 1,
    question: "48 + 27 = ?",
    answer: "75",
    explanation: "Make 48 friendly by adding 2 to reach 50, then add the remaining 25. Friendly landmarks reduce memory load."
  },
  {
    id: "mental-math-02",
    category: "mental-math",
    difficulty: 2,
    question: "96 - 38 = ?",
    answer: "58",
    explanation: "Think 96 - 40 = 56, then give back 2 because 38 is 2 less than 40."
  },
  {
    id: "mental-math-03",
    category: "mental-math",
    difficulty: 3,
    question: "25 x 16 = ?",
    answer: "400",
    explanation: "Break 16 into 4 x 4. Since 25 x 4 = 100, four groups of 100 make 400."
  },
  {
    id: "mental-math-04",
    category: "mental-math",
    difficulty: 4,
    question: "144 / 12 = ?",
    answer: "12",
    explanation: "Recognize 12 x 12 = 144. Known square facts make division faster."
  },
  {
    id: "mental-math-05",
    category: "mental-math",
    difficulty: 5,
    question: "19 + 38 + 21 = ?",
    answer: "78",
    explanation: "Pair 19 and 21 to make 40, then add 38. Pairing nearby numbers creates friendly totals."
  },
  {
    id: "mental-math-06",
    category: "mental-math",
    difficulty: 6,
    question: "15% of 80 = ?",
    answer: "12",
    explanation: "Find 10% of 80 as 8 and 5% as half of that, 4. Together they make 12."
  },
  {
    id: "mental-math-07",
    category: "mental-math",
    difficulty: 7,
    question: "7 x 13 + 7 x 7 = ?",
    answer: "140",
    explanation: "Factor out the 7: 7 x (13 + 7). The inside becomes 20, so the expression is 7 x 20."
  },
  {
    id: "mental-math-08",
    category: "mental-math",
    difficulty: 8,
    question: "0.25 x 64 = ?",
    answer: "16",
    explanation: "0.25 means one fourth. One fourth of 64 is found by halving twice: 64 to 32 to 16."
  },
  {
    id: "mental-math-09",
    category: "mental-math",
    difficulty: 9,
    question: "125 x 8 = ?",
    answer: "1000",
    explanation: "Use the benchmark fact that 125 is one eighth of 1000, so eight 125s make 1000."
  },
  {
    id: "mental-math-10",
    category: "mental-math",
    difficulty: 10,
    question: "360 / 15 = ?",
    answer: "24",
    explanation: "Divide both numbers by 5 to get 72 / 3. Scaling both parts of a division keeps the quotient the same."
  },
  {
    id: "friendly-numbers-01",
    category: "friendly-numbers",
    difficulty: 1,
    question: "99 + 46 = ?",
    answer: "145",
    explanation: "Move 1 from 46 to 99. Then 100 + 45 is easier than 99 + 46."
  },
  {
    id: "friendly-numbers-02",
    category: "friendly-numbers",
    difficulty: 2,
    question: "203 - 98 = ?",
    answer: "105",
    explanation: "Subtract 100 first to get 103, then add back 2 because 98 is 2 less than 100."
  },
  {
    id: "friendly-numbers-03",
    category: "friendly-numbers",
    difficulty: 3,
    question: "49 x 6 = ?",
    answer: "294",
    explanation: "Use 50 x 6 = 300, then subtract one group of 6. Compensation keeps multiplication simple."
  },
  {
    id: "friendly-numbers-04",
    category: "friendly-numbers",
    difficulty: 4,
    question: "5.8 + 3.7 + 4.2 = ?",
    answer: "13.7",
    explanation: "Pair 5.8 and 4.2 to make 10, then add 3.7. Look for decimal pairs that make whole numbers."
  },
  {
    id: "friendly-numbers-05",
    category: "friendly-numbers",
    difficulty: 5,
    question: "32 x 25 = ?",
    answer: "800",
    explanation: "Since 25 is one fourth of 100, split 32 into 8 x 4. Then 25 x 4 = 100 and 8 x 100 = 800."
  },
  {
    id: "friendly-numbers-06",
    category: "friendly-numbers",
    difficulty: 6,
    question: "398 + 217 = ?",
    answer: "615",
    explanation: "Add 2 to 398 to make 400 and take 2 from 217. Then 400 + 215 is quick."
  },
  {
    id: "friendly-numbers-07",
    category: "friendly-numbers",
    difficulty: 7,
    question: "1000 - 476 = ?",
    answer: "524",
    explanation: "Count up from 476 to 500, then to 1000. The jumps are 24 and 500, so the difference is 524."
  },
  {
    id: "friendly-numbers-08",
    category: "friendly-numbers",
    difficulty: 8,
    question: "19 x 21 = ?",
    answer: "399",
    explanation: "Think of the numbers as 20 - 1 and 20 + 1. The product is 20 squared minus 1 squared."
  },
  {
    id: "friendly-numbers-09",
    category: "friendly-numbers",
    difficulty: 9,
    question: "75 + 68 + 25 = ?",
    answer: "168",
    explanation: "Combine 75 and 25 to make 100, then add 68. Friendly pairs make three-number sums easier."
  },
  {
    id: "friendly-numbers-10",
    category: "friendly-numbers",
    difficulty: 10,
    question: "12.5 x 48 = ?",
    answer: "600",
    explanation: "12.5 is one eighth of 100. Since 48 / 8 = 6, the product is 6 x 100."
  },
  {
    id: "estimation-01",
    category: "estimation",
    difficulty: 1,
    question: "Estimate 198 + 305.",
    answer: "500",
    explanation: "Round 198 to 200 and 305 to 300. Estimation uses nearby landmarks to judge size quickly."
  },
  {
    id: "estimation-02",
    category: "estimation",
    difficulty: 2,
    question: "Estimate 49 x 21.",
    answer: "1000",
    explanation: "Use 50 x 20. Rounding one factor up and the other down gives a close mental benchmark."
  },
  {
    id: "estimation-03",
    category: "estimation",
    difficulty: 3,
    question: "Estimate 602 / 29.",
    answer: "20",
    explanation: "Use 600 / 30. Compatible numbers make division estimates fast."
  },
  {
    id: "estimation-04",
    category: "estimation",
    difficulty: 4,
    question: "Estimate $18.75 x 4.",
    answer: "80",
    explanation: "Round $18.75 to about $20. Four groups of about 20 dollars is about 80 dollars."
  },
  {
    id: "estimation-05",
    category: "estimation",
    difficulty: 5,
    question: "Estimate 7.9 + 12.2 + 5.1.",
    answer: "25",
    explanation: "Round to 8 + 12 + 5. The rounded values are close and easy to add."
  },
  {
    id: "estimation-06",
    category: "estimation",
    difficulty: 6,
    question: "Estimate 391 - 198.",
    answer: "200",
    explanation: "Use 400 - 200. Both numbers are close to these landmarks, so the estimate is stable."
  },
  {
    id: "estimation-07",
    category: "estimation",
    difficulty: 7,
    question: "Estimate 3.14 x 9.8.",
    answer: "30",
    explanation: "Use 3 x 10. The rounded factors make a quick estimate near the true product."
  },
  {
    id: "estimation-08",
    category: "estimation",
    difficulty: 8,
    question: "Estimate 58% of 402.",
    answer: "240",
    explanation: "Use about 60% of 400. Ten percent is 40, so sixty percent is 6 x 40."
  },
  {
    id: "estimation-09",
    category: "estimation",
    difficulty: 9,
    question: "Estimate 1,980 / 51.",
    answer: "40",
    explanation: "Use 2000 / 50. Compatible numbers show the quotient is about 40."
  },
  {
    id: "estimation-10",
    category: "estimation",
    difficulty: 10,
    question: "Estimate 24.7 x 39.5.",
    answer: "1000",
    explanation: "Use 25 x 40. Rounding to nearby friendly factors makes the product easy to judge."
  },
  {
    id: "patterns-01",
    category: "patterns",
    difficulty: 1,
    question: "4, 8, 12, 16, ?",
    answer: "20",
    explanation: "The sequence adds 4 each time. Constant differences signal an arithmetic pattern."
  },
  {
    id: "patterns-02",
    category: "patterns",
    difficulty: 2,
    question: "3, 6, 12, 24, ?",
    answer: "48",
    explanation: "Each term doubles. Multiplicative growth is easier to see by comparing each term with the previous one."
  },
  {
    id: "patterns-03",
    category: "patterns",
    difficulty: 3,
    question: "1, 4, 9, 16, ?",
    answer: "25",
    explanation: "These are square numbers: 1 squared, 2 squared, 3 squared, 4 squared, then 5 squared."
  },
  {
    id: "patterns-04",
    category: "patterns",
    difficulty: 4,
    question: "2, 5, 11, 23, ?",
    answer: "47",
    explanation: "Each term is double the previous term plus 1. Checking the operation between terms reveals the rule."
  },
  {
    id: "patterns-05",
    category: "patterns",
    difficulty: 5,
    question: "81, 72, 63, 54, ?",
    answer: "45",
    explanation: "The sequence subtracts 9 each time. Track the difference rather than the size of the terms."
  },
  {
    id: "patterns-06",
    category: "patterns",
    difficulty: 6,
    question: "5, 9, 17, 33, ?",
    answer: "65",
    explanation: "Each term is double the previous term minus 1. The pattern combines multiplication and subtraction."
  },
  {
    id: "patterns-07",
    category: "patterns",
    difficulty: 7,
    question: "1, 1, 2, 3, 5, 8, ?",
    answer: "13",
    explanation: "Each term is the sum of the two before it. This is a relationship pattern, not a fixed jump."
  },
  {
    id: "patterns-08",
    category: "patterns",
    difficulty: 8,
    question: "2, 6, 12, 20, 30, ?",
    answer: "42",
    explanation: "The differences are 4, 6, 8, 10, so the next difference is 12."
  },
  {
    id: "patterns-09",
    category: "patterns",
    difficulty: 9,
    question: "64, 32, 16, 8, ?",
    answer: "4",
    explanation: "Each term is divided by 2. Halving patterns move quickly toward smaller landmarks."
  },
  {
    id: "patterns-10",
    category: "patterns",
    difficulty: 10,
    question: "7, 10, 16, 28, 52, ?",
    answer: "100",
    explanation: "The differences are 3, 6, 12, 24, so the next difference doubles to 48."
  },
  {
    id: "flexible-multiplication-01",
    category: "flexible-multiplication",
    difficulty: 1,
    question: "14 x 15 = ?",
    answer: "210",
    explanation: "Break 15 into 10 + 5. Then 14 x 10 and 14 x 5 are easy partial products."
  },
  {
    id: "flexible-multiplication-02",
    category: "flexible-multiplication",
    difficulty: 2,
    question: "28 x 5 = ?",
    answer: "140",
    explanation: "Multiplying by 5 is half of multiplying by 10. Half of 280 is 140."
  },
  {
    id: "flexible-multiplication-03",
    category: "flexible-multiplication",
    difficulty: 3,
    question: "19 x 8 = ?",
    answer: "152",
    explanation: "Use 20 x 8 = 160, then subtract one group of 8."
  },
  {
    id: "flexible-multiplication-04",
    category: "flexible-multiplication",
    difficulty: 4,
    question: "35 x 12 = ?",
    answer: "420",
    explanation: "Use 35 x 10 plus 35 x 2. Breaking 12 into 10 and 2 keeps both parts simple."
  },
  {
    id: "flexible-multiplication-05",
    category: "flexible-multiplication",
    difficulty: 5,
    question: "48 x 25 = ?",
    answer: "1200",
    explanation: "Think of 25 as one fourth of 100. Divide 48 by 4 to get 12, then multiply by 100."
  },
  {
    id: "flexible-multiplication-06",
    category: "flexible-multiplication",
    difficulty: 6,
    question: "16 x 17 = ?",
    answer: "272",
    explanation: "Use 16 x (10 + 7). Partial products 160 and 112 combine to 272."
  },
  {
    id: "flexible-multiplication-07",
    category: "flexible-multiplication",
    difficulty: 7,
    question: "99 x 7 = ?",
    answer: "693",
    explanation: "Use 100 x 7 = 700, then subtract 7. Near-hundred compensation is efficient."
  },
  {
    id: "flexible-multiplication-08",
    category: "flexible-multiplication",
    difficulty: 8,
    question: "42 x 18 = ?",
    answer: "756",
    explanation: "Use 42 x 20, then subtract 42 x 2. It is often easier to overshoot and adjust."
  },
  {
    id: "flexible-multiplication-09",
    category: "flexible-multiplication",
    difficulty: 9,
    question: "125 x 24 = ?",
    answer: "3000",
    explanation: "Break 24 into 3 x 8. Since 125 x 8 = 1000, the product is 3 groups of 1000."
  },
  {
    id: "flexible-multiplication-10",
    category: "flexible-multiplication",
    difficulty: 10,
    question: "37 x 63 = ?",
    answer: "2331",
    explanation: "Use 37 x 60 plus 37 x 3. Place value decomposition keeps the calculation organized."
  },
  {
    id: "relationships-01",
    category: "relationships",
    difficulty: 1,
    question: "Which is larger: 5/8 or 0.6?",
    answer: "5/8|0.625",
    explanation: "5/8 equals 0.625, which is slightly greater than 0.6. Convert to a common form before comparing."
  },
  {
    id: "relationships-02",
    category: "relationships",
    difficulty: 2,
    question: "3/4 and 75% are ____.",
    answer: "equal|=",
    explanation: "3/4 means 75 out of 100, so it matches 75%. Fractions and percents can name the same amount."
  },
  {
    id: "relationships-03",
    category: "relationships",
    difficulty: 3,
    question: "Which is closer to 1: 0.98 or 1.03?",
    answer: "0.98",
    explanation: "0.98 is 0.02 away from 1, while 1.03 is 0.03 away. Compare distances from the target."
  },
  {
    id: "relationships-04",
    category: "relationships",
    difficulty: 4,
    question: "Fill in the symbol: 7 x 9 ____ 8 x 8",
    answer: "<",
    explanation: "7 x 9 is 63 and 8 x 8 is 64. Nearby products can be compared using known square facts."
  },
  {
    id: "relationships-05",
    category: "relationships",
    difficulty: 5,
    question: "Which is larger: 48 x 52 or 50 x 50?",
    answer: "50 x 50|50*50",
    explanation: "48 x 52 is 50 squared minus 2 squared, so it is 4 less than 50 x 50."
  },
  {
    id: "relationships-06",
    category: "relationships",
    difficulty: 6,
    question: "2/3 of 90 and 3/5 of 100 are ____.",
    answer: "equal|=",
    explanation: "Both expressions make 60. Different fractions can create the same amount when the wholes differ."
  },
  {
    id: "relationships-07",
    category: "relationships",
    difficulty: 7,
    question: "Which is smaller: 0.333 or 1/3?",
    answer: "0.333",
    explanation: "1/3 is 0.333 repeating, so 0.333 stops slightly short. Repeating decimals matter."
  },
  {
    id: "relationships-08",
    category: "relationships",
    difficulty: 8,
    question: "If a > b > 0, then a + 5 ____ b + 5.",
    answer: ">",
    explanation: "Adding the same amount to both numbers preserves their order."
  },
  {
    id: "relationships-09",
    category: "relationships",
    difficulty: 9,
    question: "Which has the greater unit rate: 180 km in 3 h or 250 km in 5 h?",
    answer: "180 km in 3 h|180/3|60",
    explanation: "Compare per-hour rates. 180 divided by 3 is 60, while 250 divided by 5 is 50."
  },
  {
    id: "relationships-10",
    category: "relationships",
    difficulty: 10,
    question: "Which is larger: 0.2 or 0.2 squared?",
    answer: "0.2",
    explanation: "A positive number less than 1 becomes smaller when multiplied by itself."
  },
  {
    id: "logical-reasoning-01",
    category: "logical-reasoning",
    difficulty: 1,
    question: "The sum of two even numbers is always ____.",
    answer: "even",
    explanation: "Even numbers are made of pairs. Combining two sets of pairs still leaves only complete pairs."
  },
  {
    id: "logical-reasoning-02",
    category: "logical-reasoning",
    difficulty: 2,
    question: "If a whole number ends in 0 or 5, it is divisible by ____.",
    answer: "5",
    explanation: "Multiples of 5 repeat a last-digit pattern of 0, 5, 0, 5. The last digit identifies divisibility."
  },
  {
    id: "logical-reasoning-03",
    category: "logical-reasoning",
    difficulty: 3,
    question: "Multiplying by 0.5 is the same as dividing by ____.",
    answer: "2",
    explanation: "0.5 means one half. Taking half of a number is the same as dividing it by 2."
  },
  {
    id: "logical-reasoning-04",
    category: "logical-reasoning",
    difficulty: 4,
    question: "If 3n is even, n must be ____.",
    answer: "even",
    explanation: "Multiplying by 3 does not change parity. If the product is even, the original number must already be even."
  },
  {
    id: "logical-reasoning-05",
    category: "logical-reasoning",
    difficulty: 5,
    question: "The product of two negative numbers is ____.",
    answer: "positive",
    explanation: "A negative factor reverses direction. Reversing direction twice returns to positive."
  },
  {
    id: "logical-reasoning-06",
    category: "logical-reasoning",
    difficulty: 6,
    question: "If a / b = 1 and b is not 0, then a and b are ____.",
    answer: "equal|the same",
    explanation: "A ratio of 1 means the numerator and denominator represent the same quantity."
  },
  {
    id: "logical-reasoning-07",
    category: "logical-reasoning",
    difficulty: 7,
    question: "A square number has an odd number of factors: true or false?",
    answer: "true",
    explanation: "Most factors pair up, but the square root pairs with itself only once, leaving an odd count."
  },
  {
    id: "logical-reasoning-08",
    category: "logical-reasoning",
    difficulty: 8,
    question: "A fraction with numerator greater than denominator is greater than ____.",
    answer: "1",
    explanation: "The numerator counts more parts than one whole denominator contains, so the value is above 1."
  },
  {
    id: "logical-reasoning-09",
    category: "logical-reasoning",
    difficulty: 9,
    question: "Adding the same number to both sides of an inequality keeps the direction the ____.",
    answer: "same",
    explanation: "Both values move by the same distance on the number line, so their order does not change."
  },
  {
    id: "logical-reasoning-10",
    category: "logical-reasoning",
    difficulty: 10,
    question: "If x is positive and x < 1, then x squared is ____ than x.",
    answer: "less|smaller",
    explanation: "Multiplying by a positive number less than 1 shrinks the value."
  },
  {
    id: "challenge-01",
    category: "challenge",
    difficulty: 1,
    question: "97 x 103 = ?",
    answer: "9991",
    explanation: "Use difference of squares: 100 minus 3 times 100 plus 3 equals 100 squared minus 3 squared."
  },
  {
    id: "challenge-02",
    category: "challenge",
    difficulty: 2,
    question: "1 + 2 + 3 + ... + 20 = ?",
    answer: "210",
    explanation: "Pair first and last terms: 1 + 20, 2 + 19, and so on. Ten pairs of 21 make 210."
  },
  {
    id: "challenge-03",
    category: "challenge",
    difficulty: 3,
    question: "15 squared - 14 squared = ?",
    answer: "29",
    explanation: "Use a squared minus b squared as (a - b)(a + b). Here that is 1 x 29."
  },
  {
    id: "challenge-04",
    category: "challenge",
    difficulty: 4,
    question: "999 + 998 + 997 = ?",
    answer: "2994",
    explanation: "Compare each number with 1000. The sum is 3000 minus 1 minus 2 minus 3."
  },
  {
    id: "challenge-05",
    category: "challenge",
    difficulty: 5,
    question: "A price is reduced by 20%, then reduced by 25% again. What percent of the original price remains?",
    answer: "60%|60",
    explanation: "After 20% off, 80% remains. Taking 25% off that leaves 75% of 80%, which is 60%."
  },
  {
    id: "challenge-06",
    category: "challenge",
    difficulty: 6,
    question: "2 to the 10th power = ?",
    answer: "1024",
    explanation: "Double repeatedly: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024."
  },
  {
    id: "challenge-07",
    category: "challenge",
    difficulty: 7,
    question: "A square has perimeter 48. What is its area?",
    answer: "144",
    explanation: "A square has four equal sides, so each side is 12. The area is side squared."
  },
  {
    id: "challenge-08",
    category: "challenge",
    difficulty: 8,
    question: "What is the average of 10, 20, 30, 40, and 50?",
    answer: "30",
    explanation: "The numbers are evenly spaced, so the average is the middle value."
  },
  {
    id: "challenge-09",
    category: "challenge",
    difficulty: 9,
    question: "If 6 machines make 6 items in 6 minutes, how many minutes do 12 machines need to make 12 items?",
    answer: "6",
    explanation: "Each machine makes one item in 6 minutes. With 12 machines, 12 items still take 6 minutes."
  },
  {
    id: "challenge-10",
    category: "challenge",
    difficulty: 10,
    question: "1/2 + 1/4 + 1/8 + 1/16 = ?",
    answer: "15/16|0.9375",
    explanation: "These fractions fill a whole in halves of what remains. After four terms, only 1/16 is missing."
  }
];

window.NumberSenseAcademyData = {
  modules: academyModules,
  categories: academyCategories,
  questions: questionBank
};
