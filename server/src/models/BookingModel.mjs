import connection from '../database/connectSQL.mjs';

// Booking: {BookingId, CheckInDate, RoomId, InvoiceId, Cost}

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

  static async CreateBooking(CheckInDate, RoomId) {
    try {
      const result = await connection
        .request()
        .input('CheckInDate', CheckInDate)
        .input('RoomId', RoomId)
        .query1(`INSERT INTO Booking (CheckInDate, RoomId) 
                  VALUES (@CheckInDate, @RoomId)`);
      return {
        message: 'Booking created successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
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
        UpdateBooking.push('CheckInDate = @CheckInDate');
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
        .input('CheckInDate', CheckInDate)
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
}
