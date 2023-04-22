const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // accessToken:{
    //     type:String,
    //     // required:true
    // },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    profileImage:{
        type:String,
        // required:true
    },
    coverImage:{
        type:String,
        // required:true
    },
    dob:{
        type:String,
    },
    city:{
        type:String,
    },
    country:{
        type:String,
    },
    aboutMe:{
        type:String,
    },
    friends:{
        type:Array,
    },
    pages:{
        type:Array,
    },
    notificaions:{
        type:Array,
    },
    groups:{
        type:Array,
    },
    posts:{
        type:Array,
    },
    chats:{
        type:Array,
    },
    followers:{
        type:Array,
    },
    following:{
        type:Array,
    },
    blockedUsers:{
        type:Array,
    },
    blockedBy:{
        type:Array,
    },
    savedPosts:{
        type:Array,
    },
    savedPages:{
        type:Array,
    },
    savedGroups:{
        type:Array,
    },
    savedUsers:{
        type:Array,
    },
    savedChats:{
        type:Array,
    },
    savedNotifications:{
        type:Array,
    },
    savedMessages:{
        type:Array,
    },
    savedComments:{
        type:Array,
    },
    savedReplies:{
        type:Array,
    },
});
var accessTokenSecret = "myAccessTokenSecret1234567890";
UserSchema.methods.generateAuthToken=async function(){
    try{
        const token= jwt.sign({_id:this._id.toString()},accessTokenSecret);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
        // console.log(token);
    }catch(error)
    {
        console.log(error);
    }
}

UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
});
const User=mongoose.model("User",UserSchema);
module.exports=User;