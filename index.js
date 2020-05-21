//Initials//
var express = require("express");
const cors =require('cors');
var app = express();
app.use(cors());




//For the first screen//
var xlsx= require("xlsx");

var wb=xlsx.readFile("Data Lineage - Data Model.xlsx");

var ws1=wb.Sheets["DL_Entities_Attributes"];
var ws2=wb.Sheets["DL_Entities_Dependencies"];
var ws3=wb.Sheets["DL_Info_Context_Apps"];
var ws4=wb.Sheets["DL_Info_Context_Entities"];

a=[]
a.push(xlsx.utils.sheet_to_json(ws1))
a.push(xlsx.utils.sheet_to_json(ws4))
a.push(xlsx.utils.sheet_to_json(ws3))

app.get("/", (req, res, next) => {
    res.json(a);
   });



//For second screen(Entity Part)//
var arr=xlsx.utils.sheet_to_json(ws4)

app.get("/:username", (req, res, next) => {
var id = req.params.username;
var result=[];
//console.log(id);
arr.forEach(function (arrayItem) {
if(arrayItem.DH_Entity_Name===id){
        result.push(arrayItem.ID);
        result.push(arrayItem.Entity_Business_Name);
        result.push(arrayItem.Entity_SOR);
        result.push(arrayItem.Business_Context);
        result.push(arrayItem.Privacy_Classification);
        result.push(arrayItem.DH_Schema_Name);
        result.push(arrayItem.DH_Entity_Name);
        result.push(arrayItem.Data_Refresh_frequency);
        result.push(arrayItem.Integration_Type);
        result.push(arrayItem.Data_Transfer_Method);
        result.push(arrayItem.DV12N_Published_Path);
        result.push(arrayItem.APIGW_Published_Service_URL);
        result.push(arrayItem.Active_Status);
        result.push(arrayItem.Source_System_UI_Mapping);
        result.push(arrayItem.Source_System_Entity_Name);
        result.push(arrayItem.Comments);
        }
    });
    res.json(result);
   });





//For the second screen(Attribute Part)//
var ws5=wb.Sheets["DL_Info_Context_Attributes"];
var arr2=xlsx.utils.sheet_to_json(ws5);
var arr3=xlsx.utils.sheet_to_json(ws1);

app.get("/:id1/:id2", (req, res, next) => {

    var id1=req.params.id1;
    var id2=req.params.id2;
    var result2=[];

    arr3.forEach(function(arrayItem) {
        if(arrayItem.DH_Attribute_Name===id1){
            if(arrayItem.DH_Entity_Name===id2){
                result2.push(arrayItem.Data_Type);
                result2.push(arrayItem.Data_Length);
                result2.push(arrayItem.Data_Precision);
            }
        }
    });

    arr2.forEach(function(arrayItem) {
        if(arrayItem.DH_Attribute_Name===id1){
            if(arrayItem.DH_Entity_Name===id2){
                result2.push(arrayItem.ID);
                result2.push(arrayItem.Attribute_Business_Name);
                result2.push(arrayItem.Business_Context);
                result2.push(arrayItem.Privacy_Classification);
                result2.push(arrayItem.DH_Schema_Name);
                result2.push(arrayItem.DH_Entity_Name);
                result2.push(arrayItem.DH_Attribute_Name);
                result2.push(arrayItem.Attribute_Sample_Values);
                result2.push(arrayItem.DV12N_Published_Path);
                result2.push(arrayItem.APIGW_Published_Service_URL);
                result2.push(arrayItem.DV12N_Published_Attribute_Name);
                result2.push(arrayItem.APIGW_Published_Attribute_Name);
                result2.push(arrayItem.Active_Status);
                result2.push(arrayItem.Source_System_UI_Mapping);
                result2.push(arrayItem.Source_System_Attribute_Name);
                result2.push(arrayItem.Comments);
            }
        }
    });
    res.json(result2);
});

//For the second screen(Application Part)//

var arr4=xlsx.utils.sheet_to_json(ws3);

app.get("/:id1/:id2/:id3", (req, res, next) =>{
    var id=req.params.id1;
    result3=[];
    console.log(id);
    arr4.forEach(function (arrayItem) {
        if(arrayItem.Application_Name===id){
            //console.log(arrayItem.Application_Name);
            result3.push(arrayItem.Application_Name);
            result3.push(arrayItem.Application_Clarity_ID);
            result3.push(arrayItem.Business_Context);
            result3.push(arrayItem.Privacy_Classification);
            result3.push(arrayItem.Application_User_ID);
            result3.push(arrayItem.Data_Refresh_frequency);
            result3.push(arrayItem.Data_Transfer_Method);
            result3.push(arrayItem.Integration_Type);
            result3.push(arrayItem.Active_Status);
            result3.push(arrayItem.Comments);
        }
    });
    res.json(result3);
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8001

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, () => {
 console.log("Listening on " + server_ip_address + ", port " + server_port);
});
