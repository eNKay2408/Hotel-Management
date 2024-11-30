import connection from '../database/connectSQL.mjs';
import sql from 'mssql';

// RoomType: {Type, Price, Max_Customer, Min_Customer_for_Surcharge, Surcharge}

export default class RoomTypeModel {
  static async getAllRoomTypes() {
    const result = await connection.request().query('SELECT * FROM RoomType');
    return result.recordset;
  }

  static async getRoomTypeInfo(Type) {
    const result = await connection
      .request()
      .input('Type', Type)
      .query('SELECT * FROM RoomType WHERE Type = @Type');

    return result.recordset[0];
  }

  //if you want to use this method, you need passing an object as an argument
  // ex {"Type": 'A', "Price": 100, "Max_Customer": 3, "Min_Customer_for_Surcharge": 3, "Surcharge": 0.25}
  static async CreateRoomType(
    Type,
    Price,
    Max_Customer = 3,
    Min_Customer_for_Surcharge = 3,
    Surcharge = 0.25
  ) {
    try {
      const result = await connection
        .request()
        .input('Type', Type)
        .input('Price', Price)
        .input('Max_Customer', Max_Customer)
        .input('Min_Customer_for_Surcharge', Min_Customer_for_Surcharge)
        .input('Surcharge', Surcharge)
        .query(`INSERT INTO RoomType (Type, Price, Max_Customer, Min_Customer_for_Surcharge, Surcharge) 
                  VALUES (@Type, @Price, @Max_Customer, @Min_Customer_for_Surcharge, @Surcharge)`);
      return {
        message: 'RoomType created successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async UpdateRoomType(
    Type,
    Price = null,
    Max_Customer = null,
    Min_Customer_for_Surcharge = null,
    Surcharge = null
  ) {
    try {
      let query = `UPDATE RoomType SET `;
      const UpdateRoomType = [];
      if (Price !== null) {
        UpdateRoomType.push(`Price = @Price`);
      }
      if (Max_Customer !== null) {
        UpdateRoomType.push(`Max_Customer = @Max_Customer`);
      }
      if (Min_Customer_for_Surcharge !== null) {
        UpdateRoomType.push(
          `Min_Customer_for_Surcharge = @Min_Customer_for_Surcharge`
        );
      }
      if (Surcharge !== null) {
        UpdateRoomType.push(`Surcharge = @Surcharge`);
      }
      if (UpdateRoomType.length === 0) {
        throw new Error('No fields to update');
      }
      query += UpdateRoomType.join(', ') + ` WHERE Type = @Type`;

      const result = await connection
        .request()
        .input('Type', sql.Char, Type)
        .input('Price', sql.Decimal, Price)
        .input('Max_Customer', sql.Int, Max_Customer)
        .input(
          'Min_Customer_for_Surcharge',
          sql.Int,
          Min_Customer_for_Surcharge
        )
        .input('Surcharge', sql.Decimal, Surcharge)
        .query(query);

      return {
        message: 'Update success',
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async DeleteRoomType(Type) {
    try {
      const result = await connection
        .request()
        .input('Type', Type)
        .query('DELETE FROM RoomType WHERE Type = @Type');
      return {
        message: 'Delete success',
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
