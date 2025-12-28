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
}
