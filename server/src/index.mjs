import express from "express";
import dotenv from "dotenv";
import RoomRoutes from "./routes/room.mjs";
import BookingRotes from "./routes/booking.mjs";
import InvoiceRoutes from "./routes/invoice.mjs";

dotenv.config();
const app = express();

app.use(express.static(`client/public`));
app.use(express.json());
app.use("/room", RoomRoutes);
app.use("/booking", BookingRotes);
app.use("/invoice", InvoiceRoutes);

const HOST = process.env.BACKEND_HOSTNAME || "localhost";
const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});

app.get("/", (req, res) => {
	res.send("Back-end server is running");
});
