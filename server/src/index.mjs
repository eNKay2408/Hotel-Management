import express from "express";
import RoomRoutes from "./routes/room.mjs";
import BookingRotes from "./routes/booking.mjs";
import InvoiceRoutes from "./routes/invoice.mjs";
import sequelize from "./database/database.js";

const app = express();
app.use(express.json());

// testConnection.js

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

testConnection();

app.use("/room", RoomRoutes);
app.use("/booking", BookingRotes);
app.use("/invoice", InvoiceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Back-end server is running");
});
