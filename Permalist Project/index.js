import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'


const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "achiv",
  port: 5432,
});

db.connect();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});


// adding new todo 
app.post("/add", async(req, res) => {
  const item = await req.body.newItem;
  db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});


//editing a list item if we filled wrong
app.post("/edit", async(req, res) => {
  const item = await req.body.updatedItemTitle;
  const id = await req.body.updatedItemId;
  db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
  res.redirect("/");
});


//delete after completion
app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
