/* ------------------------------
   JSONファイル一覧
------------------------------ */
const chapterFiles = [
  "data/01_ai.json",
  "data/02_trends.json",
  "data/03_machine_learning.json",
  "data/04_deep_learning.json",
  "data/05_dl_components.json",
  "data/06_dl_applications.json",
  "data/07_ai_social_implementation.json",
  "data/08_math_statistics.json",
  "data/09_ai_law_contract.json",
  "data/10_ai_ethics_governance.json"
];

/* ------------------------------
   JSONを全部読み込む
------------------------------ */
async function loadAllChapters() {
  const allChapters = [];
  for (const file of chapterFiles) {
    try {
      const response = await fetch(file);
      const json = await response.json();
      allChapters.push(json);
    } catch (err) {
      console.error("読み込み失敗:", file, err);
    }
  }
  return allChapters;
}

/* ------------------------------
   ランダム1語を表示
------------------------------ */
async function showRandomWord() {
  const chapters = await loadAllChapters();
  const allTerms = chapters.flatMap(ch => ch.terms);

  if (allTerms.length === 0) {
    document.getElementById("randomWordContent").innerHTML = "語彙データが読み込めませんでした。";
    return;
  }

  const random = allTerms[Math.floor(Math.random() * allTerms.length)];

  const box = document.getElementById("randomWordContent");
  box.innerHTML = `
    <h3>${random.term}</h3>
    <p><strong>読み：</strong> ${random.reading || "（なし）"}</p>
    <p><strong>定義：</strong> ${random.definition || "（定義なし）"}</p>
    <p><strong>例：</strong> ${random.example || "（例文なし）"}</p>
    <button class="menu-btn vocab-btn" id="btn-next-random">次の1語</button>
  `;

  document.getElementById("btn-next-random").addEventListener("click", showRandomWord);
}

/* ------------------------------
   ページ切り替え
------------------------------ */
function showPage(pageId) {
  const pages = [
    "topPage",
    "randomWordPage",
    "todayWordsPage",
    "miniTestPage",
    "weakWordsPage",
    "chapterList",
    "termList",
    "termDetail"
  ];

  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  document.getElementById(pageId).classList.remove("hidden");
}

/* ------------------------------
   ページ読み込み後にイベント登録
------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-random").addEventListener("click", () => {
    showPage("randomWordPage");
    showRandomWord();
  });
});
