import connection from "../database/connectSQL.mjs";

// CustomerType: {Id, Name, Coefficient}

export default class CustomerType {
    static async getAllCustomerTypes() {
        const result = await connection
            .request()
            .query("SELECT * FROM CustomerType");
        return result.recordset;
    }

    static async getCustomerTypeInfo(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("SELECT * FROM CustomerType WHERE Id = @Id");
        return result.recordset[0];
    }

    static async CreateCustomerType(Name, Coefficient) {
        const result = await connection
            .request()
            .input("Name", Name)
            .input("Coefficient", Coefficient)
            .query1(`INSERT INTO CustomerType (Name, Coefficient) 
                VALUES (@Name, @Coefficient)`);
        return result.recordset[0];
    }

    static async UpdateCustomerType(Id, Name = null, Coefficient = null) {
        try {
            let query = `UPDATE CustomerType SET `;
            const UpdateCustomerType = [];
            if (Name !== null) {
                UpdateCustomerType.push(`Name = ${Name}`);
            }
            if (Coefficient !== null) {
                UpdateCustomerType.push(`Coefficient = ${Coefficient}`);
            }
            if (UpdateCustomerType.length === 0) {
                throw new Error("No fields to update");
            }
            query += UpdateCustomerType.join(", ");
            query += ` WHERE Id = ${Id}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteCustomerType(Id) {
        const result = await connection
            .request()
            .input("Id", Id)
            .query("DELETE FROM CustomerType WHERE Id = @Id");
        return result.recordset[0];
    }
}
