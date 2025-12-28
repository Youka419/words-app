function render(filter = "") {
  list.innerHTML = "";

  const keyword = filter.toLowerCase();

  currentTerms
    .filter(t => {
      return (
        t.term.toLowerCase().includes(keyword) ||
        t.reading.toLowerCase().includes(keyword) ||
        t.definition.toLowerCase().includes(keyword) ||
        t.example.toLowerCase().includes(keyword) ||
        t.category.toLowerCase().includes(keyword)
      );
    })
    .forEach(t => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${t.term}</strong><br>
        <span style="color:#666;">${t.reading}</span><br>
        ${t.definition}<br>
        <em>${t.example}</em>
      `;
      list.appendChild(li);
    });
}  // ← ← ← ここで render を閉じるのが重要！


/* ------------------------------
   ランダム1語
------------------------------ */
async function showRandomWord() {
  const chapters = await loadAllChapters();

  // 全用語を1つの配列にまとめる
  const allTerms = chapters.flatMap(ch => ch.terms);

  // ランダムに1語選ぶ
  const random = allTerms[Math.floor(Math.random() * allTerms.length)];

  // 表示する
  const box = document.getElementById("randomWordContent");
  box.innerHTML = `
    <h3>${random.term}</h3>
    <p><strong>読み：</strong> ${random.reading || "（なし）"}</p>
    <p><strong>定義：</strong> ${random.definition || "（定義なし）"}</p>
    <p><strong>例：</strong> ${random.example || "（例文なし）"}</p>
    <button class="menu-btn vocab-btn" id="btn-next-random">次の1語</button>
  `;

  // 「次の1語」ボタンを押したらもう一度ランダム表示
  document.getElementById("btn-next-random").addEventListener("click", showRandomWord);
}


/* ------------------------------
   ボタン押したらランダム表示
------------------------------ */
document.getElementById("btn-random").addEventListener("click", () => {
  showPage("randomWordPage");
  showRandomWord();
});
