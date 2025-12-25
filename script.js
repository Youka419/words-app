fetch("words.json")
  .then(res => res.json())
  .then(words => {
    const list = document.getElementById("list");
    const search = document.getElementById("search");

    function render(filter = "") {
      list.innerHTML = "";
      Object.keys(words)
        .filter(k => k.includes(filter))
        .forEach(k => {
          const li = document.createElement("li");
          li.textContent = `${k}: ${words[k]}`;
          list.appendChild(li);
        });
    }

    search.addEventListener("input", e => render(e.target.value));
    render();
  });
