document.addEventListener("DOMContentLoaded", function () {
  fetch(searchJsonUrl)
    .then((response) => response.json())
    .then((data) => {
      const index = elasticlunr(function () {
        this.addField("title");
        this.addField("categories");
        this.addField("content");
        this.setRef("url");
      });

      data.forEach((doc) => {
        index.addDoc(doc);
      });

      const input = document.getElementById("search-input");
      const resultsList = document.getElementById("search-results");

      input.addEventListener("input", function () {
        const query = this.value;
        const results = index.search(query, {
          expand: true,
        });

        resultsList.innerHTML = "";

        results.forEach((result) => {
          const item = data.find((d) => d.url === result.ref);
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.innerHTML = `<a href="${item.url}">${
            item.title
          }</a><br><small>Categorias: ${item.categories.join(", ")}</small>`;
          resultsList.appendChild(li);
        });

        if (!query) {
          resultsList.innerHTML = "";
        }
      });
    });
});
