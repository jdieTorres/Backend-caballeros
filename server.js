import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoAtlas
mongoose
  .connect("mongodb+srv://admin:JpassD2810*@cluster0.3huu0up.mongodb.net/caballerosZodiaco", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Esquema de caballeros
const caballeroSchema = new mongoose.Schema({
  nombre: String,
  constelacion: String,
  nivel: String,
  ataquePrincipal: String,
  edad: Number,
  pais: String,
});

// Modelo
const Caballero = mongoose.model("Caballero", caballeroSchema, "caballeros");

// Rutas del microservicio

app.get("/caballeros", async (req, res) => {
  try {
    const data = await Caballero.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los caballeros" });
  }
});

app.get("/caballeros/:nombre", async (req, res) => {
  try {
    const nombreBuscado = req.params.nombre;
    const caballero = await Caballero.findOne({
      nombre: new RegExp(`^${nombreBuscado}$`, "i"), // insensible a mayúsculas
    });

    if (!caballero) {
      return res.status(404).json({ mensaje: "Caballero no encontrado" });
    }

    res.json(caballero);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar el caballero" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`⚡ Servidor ejecutándose en http://localhost:${PORT}`);
});
