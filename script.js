// グローバルに保持する章データ
let allChapters = [];

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

  const target = document.getElementById(pageId);
  if (target) target.classList.remove("hidden");
}

window.showPage = showPage;

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
  if (allChapters.length > 0) return allChapters;

  const loaded = [];
  for (const file of chapterFiles) {
    try {
      const res = await fetch(file);
      const json = await res.json();
      loaded.push(json);
    } catch (e) {
      console.error("読み込み失敗:", file, e);
    }
  }
  allChapters = loaded;
  return allChapters;
}

/* ------------------------------
   章一覧を再生成する（重要）
------------------------------ */
async function renderChapterList() {
  const chapters = await loadAllChapters();
  const chapterButtons = document.getElementById("chapterButtons");

  chapterButtons.innerHTML = ""; // ← まず空にする

  chapters.forEach((chapter, index) => {
    const btn = document.createElement("button");
    btn.className = "menu-btn vocab-btn";
    btn.textContent = `第${index + 1}章：${chapter.chapter_title}`;

    btn.addEventListener("click", () => showTerms(index, chapter));

    chapterButtons.appendChild(btn);
  });
}

/* ------------------------------
   用語一覧を表示
------------------------------ */
function showTerms(chapterIndex, chapterData) {
  showPage("termList");

  const title = document.getElementById("termListTitle");
  const termButtons = document.getElementById("termButtons");
  if (!title || !termButtons) return;

  title.textContent = `第${chapterIndex + 1}章：${chapterData.chapter_title}`;
  termButtons.innerHTML = "";

  chapterData.terms.forEach(term => {
    const btn = document.createElement("button");
    btn.className = "menu-btn vocab-btn";
    btn.textContent = term.term;

    btn.addEventListener("click", () => showTermDetail(term));

    termButtons.appendChild(btn);
  });
}

window.showTerms = showTerms;

/* ------------------------------
   用語詳細を表示
------------------------------ */
function showTermDetail(term) {
  showPage("termDetail");

  document.getElementById("detailTerm").textContent = term.term;
  document.getElementById("detailReading").textContent = term.reading || "（なし）";
  document.getElementById("detailDefinition").textContent = term.definition || "（定義なし）";
  document.getElementById("detailExample").textContent = term.example || "（例文なし）";
}

window.showTermDetail = showTermDetail;

/* ------------------------------
   ランダム1語
------------------------------ */
async function showRandomWord() {
  const chapters = await loadAllChapters();
  const allTerms = chapters.flatMap(ch => ch.terms);

  const box = document.getElementById("randomWordContent");
  if (!box) return;

  if (allTerms.length === 0) {
    box.innerHTML = "語彙データが読み込めませんでした。";
    return;
  }

  const random = allTerms[Math.floor(Math.random() * allTerms.length)];

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
   今日の10語
------------------------------ */
async function showTodayWords() {
  const chapters = await loadAllChapters();
  const allTerms = chapters.flatMap(ch => ch.terms);

  const box = document.getElementById("todayWordsContent");
  if (!box) return;

  if (allTerms.length === 0) {
    box.innerHTML = "語彙データが読み込めませんでした。";
    return;
  }

  // ランダムに10語選ぶ
  const shuffled = [...allTerms].sort(() => Math.random() - 0.5);
  const today10 = shuffled.slice(0, 10);

  // 表示
  box.innerHTML = today10
    .map(term => `
      <div class="today-item">
        <h3>${term.term}</h3>
        <p><strong>読み：</strong> ${term.reading || "（なし）"}</p>
        <p><strong>定義：</strong> ${term.definition || "（定義なし）"}</p>
        <p><strong>例：</strong> ${term.example || "（例文なし）"}</p>
      </div>
      <hr>
    `)
    .join("");

  // 次の10語ボタン
  box.innerHTML += `
    <button class="menu-btn vocab-btn" id="btn-next-today10">次の10語</button>
  `;

  document.getElementById("btn-next-today10")
    .addEventListener("click", showTodayWords);
}

/* ------------------------------
   初期化
------------------------------ */
window.addEventListener("DOMContentLoaded", async () => {

  // 章一覧（用語集）
  const btnChapters = document.getElementById("btn-chapters");
  if (btnChapters) {
    btnChapters.addEventListener("click", () => {
      renderChapterList();
      showPage("chapterList");
    });
  }

  // ランダム1語
  const btnRandom = document.getElementById("btn-random");
  if (btnRandom) {
    btnRandom.addEventListener("click", () => {
      showPage("randomWordPage");
      showRandomWord();
    });
  }

  // 今日の10語
  const btnToday10 = document.getElementById("btn-today10");
  if (btnToday10) {
    btnToday10.addEventListener("click", () => {
      showPage("todayWordsPage");
      showTodayWords();
    });
  }

  // 戻る：章一覧に戻る
  const btnBackChapters = document.getElementById("btn-back-chapters");
  if (btnBackChapters) {
    btnBackChapters.addEventListener("click", () => {
      renderChapterList();
      showPage("chapterList");
    });
  }

  // 戻る：ホーム
  const btnHome = document.getElementById("btn-home");
  if (btnHome) btnHome.addEventListener("click", () => showPage("topPage"));

  const btnTermHome = document.getElementById("btn-term-home");
  if (btnTermHome) btnTermHome.addEventListener("click", () => showPage("topPage"));

  const btnDetailHome = document.getElementById("btn-detail-home");
  if (btnDetailHome) btnDetailHome.addEventListener("click", () => showPage("topPage"));

  const btnDetailBack = document.getElementById("btn-detail-back");
  if (btnDetailBack) btnDetailBack.addEventListener("click", () => showPage("termList"));

  // 初回だけ章一覧を生成
  await renderChapterList();
});
