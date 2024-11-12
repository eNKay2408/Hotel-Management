import connection from "../database/connectSQL.mjs";

// Booking: {Id, CheckInDate, RoomId, InvoiceId, Cost}

export default class BookingModel {
    static async getAllBookings() {
        const result = await connection
            .request()
            .query("SELECT * FROM Booking");
        return result.recordset;
    }

    static async getBookingInfo(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("SELECT * FROM Booking WHERE Id = @Id");
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
        Id,
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
            query += ` WHERE Id = ${Id}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteBooking(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("DELETE FROM Booking WHERE Id = @Id");
        return result.recordset[0];
    }
}
