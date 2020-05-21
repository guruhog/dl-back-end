var express = require("express");
const cors =require('cors');
var app = express();
app.use(cors());

var xlsx= require("xlsx");
var wb=xlsx.readFile("Data Lineage - Data Model.xlsx");

var ws1=wb.Sheets["DL_Info_Context_Entities"];
var ws2=wb.Sheets["DL_Entities_Dependencies"];
var ws3=wb.Sheets["DL_Entities_Attributes_Apps"];
var ws4=wb.Sheets["DL_Entities_Attributes"];
    
var arr1=xlsx.utils.sheet_to_json(ws1)
var arr2=xlsx.utils.sheet_to_json(ws2)
var arr3=xlsx.utils.sheet_to_json(ws3)
var arr4=xlsx.utils.sheet_to_json(ws4)

app.get("/:entity", (req, res,next) => {

    var entity= req.params.entity;
    var root;
    var l2;
    arr1.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            if(arrayItem.DH_Schema_Name==="HORIZON_CDB"){
                root="HORIZON";
            }
            else{
                root="DARWIN";
            }
            l2=arrayItem.DH_Schema_Name+"."+arrayItem.DH_Entity_Name
        }
    })

    var refEntity={}
    var counter=1;
    var j;
    arr2.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            refEntity[counter]=arrayItem.Referenced_DH_Schema_Name+"."+arrayItem.Referenced_DH_Entity_Name;
            counter++;
        }
    })

    console.log(refEntity);

    data={}
    var i=0;
    arr3.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            data[i]=[arrayItem.Application_User_ID,arrayItem.Application_Name]
            i++;
        }
    })

    const num=i;
    
    var tree=[{name:root,children:[{}]}]

    if(Object.keys(refEntity).length != 0)
    {
        tree[0].children[0].name="REFERENCED SCHEMA.REFERENCED ENTITY"
        tree[0].children[0].attributes={}
        for(j=1;j<=counter;j++){
            tree[0].children[0].attributes[j]=refEntity[j]
        }
        tree[0].children[0].children=[{}]
        tree[0].children[0].children[0].name=l2
        tree[0].children[0].children[0].children=[]

        const len=i-1
        var i=0
        while(i<=len){
            tree[0].children[0].children[0].children[i]={}
            tree[0].children[0].children[0].children[i].name=data[i][0]
            tree[0].children[0].children[0].children[i].children=[{name:data[i][1]}]
            i++
        }
    }
    else{
        tree[0].children[0].name=l2
        tree[0].children[0].children=[]

        const len=i-1
        var i=0
        while(i<=len){
            tree[0].children[0].children[i]={}
            tree[0].children[0].children[i].name=data[i][0]
            tree[0].children[0].children[i].children=[{name:data[i][1]}]
            i++
        }
    }
    var ouput=[];
    ouput.push(tree);
    ouput.push(num);
    console.log(tree);
    res.json(ouput);
});


app.get("/:entity/:attribute", (req, res,next) => {

    var entity=req.params.entity;
    var attribute=req.params.attribute;
    var root
    var l1;
    var l2=attribute;
    
    arr4.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            if(arrayItem.DH_Attribute_Name===attribute){
                if(arrayItem.DH_Schema_Name==="HORIZON_CDB"){
                    root="HORIZON";
                }
                else{
                    root="DARWIN";
                }
                l1=arrayItem.DH_Schema_Name+"."+arrayItem.DH_Entity_Name;
            }
        }
    })

    data={}
    var i=0;
    arr3.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            data[i]=[arrayItem.Application_User_ID,arrayItem.Application_Name]
            i++;
        }
    })

    var num=i;

    var tree=[{name:root,children:[{}]}]
    tree[0].children[0].name=l1
    tree[0].children[0].children=[{}]
    tree[0].children[0].children[0].name=l2
    tree[0].children[0].children[0].children=[]

    const len=i-1
    var i=0
    while(i<=len){
        tree[0].children[0].children[0].children[i]={}
        tree[0].children[0].children[0].children[i].name=data[i][0]
        tree[0].children[0].children[0].children[i].children=[{name:data[i][1]}]
        i++
    }


    var ouput=[];
    ouput.push(tree);
    ouput.push(num);
    console.log(tree);
    res.json(ouput);

    
}); 

app.get("/application/name=/:app", (req, res,next) => {
    var app=req.params.app;
    var root=app;
    var l1;
    var ws5=wb.Sheets["DL_Info_Context_Apps"];
    var arr5=xlsx.utils.sheet_to_json(ws5)
    
    arr5.forEach(function (arrayItem) {
        if(arrayItem.Application_Name===app){
            l1=arrayItem.Application_User_ID;
            return false;
        }
    })

    var data ={}
    arr3.forEach(function (arrayItem) {
        if(arrayItem.Application_Name===app){
            if(data[arrayItem.DH_Schema_Name]===undefined){
                data[arrayItem.DH_Schema_Name]=new Set();
                data[arrayItem.DH_Schema_Name].add(arrayItem.DH_Entity_Name);
            }
            else{
                data[arrayItem.DH_Schema_Name].add(arrayItem.DH_Entity_Name);
            }
        }
    })
   
    for(var it in data){
        data[it]=Array.from(data[it])
    }
    var tree=[{name:root,children:[{}]}]
    tree[0].children[0].name=l1
    tree[0].children[0].children=[]

    var i=0;
    for(var it in data){
        var entArr=data[it];
        tree[0].children[0].children[i]={}
        tree[0].children[0].children[i].name=it;
        tree[0].children[0].children[i].children=[];
        for(var j=0;j<entArr.length;j++){
            tree[0].children[0].children[i].children[j]={}
            tree[0].children[0].children[i].children[j].name=entArr[j]
            tree[0].children[0].children[i].children[j]._collapsed=true;
            tree[0].children[0].children[i].children[j].children=[];
            arr4.forEach(function(arrayItem){
                if(arrayItem.DH_Entity_Name===entArr[j]){
                    tree[0].children[0].children[i].children[j].children.push({"name":arrayItem.DH_Attribute_Name})
                }
            })
        }
        i++;
    }
    res.json(tree);
})

app.listen(8002, () => {
    console.log("Server running on port 8002");
});
