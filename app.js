require("dotenv").config();
const express=require("express");
const app=express();
require("./db");
var formidable = require("express-formidable");
var auth=require("./middleware/auth");
app.use(formidable());
var http = require("http").createServer(app);
var bcrypt = require("bcryptjs");
var fileSystem = require("fs");
var jwt = require("jsonwebtoken");
var accessTokenSecret = "myAccessTokenSecret1234567890";
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
var socketIO = require("socket.io")(http);
var socketID = "";
var users = [];
var userModel=require("./models/user");
const { request } = require("http");
var mainURL = `http://localhost:${process.env.PORT}`;
app.use(function (request, result, next) {
	request.mainURL = mainURL
	next()
})
socketIO.on("connection", function (socket) {
	console.log("User connected", socket.id);
	socketID = socket.id;
});
http.listen(process.env.PORT,(req,res)=>{
    console.log("App running on 3000 port.");
    console.log("Server started at " + mainURL);
    app.get("/pro-versions", function (request, result) {
        result.render("proVersions");
    });
    app.get("/profileViews", function (request, result) {
        result.render("profileViews");
    });
    app.get("/", function (request, result) {
        result.render("index");
    });
    app.get("/signup", function (request, result) {
        result.render("signup");
    });
    app.post("/signup",async(request,response)=>{
        // console.log(request.fields.name);
        const {name,username,email,password,gender}=request.fields;
        try{
           const data={
                name:name,
                username:username,
                email:email,
                password:password,
                gender:gender,
           }
              const user=new userModel(data);
              const token=await user.generateAuthToken(); //model me jakar generateAuthToken function ko call kia
              response.cookie("jwt",token,{
                expires:new Date(Date.now()+300000),
                httpOnly:true,
                secure:true
            });
                await user.save();
                response.status(201).send({ message: "User Created Successfully", success: true });
        }
        catch(err){
            console.log(err);
        }
    })
    app.get("/login", function (request, result) {
        result.render("login");
    });
    app.get('/alluser',async(request,response)=>{
        // const users = userModel.find({});
        // // console.log(response.json());
        // console.log(users);
        try{
            const users = await userModel.find({});
            response.send(users);
        }
        catch(err){

        }
    })
    app.post('/login',async(request,response)=>{
        try{
const {email,password}=request.fields;
const users=await userModel.findOne({
    email:email      
});
if(users.email===email && bcrypt.compareSync(password, users.password)){
    const token=await users.generateAuthToken(); //model me jakar generateAuthToken function ko call kia
      //cookie me token ko save kia

      response.cookie("jwt",token,{
          expires:new Date(Date.now()+300000),
          httpOnly:true,
          secure:true
      });

      await users.save();
      var accessToken=jwt.sign({email:email},accessTokenSecret);
        console.log(accessToken);
        console.log(token);
      console.log(("Logged In"));
      response.status(201).send({ message: "Successfully Logged In", success: true });

}
else{
    response.send('error');
}
}catch(error)
{
    response.status(400).send(error);
    console.log(error);
}
    })
    app.get("/user/:username",async(request,response)=>{
        console.log(request.params.username);
        try{
            const user=await userModel.findOne({
                username:request.params.username
            });
            if(user==null){
                console.log("No Such User");
            }
            else{
                console.log(user);
                // response.send(user);
                response.render("userProfile",{user:user});
    
            }
            
        }catch(err){
            console.log(err);
        }
    })
    app.get("/updateProfile", function (request, result) {
        result.render("updateProfile");
    });
    app.get("/logout", function (request, result) {
        result.redirect("/login");
    });
    app.get("/search:query",async(request,response)=>{
        var query=request.params.query;
        console.log(query);
        response.send(query);
        // response.render("search",{
        //     query:query
        // });
    })
    app.get("/search",(request,response)=>{
        response.send("Search");
    })
    // app.post("/search",async(request,response)=>{
    //     var query=request.fields.query;
    //     var users=await userModel.find({
    //         name:{$regex:query,$options:"i"}
    //     });
    //     response.render("search",{
    //         users:users
    //     });
    // })
    app.get("/friends", function (request, result) {
        result.render("friends");
    });
    app.get("/inbox", function (request, result) {
        result.render("inbox");
    });

    app.get("/pages", function (request, result) {
        result.render("pages");
    });

    app.get("/groups", function (request, result) {
        result.render("groups");
    });

    app.get("/notifications", function (request, result) {
        result.render("notifications");
    });

    // <-----------------UPLOAD COVER PHOTO_------------------->
    // app.post("uploadCoverPhoto",auth,async(request,response)=>{
    //     // var accessToken = request.fields.accessToken;
	// 	var coverPhoto = "";
    //     try{
    //         if(request.files.coverImage.size>0 && request.files.coverImage.type.includes("image")){
    //             coverPhoto = request.files.coverImage.path;
    //             var coverPhotoPath = "public/images/coverPhotos/" + request.fields.username + ".jpg";
    //             fileSystem.rename(coverPhoto, coverPhotoPath, function (err) {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //             });
    //             var user = await userModel.findOne({
    //                 username: request.fields.username
    //             });
    //             user.coverPhoto = coverPhotoPath;
    //             await user.save();
    //             response.send({ message: "Cover Photo Uploaded Successfully", success: true });
    //         }
           
    //     }
    //     catch(err){
    //         console.log(err);
    //     }

    // })
})