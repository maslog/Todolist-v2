const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const dataBase = "todoListDB";
const _ = require("lodash");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


var newItem = ["Buy Food", "Cook Food", "Eat Food"];
var workItem = [];

mongoose.connect(`mongodb+srv://ronaldmaslog5:Hatdog123@maslog.du0i4yl.mongodb.net/${dataBase}`, { useNewUrlParser: true });
mongoose.set('strictQuery', false);


const itemsSchema = new mongoose.Schema({
    name: String
});



const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist"
});

const item2 = new Item({
    name: "Hit the + button to add new Item"
});

const item3 = new Item({
    name: "<--- Hit this to delete Item>"
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
    name: String,
    item: [itemsSchema]
});

const List = new mongoose.model("List", listSchema);




// Item.insertMany(defaultItems).then(()=>{
//     console.log("Inserted");
// }).catch((err)=>{
//     console.log(err);
// });
// // Item.insertMany(docArrs);
// Item.create(item1);

app.get("/", async function (req, res) {


    const data = await Item.find();

    if (data.length === 0) {
        Item.insertMany(defaultItems);
        res.redirect("/");
    } else {
        res.render("list", { listTitle: "Today", NewItem: data });
    }


});


app.post("/", async function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    //console.log(req.body);

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        const foundList = await List.findOne({ name: listName });

        foundList.item.push(item);
        foundList.save();
        res.redirect('/' + listName);
    }





});

app.post("/delete", async (req, res) => {
    const deleteItem = req.body.deleteItem;
    const listName = req.body.listName;
    // const day = date.getDate();

    console.log(deleteItem);
    console.log(listName);

    if (listName === "Today") {
        await Item.findByIdAndRemove(deleteItem);
        console.log("Item");
        res.redirect("/");
    } else {


        await List.findOneAndUpdate({ name: listName }, { $pull: { item: { _id: deleteItem } } });



        console.log("list");
        res.redirect("/" + listName);

    }



});

app.get("/:customListName", async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    const list = await List.findOne({ name: customListName });
    // console.log(list);

    //await List.create({name:customListName, item: defaultItems});

    if (list === null) {


        await List.create({ name: customListName, item: defaultItems });

        //res.render("List", {listTitle: customListName, NewItem: list});
        res.redirect("/" + customListName);

    } else {

        res.render("list", { listTitle: list.name, NewItem: list.item });




    }


});

// app.get("/work", function (req, res) {

//     res.render("list", { listTitle: "Work List", NewItem: workItem })


// });

// app.get("/about", function (req, res) {

//     res.render("about", { listTitle: "Work List", NewItem: workItem })


// });




app.listen("3000", function () {
    console.log("The Server is running on port 3000");

});