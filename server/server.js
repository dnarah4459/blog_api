require("dotenv").config();
const express = require("express"); 
const cors = require('cors');
const app = express(); 
const PORT = process.env.PORT || 3000; 
const mainRouter = require("./routes/main.js");

app.use(express.json()); 
app.use(cors());

app.use('/', mainRouter); 

app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`)
})