function toc() {
  var h1 = document.getElementsByTagName("h1");
  var sommaire = document.createElement("div");

  var titre = document.createElement("h1");
  sommaire.appendChild(titre);

  var ul = document.createElement("ul");
  sommaire.appendChild(ul);

  var n = 0;
  for (var el of h1) {
    el.id = el.id ? el.id : `h1${n}`;

    let li = document.createElement("li");
    li.innerHTML = `<li><a href='#${el.id}'>${el.innerHTML}</a></li>`;
    li.addEventListener("mouseover", () => {
      el.style.backgroundColor = "red";
    });

    ul.appendChild(li);
  }
  document.body.insertBefore(sommaire, document.body.firstChild);
}

toc();
