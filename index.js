const express = require("express"); //servidor a crear
const bodyParser = require("body-parser"); // transformador de un formato específico a js
const levelup = require("levelup");// donde se guardará bd
//require permite importar codigo ajeno
const app = express(); //crea express,devuelve objeto, resultado de la función express
const db = levelup("./data",{valueEncoding:'json'});

//Funcionalidad
app.use(bodyParser.urlencoded({extended:true}));//configurar body-parser
app.use(bodyParser.json());//configurar body-parser, transforma el formulario a un objeto json

//RUTA real de trabajo
const router = express.Router();//devuelve objeto router, agrego las rutas, no al app

router.get("/",(req, res) => { //ruta raiz por una funcion anónima (request, response)
	//res.send("Hello World!");  //ejecuta el mensaje
	res.json({message:"Hola soy el API de cine laboratoria"});  //ejecuta el mensaje
});

router.post("/movies",(req,res) => {
	//construir un key
	const id = req.body.nombre.toLowerCase().split(" ").join("-");
	db.put(id,req.body,(err) => {
		if(err) return res.json({message:"Hubo un error al guardar los datos"})
	});
	res.json({message:"La película se grabó con éxito"});//poner la llave, recibe 3 parametros (llave, registro, callack)
});

//TOdas las peliculas

router.get("/movies",(req,res) =>{
	let movies = [];
	db.createValueStream().on("data", (data) =>{ //Cada ves que haya data, hara un push al movie
		movies.push(data);
	}).on("end",  _ => {
		res.json(movies);
		console.log(movies);
	});
});


router.get("/movies/:id",(req,res) => {
	if(req.params.id){
		db.get(req.params.id,(err,movie) => { // : = params(objeto) , parametros del request
			if(err) return res.json({message:"Hubo un error al obtener"});
			res.json(movie);
		});
	}
});



//Se antepone al "/" previo
app.use("/api", router);
//localhost:3000/api/v1/movies

const port = process.env.PORT||3000;//environment del terminal, si no esta definido, toma 3000

//ejecita en el puerto 3000
app.listen(port, () => {
	console.log('El server esta corriendo en el '+port+'!');
})