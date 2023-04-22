const mongoose=require ('mongoose')
const DB="mongodb+srv://ameynaik09:amey123@cluster0.ivzmoqi.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
mongoose
.connect(DB,{
 useNewUrlParser: true,
// useUnifiedToplogy:true,
// useCreateIndex:true
})
.then(() => {
console.log('connected to db');
 })
.catch((err) => {
console.log(err.message);
 });