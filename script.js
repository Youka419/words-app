/* ------------------------------
   画面切り替え
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
   JSON読み込み
------------------------------ */
async function loadAllChapters() {
  const all = [];
  for (const file of chapterFiles) {
    try {
      const res = await fetch(file);
      const json = await res.json();
      all.push(json);
    } catch (e) {
      console.error("読み込み失敗:", file, e);
    }
  }
  return all;
}

/* ------------------------------
   用語一覧を表示
------------------------------ */
function showTerms(chapterIndex, chapterData) {
  showPage("termList");

  document.getElementById("termListTitle").textContent =
    `第${chapterIndex + 1}章：${chapterData.chapter_title}`;

  const termButtons = document.getElementById("termButtons");
  termButtons.innerHTML = "";

  chapterData.terms.forEach(term => {
    const btn = document.createElement("button");
    btn.className = "menu-btn vocab-btn";
    btn.textContent = term.term;

    btn.addEventListener("click", () => showTermDetail(term));

    termButtons.appendChild(btn);
  });
}

/* ------------------------------
   用語詳細
------------------------------ */
function showTermDetail(term) {
  showPage("termDetail");

  document.getElementById("detailTerm").textContent = term.term;
  document.getElementById("detailReading").textContent = term.reading || "（なし）";
  document.getElementById("detailDefinition").textContent = term.definition || "（定義なし）";
  document.getElementById("detailExample").textContent = term.example || "（例文なし）";
}

/* ------------------------------
   ランダム1語
------------------------------ */
async function showRandomWord() {
  const chapters = await loadAllChapters();
  const allTerms = chapters.flatMap(ch => ch.terms);

  if (allTerms.length === 0) {
    document.getElementById("randomWordContent").innerHTML =
      "語彙データが読み込めませんでした。";
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

  document.getElementById("btn-next-random")
    .addEventListener("click", showRandomWord);
}

/* ------------------------------
   ページ読み込み後の初期化
------------------------------ */
window.addEventListener("DOMContentLoaded", async () => {

  // 章一覧ボタン
  document.getElementById("btn-chapters")
    .addEventListener("click", () => showPage("chapterList"));

  // ランダム1語
  document.getElementById("btn-random")
    .addEventListener("click", () => {
      showPage("randomWordPage");
      showRandomWord();
    });

  // 章一覧生成
  const chapters = await loadAllChapters();
  const chapterButtons = document.getElementById("chapterButtons");

  chapters.forEach((chapter, index) => {
    const btn = document.createElement("button");
    btn.className = "menu-btn vocab-btn";
    btn.textContent = `第${index + 1}章：${chapter.chapter_title}`;

    btn.addEventListener("click", () => showTerms(index, chapter));

    chapterButtons.appendChild(btn);
  });
});
