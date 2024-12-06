import connection from '../database/connectSQL.mjs';
import BookingModel from './BookingModel.mjs';

// Invoice: {InvoiceId, InvoiceDate, Amount, representative} (representative is the InvoiceId of the Customer)

export default class InvoiceModel {
  static async getAllInvoices() {
    const result = await connection.request().query('SELECT * FROM Invoice');
    return result.recordset;
  }

  static async getInvoiceInfo(InvoiceId) {
    const result = await connection.request().input('InvoiceId', InvoiceId)
      .query(`select InvoiceDate, Amount
              from invoice
              where InvoiceID = @InvoiceId

              select c.Name, c.Address
              from INVOICE i join CUSTOMER c on i.RepresentativeId = c.CustomerID
              where InvoiceID = @InvoiceId

              select r.RoomID as RoomNumber, DATEDIFF(DAY, b.BookingDate, i.InvoiceDate) as Nights,
                  rt.Price, 
                  rt.Surcharge_Rate as SurchargeRate,
                  b.Cost as Amount,
                  dbo.GetMaxCoefficient(b.BookingID) as Coefficient,
                  Greatest((dbo.CountNumberOfCustomer(b.BookingID) - (rt.Min_Customer_for_Surcharge-1)),0) as ExtraCustomers
              from BOOKING b join ROOM r on b.RoomID = r.RoomID
                      join ROOMTYPE rt on r.Type = rt.Type
                      join INVOICE i on b.InvoiceId = i.InvoiceID
              where b.InvoiceId = @InvoiceId`);

    /*
        "InvoiceDate":
        "Representative" : {Name, Address}
        "Bookings": [{RoomNumber, Nights, Price, SurchargeRate, Amount, coefficient, ExtraCustomers}]
        "Amount": Total amount of the invoice
    */
    const invoice = result.recordsets[0][0];
    const representative = result.recordsets[1][0];
    const bookings = result.recordsets[2];
    const Amount = invoice.Amount;
    return {
      InvoiceDate: invoice.InvoiceDate,
      Representative: representative,
      Bookings: bookings,
      Amount: Amount,
    };
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

    const invoiceId = result.recordset[0].InvoiceId;

    for (const booking of bookings) {
      await BookingModel.updateBooking(
        booking,
        null,
        null,
        invoiceId,
        null
      );
    }

    await connection
      .request()
      .input('InvoiceID', invoiceId)
      .query(`EXEC UpdateAllReports @InvoiceID = @InvoiceID`);
    return invoiceId;
  }

  static async DeleteInvoice(InvoiceId) {
    const result = await connection
      .request()
      .input('InvoiceId', InvoiceId)
      .query('DELETE FROM Invoice WHERE InvoiceId = @InvoiceId');
    return result.recordset[0];
  }
}
