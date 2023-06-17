const mongoose = require("mongoose");



mongoose.connect("mongodb://127.0.0.1:27017/odoList").then(()=>{
    console.log("Connected Lol");
}).catch((err)=>{
    console.log(err);
});

const itemsSchema = {
    name: String
}
const Item = mongoose.model("Item", itemsSchema);



const item1 = new Item({
    name:"Ronald"
})

const item2 = new Item({
    name: "Loujgjhgh"
});
const item3 = new Item({
    name: "Jim"
});

Item.create(item3);

//const arr = [item1,item2,item3];

//console.log(arr);

// async()=>{ await Item.insertOne(item1);}
