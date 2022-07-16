require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const taskRouter = require("./routes/route");
const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.disable('x-powered-by')

app.use(express.urlencoded());

app.use(express.json())

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
			{
				url: "https://oyester-gamma.vercel.app"
			}
		],
	}, 
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);



app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/",taskRouter)

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.mongo).then(() => {
    app.listen(PORT, () => {
        console.log("listening at port "+PORT);
    })
}).catch(
  (e)=>{ 
    console.log(e);
  }
)  