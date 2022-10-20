const express = require("express");
const Article = require("../models/article");
const router = express.Router();
require('dotenv').config();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

const fs = require("fs");

// Ruta principal Home
router.get('/', async(req, res)=>{
  const articles = await Article.find().sort({
      createAt: "desc"
  })
  res.render('index.ejs', {articles: articles})
})

// ruta para renderizar el formulario de creacion de articulos
router.get("/new",isAuthenticated, (req, res) => {
  res.render("new", { article: new Article() });
});

// ruta para postear los articulos
router.post("/new",upload.single('image'), async (req, res) => {
  console.log(req.file);
  const options = {
    folder: "blog",
    use_filename: true,
    unique_filename: false,
    overwrite: true
  };
  try {
    const result = await cloudinary.uploader.upload(req.file.path, options);
    fs.unlinkSync(req.file.path);
    console.log(result);

    const newArticle = new Article({
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown,
      imageURL: result.secure_url,
      public_id: result.public_id,
    })
    await newArticle.save();
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});


// Obtenemos el Articulo con Slug aplicado
router.get("/:slug", async (req, res) => {
  const articles = await Article.find().sort({
    slug: "asc",
  });
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("show", { article: article, articles: articles });
});

// Ruta para renderizar el Articulo a Editar
router.get("/edit/:id",isAuthenticated, async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  res.render("edit", { article: article });
});

// Ruta para Editar el Articulo
router.put("/edit/:id",upload.single('image'), async (req, res) => {
  req.article = await Article.findById(req.params.id);
  let article = req.article;
  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  if (req.file) {
    try {

      await cloudinary.uploader.destroy(article.public_id);

      const result = await cloudinary.uploader.upload(req.file.path);
      article.imageURL = result.secure_url;
      article.public_id = result.public_id;
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.log(error);
    }
  }

  try {
    article = await article.save();
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

  // Eliminar Articulo x ID
  router.delete('/:id',isAuthenticated, async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
  })

  function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;