import connection from "../database/connectSQL.mjs";

// Invoice: {InvoiceId, CheckOutDate, Amount, representative} (representative is the InvoiceId of the Customer)

export default class InvoiceModel {
    static async getAllInvoices() {
        const result = await connection
            .request()
            .query("SELECT * FROM Invoice");
        return result.recordset;
    }

    static async getInvoiceInfo(InvoiceId) {
        const result = await connection
            .request()
            .input("InvoiceId", InvoiceId)
            .query("SELECT * FROM Invoice WHERE InvoiceId = @InvoiceId");
        return result.recordset[0];
    }

    static async CreateInvoice(CheckOutDate, Amount, representative) {
        const result = await connection
            .request()
            .input("CheckOutDate", CheckOutDate)
            .input("Amount", Amount)
            .input("representative", representative)
            .query1(`INSERT INTO Invoice (CheckOutDate, Amount, representative) 
                VALUES (@CheckOutDate, @Amount, @representative)`);
        return result.recordset[0];
    }

    static async UpdateInvoice(
        InvoiceId,
        CheckOutDate = null,
        Amount = null,
        representative = null
    ) {
        try {
            let query = `UPDATE Invoice SET `;
            const UpdateInvoice = [];
            if (CheckOutDate !== null) {
                UpdateInvoice.push(`CheckOutDate = ${CheckOutDate}`);
            }
            if (Amount !== null) {
                UpdateInvoice.push(`Amount = ${Amount}`);
            }
            if (representative !== null) {
                UpdateInvoice.push(`representative = ${representative}`);
            }
            if (UpdateInvoice.length === 0) {
                throw new Error("No fields to update");
            }
            query += UpdateInvoice.join(", ");
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
            .input("InvoiceId", InvoiceId)
            .query("DELETE FROM Invoice WHERE InvoiceId = @InvoiceId");
        return result.recordset[0];
    }
}
