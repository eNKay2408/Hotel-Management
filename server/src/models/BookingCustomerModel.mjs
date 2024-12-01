import connection from '../database/connectSQL.mjs';

// BookingCustomers: {BookingId, CustomerId}

export default class BookingCustomerModel {
  static async getAllBookingCustomers() {
    const result = await connection
      .request()
      .query('SELECT * FROM BookingCustomers');
    return result.recordset;
  }

  static async CreateBookingCustomer(BookingId, CustomerId) {
    const result = await connection
      .request()
      .input('BookingId', BookingId)
      .input('CustomerId', CustomerId)
      .query(`INSERT INTO BookingCustomers (BookingId, CustomerId) 
                VALUES (@BookingId, @CustomerId)`);
    return {
      message: 'BookingCustomer created successfully',
    };
  }

  static async UpdateBookingCustomer(
    BookingId,
    CustomerId,
    NewBookingId = null,
    NewCustomerId = null
  ) {
    try {
      let query = `UPDATE BookingCustomers SET `;
      const UpdateBookingCustomer = [];
      if (NewBookingId !== null) {
        UpdateBookingCustomer.push(`BookingId = ${NewBookingId}`);
      }
      if (NewCustomerId !== null) {
        UpdateBookingCustomer.push(`CustomerId = ${NewCustomerId}`);
      }
      if (UpdateBookingCustomer.length === 0) {
        throw new Error('No fields to update');
      }
      query += UpdateBookingCustomer.join(', ');
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
      .input('BookingId', BookingId)
      .input('CustomerId', CustomerId)
      .query(
        'DELETE FROM BookingCustomers WHERE BookingId = @BookingId AND CustomerId = @CustomerId'
      );
    return result.recordset[0];
  }

  static async getCustomersInBooking(BookingId) {
    try {
      const result = await connection.request().input('BookingId', BookingId)
        .query(`SELECT c.* 
                FROM BookingCustomers bc join Customer c on bc.CustomerId = c.CustomerId
                WHERE BookingId = @BookingId`);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
