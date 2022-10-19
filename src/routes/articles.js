const express = require("express");
const Article = require("../models/article");
const router = express.Router();
require('dotenv').config();

const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDN_NAME, 
  api_key: process.env.CLOUDN_API_KEY, 
  api_secret: process.env.CLOUDN_API_SECRET
});

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
router.post("/new",isAuthenticated, async (req, res) => {
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
    req.body.image = result.secure_url;
    req.body.imageId = result.public_id;
  } catch (error) {
    console.log(error);
  }

  const newArticle = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    imageURL: req.body.image,
    public_id: req.body.imageId,
  })
  await newArticle.save();
  res.redirect('/');
});


// Obtenemos el Articulo con Slug aplicado
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("show", { article: article });
});

// Ruta para renderizar el Articulo a Editar
router.get("/edit/:id",isAuthenticated, async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  res.render("edit", { article: article });
});

// Ruta para Editar el Articulo
router.put("/edit/:id",isAuthenticated, async (req, res) => {
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