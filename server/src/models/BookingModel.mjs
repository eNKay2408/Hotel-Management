import connection from '../database/connectSQL.mjs';

// Booking: {BookingId, BookingDate, RoomId, InvoiceId, Cost}

export default class BookingModel {
  static async getAllBookings() {
    const result = await connection.request().query('SELECT * FROM Booking');
    return result.recordset;
  }

  static async getBookingInfo(BookingId) {
    const result = await connection
      .request()
      .input('BookingId', BookingId)
      .query('SELECT * FROM Booking WHERE BookingId = @BookingId');
    return result.recordset[0];
  }

  static async createBooking(BookingDate, RoomId) {
    try {
      const result = await connection
        .request()
        .input('BookingDate', BookingDate)
        .input('RoomId', RoomId)
        .query(`INSERT INTO Booking (BookingDate, RoomId) 
                  VALUES (@BookingDate, @RoomId)`);
      return {
        message: 'Booking created successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateBooking(
    BookingId,
    BookingDate = null,
    RoomId = null,
    InvoiceId = null,
    Cost = null
  ) {
    try {
      let query = `UPDATE Booking SET `;
      const UpdateBooking = [];
      if (BookingDate !== null) {
        UpdateBooking.push('BookingDate = @BookingDate');
      }
      if (RoomId !== null) {
        UpdateBooking.push('RoomId = @RoomId');
      }
      if (InvoiceId !== null) {
        UpdateBooking.push('InvoiceId = @InvoiceId');
      }
      if (Cost !== null) {
        UpdateBooking.push('Cost = @Cost');
      }
      query += UpdateBooking.join(', ') + ` WHERE BookingId = @BookingId`;
      const result = await connection
        .request()
        .input('BookingId', BookingId)
        .input('BookingDate', BookingDate)
        .input('RoomId', RoomId)
        .input('InvoiceId', InvoiceId)
        .input('Cost', Cost)
        .query(query);
      return {
        message: 'Booking updated successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async DeleteBooking(BookingId) {
    try {
      const result = await connection
        .request()
        .input('BookingId', BookingId)
        .query('DELETE FROM Booking WHERE BookingId = @BookingId');
      return {
        message: 'Booking deleted successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getTheNewestBookingId() {
    const result = connection
      .request()
      .query('SELECT TOP 1 BookingId FROM Booking ORDER BY BookingId DESC');
    return result.recordset;
  }
}
