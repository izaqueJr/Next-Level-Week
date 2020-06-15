const express = require("express");
const server = express();

// Pegar o banco de dados
const db = require("./database/db.js");

// configurar pasta pública
server.use(express.static("public"));

// habilitar o uso do req.body na aplicação

server.use(express.urlencoded({ extended: true }));

// Utilizando template engine
const nunjuks = require("nunjucks");
nunjuks.configure("src/views", {
  express: server,
  noCache: true,
});

//Abrir caminhos para a aplicação
//Página incial
server.get("/", (req, res) => {
  return res.render("index.html");
});

server.get("/create-point", (req, res) => {
  // req query: Query Strings da URL
  console.log(req.query);

  return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
  // req.body: O corpo do formulário
  // console.log(req.body);

  // inserir dados no database

  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items
   ) VALUES (? , ?, ?, ?, ?, ?, ?);
   `;

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];

  function afterInsertData(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no cadastro!");
    }

    console.log("Cadastrado com sucesso");
    console.log(this);

    return res.render("create-point.html", { saved: true });
  }

  db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {
  const search = req.query.search;

  if (search == "") {
    // pesquisa vazia
    return res.render("search-result.html", { total: 0 });
  }

  // Pegar os dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err);
    }
    console.log("Aqui estão seus registros");

    const total = rows.length;
    // console.log(rows)
    // mostrar page html com os dados do database
    return res.render("search-result.html", { places: rows, total: total });
  });
});

//ligar o servidor
server.listen(3000);
