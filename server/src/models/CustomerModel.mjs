import connection from "../database/connectSQL.mjs";

// Customer: {CustomerId, Name, IdentityCard, Address, Type}

export default class CustomerModel {
    static async getAllCustomers() {
        const result = await connection
            .request()
            .query("SELECT * FROM Customer");
        return result.recordset;
    }

    static async getCustomerInfo(CustomerId) {
        const result = await connection
            .request()
            .input("CustomerId", CustomerId)
            .query("SELECT * FROM Customer WHERE CustomerId = @CustomerId");
        return result.recordset[0];
    }

    static async CreateCustomer(Name, IdentityCard, Address, Type = 1) {
        const result = await connection
            .request()
            .input("Name", Name)
            .input("IdentityCard", IdentityCard)
            .input("Address", Address)
            .input("Type", Type)
            .query1(`INSERT INTO Customer (Name, IdentityCard, Address, Type) 
                VALUES (@Name, @IdentityCard, @Address, @Type)`);
        return result.recordset[0];
    }

    static async UpdateCustomer(
        CustomerId,
        Name = null,
        IdentityCard = null,
        Address = null,
        Type = null
    ) {
        try {
            let query = `UPDATE Customer SET `;
            const UpdateCustomer = [];
            if (Name !== null) {
                UpdateCustomer.push(`Name = ${Name}`);
            }
            if (IdentityCard !== null) {
                UpdateCustomer.push(`IdentityCard = ${IdentityCard}`);
            }
            if (Address !== null) {
                UpdateCustomer.push(`Address = ${Address}`);
            }
            if (Type !== null) {
                UpdateCustomer.push(`Type = ${Type}`);
            }
            if (UpdateCustomer.length === 0) {
                throw new Error("No fields to update");
            }
            query += UpdateCustomer.join(", ");
            query += ` WHERE CustomerId = ${CustomerId}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteCustomer(CustomerId) {
        const result = await connection
            .request()
            .input("CustomerId", CustomerId)
            .query("DELETE FROM Customer WHERE CustomerId = @CustomerId");
        return result.recordset[0];
    }
}
