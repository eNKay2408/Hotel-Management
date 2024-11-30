import connection from '../database/connectSQL.mjs';

// CustomerType: {Type, Name, Coefficient}

export default class CustomerTypeModel {
  static async getAllCustomerTypes() {
    const result = await connection
      .request()
      .query('SELECT * FROM CustomerType');
    return result.recordset;
  }

  static async getCustomerTypeInfo(Type) {
    const result = await connection
      .request()
      .input('Type', Type)
      .query('SELECT * FROM CustomerType WHERE Type = @Type');
    return result.recordset[0];
  }

  static async CreateCustomerType(Name, Coefficient) {
    const result = await connection
      .request()
      .input('Name', Name)
      .input('Coefficient', Coefficient)
      .query(`INSERT INTO CustomerType (Name, Coefficient) 
                VALUES (@Name, @Coefficient)`);
    return {
      message: 'CustomerType created successfully',
    };
  }

  static async UpdateCustomerType(Type, Name = null, Coefficient = null) {
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
        throw new Error('No fields to update');
      }
      query += UpdateCustomerType.join(', ');
      query += ` WHERE Type = ${Type}`;
      const result = await connection.request().query(query);
      return {
        message: 'CustomerType updated successfully',
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async DeleteCustomerType(Type) {
    const result = await connection
      .request()
      .input('Type', Type)
      .query('DELETE FROM CustomerType WHERE Type = @Type');
    return {
      message: 'CustomerType deleted successfully',
    };
  }
}
