import connection from "../database/connectSQL.mjs";

// BookingCustomer: {BookingId, CustomerId}

export default class BookingCustomerModel {
    static async getAllBookingCustomers() {
        const result = await connection
            .request()
            .query("SELECT * FROM BookingCustomer");
        return result.recordset;
    }

    static async CreateBookingCustomer(BookingId, CustomerId) {
        const result = await connection
            .request()
            .input("BookingId", BookingId)
            .input("CustomerId", CustomerId)
            .query1(`INSERT INTO BookingCustomer (BookingId, CustomerId) 
                VALUES (@BookingId, @CustomerId)`);
        return result.recordset[0];
    }

    static async UpdateBookingCustomer(
        BookingId,
        CustomerId,
        NewBookingId = null,
        NewCustomerId = null
    ) {
        try {
            let query = `UPDATE BookingCustomer SET `;
            const UpdateBookingCustomer = [];
            if (NewBookingId !== null) {
                UpdateBookingCustomer.push(`BookingId = ${NewBookingId}`);
            }
            if (NewCustomerId !== null) {
                UpdateBookingCustomer.push(`CustomerId = ${NewCustomerId}`);
            }
            if (UpdateBookingCustomer.length === 0) {
                throw new Error("No fields to update");
            }
            query += UpdateBookingCustomer.join(", ");
            query += ` WHERE BookingId = ${BookingId} AND CustomerId = ${CustomerId}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteBookingCustomer(BookingId, CustomerId) {
        const result = await connection
            .request()
            .input("BookingId", BookingId)
            .input("CustomerId", CustomerId)
            .query(
                "DELETE FROM BookingCustomer WHERE BookingId = @BookingId AND CustomerId = @CustomerId"
            );
        return result.recordset[0];
    }
}
