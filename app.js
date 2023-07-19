const mongoose = require("mongoose");
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { Long } = require("mongodb");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const mongoDBurl = "yourURL"
mongoose.connect(mongoDBurl,{ useNewUrlParser: true } );

const wikiSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Article = mongoose.model("Article",wikiSchema);

///////////////////////////////////GET ALL ARTICLES ///////////////////////////////////


app.route("/articles")
    .get(function(req,res){
        Article.find({}).then((foundArticles) => {
            res.send(foundArticles);
        })
        .catch((error) => {
            console.error('Error performing operations:', error);
            mongoose.connection.close();
        });
    })
    .post(function(req,res){
        const newArticle = new Article ({
            title:req.body.title,
            content:req.body.content
        });

        newArticle.save().then(() => {
            res.send("Success");
        }).catch((err) => {
            res.send("ERROR");
        });
    })
    .delete(function(req,res){
        Article.deleteMany({}).then(() => {
            res.send("Successfully deleted all items");
        })
        .catch( (err) =>{
            res.send("ERROR");
        } )
    });

//////////////////////////////////GET A SPECIFIC ARTICLES ///////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then((foundArticles) => {
        if (foundArticles){
            res.send(foundArticles);
        }
        else{
            res.send("No Articles found with the matching title.");
        }
    })
    .catch((err) => {
        res.send("ERROR!");
    })
})
.put(function(req,res){
    Article.replaceOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content}).then(()=>{
        res.send("Succesfully ");
    })
    .catch((err) => {
        res.send(err);
    })
})
.patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle},{$set : req.body}).then( () => {
        res.send("Succesfull");
    })
    .catch((err) => {
        res.send(err);
    })
})
.delete(function(req,res){
    Article.findOneAndDelete({title:req.params.articleTitle}).then(()=>{
        res.send("deleted succesfully");
    })
    .catch((err) => {
        res.send(err);
    })
})






app.listen(process.env.PORT || 3000,function(){
    console.log("Server is up at 3000");
})

