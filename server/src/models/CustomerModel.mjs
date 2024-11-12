import connection from "../database/connectSQL.mjs";

// Customer: {Id, Name, IdentityCard, Address, TypeId}

export default class CustomerModel {
    static async getAllCustomers() {
        const result = await connection
            .request()
            .query("SELECT * FROM Customer");
        return result.recordset;
    }

    static async getCustomerInfo(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("SELECT * FROM Customer WHERE Id = @Id");
        return result.recordset[0];
    }

    static async CreateCustomer(Name, IdentityCard, Address, TypeId = 1) {
        const result = await connection
            .request()
            .input("Name", Name)
            .input("IdentityCard", IdentityCard)
            .input("Address", Address)
            .input("TypeId", TypeId)
            .query1(`INSERT INTO Customer (Name, IdentityCard, Address, TypeId) 
                VALUES (@Name, @IdentityCard, @Address, @TypeId)`);
        return result.recordset[0];
    }

    static async UpdateCustomer(
        Id,
        Name = null,
        IdentityCard = null,
        Address = null,
        TypeId = null
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
            if (TypeId !== null) {
                UpdateCustomer.push(`TypeId = ${TypeId}`);
            }
            if (UpdateCustomer.length === 0) {
                throw new Error("No fields to update");
            }
            query += UpdateCustomer.join(", ");
            query += ` WHERE Id = ${Id}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteCustomer(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("DELETE FROM Customer WHERE Id = @Id");
        return result.recordset[0];
    }
}
