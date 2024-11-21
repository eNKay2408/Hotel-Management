import connection from '../database/connectSQL.mjs';
import BookingModel from './BookingModel.mjs';

// Invoice: {InvoiceId, InvoiceDate, Amount, representative} (representative is the InvoiceId of the Customer)

export default class InvoiceModel {
  static async getAllInvoices() {
    const result = await connection.request().query('SELECT * FROM Invoice');
    return result.recordset;
  }

  static async getInvoiceInfo(InvoiceId) {
    const result = await connection
      .request()
      .input('InvoiceId', InvoiceId)
      .query('SELECT * FROM Invoice WHERE InvoiceId = @InvoiceId');
    return result.recordset[0];
  }

  static async CreateInvoice(bookings, representativeId) {
    let Amount = 0;
    for (const booking of bookings) {
      Amount += await BookingModel.CalcCost(booking);
    }

    // get current date
    const getCheckOutDate = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };
    const InvoiceDate = getCheckOutDate();

    const result = await connection
      .request()
      .input('InvoiceDate', InvoiceDate)
      .input('Amount', Amount)
      .input('representative', representativeId)
      .query(`INSERT INTO Invoice (InvoiceDate, Amount, representativeId) 
                VALUES (@InvoiceDate, @Amount, @representative)
              select top 1 InvoiceId from Invoice order by InvoiceId desc`);

    for (const booking of bookings) {
      await BookingModel.updateBooking(
        booking,
        null,
        null,
        result.recordset[0].InvoiceId,
        null
      );
    }
    return result.recordset[0].InvoiceId;
  }

  static async UpdateInvoice(
    InvoiceId,
    InvoiceDate = null,
    Amount = null,
    representative = null
  ) {
    try {
      let query = `UPDATE Invoice SET `;
      const UpdateInvoice = [];
      if (InvoiceDate !== null) {
        UpdateInvoice.push(`InvoiceDate = ${InvoiceDate}`);
      }
      if (Amount !== null) {
        UpdateInvoice.push(`Amount = ${Amount}`);
      }
      if (representative !== null) {
        UpdateInvoice.push(`representative = ${representative}`);
      }
      if (UpdateInvoice.length === 0) {
        throw new Error('No fields to update');
      }
      query += UpdateInvoice.join(', ');
      query += ` WHERE InvoiceId = ${InvoiceId}`;
      const result = await connection.request().query(query);
      return result.recordset[0];
    } catch (error) {
      console.log(error);
    }
  }

  static async DeleteInvoice(InvoiceId) {
    const result = await connection
      .request()
      .input('InvoiceId', InvoiceId)
      .query('DELETE FROM Invoice WHERE InvoiceId = @InvoiceId');
    return result.recordset[0];
  }
}
