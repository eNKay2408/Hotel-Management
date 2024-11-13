import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import RoomRoutes from './routes/room.mjs';
import BookingRotes from './routes/booking.mjs';
import InvoiceRoutes from './routes/invoice.mjs';
import RoomTypeRoutes from './routes/roomType.mjs';
import connection from './database/connectSQL.mjs';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.static(`client/public`));
app.use(express.json());

connection
  .connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch((err) => {
    console.log('Error connecting to SQL Server', err);
  });

app.use('/api/rooms', RoomRoutes);
app.use('/api/bookings', BookingRotes);
app.use('/api/invoices', InvoiceRoutes);
app.use('/api/RoomTypes', RoomTypeRoutes);

const HOST = process.env.BACKEND_HOSTNAME || 'localhost';
const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Back-end server is running');
});
