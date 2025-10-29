import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

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

// Swagger Configuración

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZodiacoAPI",
      version: "1.0.0",
      description:
        "API REST que permite consultar información de los Caballeros del Zodiaco.",
    },
    servers: [
      {
        url: "https://backend-caballeros.onrender.com",
        description: "Servidor en la nube",
      }
    ],
  },
  apis: ["./server.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoints

/**
 * @openapi
 * /caballeros:
 *   get:
 *     summary: Obtiene todos los caballeros
 *     tags:
 *       - Caballeros
 *     responses:
 *       200:
 *         description: Lista de caballeros recuperada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caballero'
 */
app.get("/caballeros", async (req, res) => {
  try {
    const data = await Caballero.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los caballeros" });
  }
});

/**
 * @openapi
 * /caballeros/{nombre}:
 *   get:
 *     summary: Obtiene un caballero por su nombre
 *     tags:
 *       - Caballeros
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del caballero
 *     responses:
 *       200:
 *         description: Caballero encontrado.
 *       404:
 *         description: Caballero no encontrado.
 */
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
  console.log(`Servidor ejecutándose en https://backend-caballeros.onrender.com`);
});
