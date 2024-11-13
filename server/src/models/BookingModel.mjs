import connection from "../database/connectSQL.mjs";

// Booking: {BookingId, CheckInDate, RoomId, InvoiceId, Cost}

export default class BookingModel {
    static async getAllBookings() {
        const result = await connection
            .request()
            .query("SELECT * FROM Booking");
        return result.recordset;
    }

    static async getBookingInfo(BookingId) {
        const result = await connection
            .request()
            .input("BookingId", BookingId)
            .query("SELECT * FROM Booking WHERE BookingId = @BookingId");
        return result.recordset[0];
    }

    static async CreateBooking(CheckInDate, RoomId) {
        const result = await connection
            .request()
            .input("CheckInDate", CheckInDate)
            .input("RoomId", RoomId)
            .query1(`INSERT INTO Booking (CheckInDate, RoomId) 
                VALUES (@CheckInDate, @RoomId)`);
        return result.recordset[0];
    }

    static async UpdateBooking(
        BookingId,
        CheckInDate = null,
        RoomId = null,
        InvoiceId = null,
        Cost = null
    ) {
        try {
            let query = `UPDATE Booking SET `;
            const UpdateBooking = [];
            if (CheckInDate !== null) {
                UpdateBooking.push(`CheckInDate = ${CheckInDate}`);
            }
            if (RoomId !== null) {
                UpdateBooking.push(`RoomId = ${RoomId}`);
            }
            if (InvoiceId !== null) {
                UpdateBooking.push(`InvoiceId = ${InvoiceId}`);
            }
            if (Cost !== null) {
                UpdateBooking.push(`Cost = ${Cost}`);
            }
            if (UpdateBooking.length === 0) {
                throw new Error("No fields to update");
            }
            query += UpdateBooking.join(", ");
            query += ` WHERE BookingId = ${BookingId}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteBooking(BookingId) {
        const result = await connection
            .request()
            .input("BookingId", BookingId)
            .query("DELETE FROM Booking WHERE BookingId = @BookingId");
        return result.recordset[0];
    }
}
