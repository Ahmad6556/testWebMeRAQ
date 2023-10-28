const express = require('express')
const app = express()
app.use(express.static('public'))
const Article = require("./models/articleSchema");
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
app.set('view engine', 'ejs')

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Ahmad_RAQ:123raq@first.cqjf4wk.mongodb.net/?retryWrites=true&w=majority")
    .then(result => {
        app.listen(port, () => {
            console.log(`Example app listening http://localhost:${port}/`)
        })
    })
    .catch(err => {
        console.log(err);
    });




app.get("/", (req, res) => {
    // res.render("index", { mytitle: "HOME" });

    // result = Array of objects inside mongo database

    Article.find()
        .then((result) => {
            res.render("index", { arrArticle: result });
        })
        .catch((err) => {
            console.log(err);
        });
});


app.get('/add', (req, res) => {
    res.render('add')
})

app.post("/add", (req, res) => {
    const article = new RAQ(req.body);

    //console.log(req.body);

    article
        .save()
        .then(result => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
});



app.get("/data/:id", (req, res) => {
    // result =   object  inside mongo database

    Article.findById(req.params.id)
        .then((result) => {
            res.render("data", { objArticle: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete("/data/:id", (req,res) => {
    Article.findByIdAndDelete(req.params.id)
    .then((params) => { res.redirect('/') })
    .catch((err) => {console.log(err)}); 
})

app.get("/data/edit/:id", (req, res) => {
    Article.findById(req.params.id)
        .then((result) => {
            res.render("edit", { item: result });
        })
        .catch((err) => {
            console.log(err);
        });
});


app.post("/data/edit/:id", (req, res) => {
    const article = updateOne(RAQ(req.params.id));

    Article.findByIdAndUpdate(req.params.id)
        .save()
        .then(result => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/", (req, res) => {
    const article = new Article(req.body);

    // console.log(req.body)

    article
        .save()
        .then((result) => {
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        });
});



//  404
app.use((req, res) => {
    res.status(404).redirect('/');
});
