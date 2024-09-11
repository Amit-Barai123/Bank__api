import express from 'express';
import connectDB from './dbconnection/connectdb.js';
import userRoutes from './routes/userRoutes.js';
import cors from "cors";
connectDB();
const app = express();
app.use(cors());


app.use(express.json());

app.use("/api", userRoutes);


app.get('/', (req, res) => {
    res.send("This is the new server");
});

const port = 1234;

app.listen(port, () => {
    console.log('Server has started on port', port);
});
