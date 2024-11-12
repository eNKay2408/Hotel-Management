import connection from "../database/connectSQL.mjs";

// Invoice: {Id, CheckOutDate, Amount, representative} (representative is the Id of the Customer)

export default class InvoiceModel {
    static async getAllInvoices() {
        const result = await connection
            .request()
            .query("SELECT * FROM Invoice");
        return result.recordset;
    }

    static async getInvoiceInfo(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("SELECT * FROM Invoice WHERE Id = @Id");
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
        Id,
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
            query += ` WHERE Id = ${Id}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteInvoice(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("DELETE FROM Invoice WHERE Id = @Id");
        return result.recordset[0];
    }
}
