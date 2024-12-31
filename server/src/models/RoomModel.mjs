import connection from '../database/connectSQL.mjs';

//Room: {RoomId, Type, IsAvailable, Description}

export default class RoomModel {
  static async getAllRooms() {
    const result = await connection.request()
      .query(`SELECT r.RoomID as Number, r.Type, r.IsAvailable, r.Description, r.ImgUrl
                    FROM ROOM r`);
    return result.recordset;
  }

  static async getRoomById(id) {
    const result = await connection.request().input('id', id)
      .query(`SELECT r.RoomID as Number, r.Type, r.IsAvailable, r.Description, r.ImgUrl
                    FROM ROOM r  
                    WHERE RoomID = @id`);
    return result.recordset[0];
  }

  static async getRoomByType(Type) {
    const result = await connection
      .request()
      .input('Type', Type)
      .query('SELECT * FROM Room WHERE Type = @Type');
    return result.recordset;
  }

  static async getRoomByStatus(IsAvailable) {
    const result = await connection.request().input('IsAvailable', IsAvailable)
      .query(`SELECT r.RoomID as Number, t.Type, t.Max_Occupancy as MaxOccupancy, t.Min_Customer_for_Surcharge as BaseCustomers, t.Price, r.ImgUrl, t.Surcharge_Rate as SurchargeRate
              FROM ROOM r join ROOMTYPE t on r.Type = t.Type
              WHERE IsAvailable = @IsAvailable`);
    return result.recordset;
  }

  static async getRoomByTypeAndStatus(Type, IsAvailable) {
    const result = await connection
      .request()
      .input('Type', Type)
      .input('IsAvailable', IsAvailable)
      .query(
        'SELECT * FROM Room WHERE Type = @Type AND IsAvailable = @IsAvailable'
      );
    return result.recordset;
  }

  static async createRoom(
    RoomId,
    Type,
    IsAvailable = 1,
    Description = null,
    ImgUrl = null
  ) {
    try {
      const result = await connection
        .request()
        .input('RoomId', RoomId)
        .input('Type', Type)
        .input('IsAvailable', IsAvailable)
        .input('Description', Description)
        .input('ImgUrl', ImgUrl)
        .query(
          `INSERT INTO Room (RoomId, Type, IsAvailable, Description, ImgUrl) VALUES (@RoomId, @Type, @IsAvailable, @Description, @ImgUrl)`
        );
      return {
        message: 'Room created successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateRoom(
    RoomId,
    Type = null,
    IsAvailable = null,
    Description = null,
    ImgUrl = null
  ) {
    try {
      if (RoomId == null) {
        return {
          message: 'RoomId is required',
          code: 400,
        };
      }
      let query = `UPDATE Room SET `;
      const UpdateRoom = [];
      const params = {};
      if (Type !== null) {
        UpdateRoom.push('Type = @Type');
        params.Type = Type;
      }
      if (IsAvailable !== null) {
        UpdateRoom.push('IsAvailable = @IsAvailable');
        params.IsAvailable = IsAvailable;
      }
      if (Description !== null) {
        UpdateRoom.push('Description = @Description');
        params.Description = Description;
      }
      if (ImgUrl !== null) {
        UpdateRoom.push('ImgUrl = @ImgUrl');
        params.ImgUrl = ImgUrl;
      }

      query += UpdateRoom.join(', ');
      query += ' WHERE RoomId = @RoomId';
      params.RoomId = RoomId;

      const result = await connection
        .request()
        .input('RoomId', params.RoomId)
        .input('Type', params.Type)
        .input('IsAvailable', params.IsAvailable)
        .input('Description', params.Description)
        .input('ImgUrl', params.ImgUrl)
        .query(query);

      if (result.rowsAffected[0] > 0) {
        return {
          message: 'Room updated successfully',
          code: 200,
        };
      } else {
        return {
          message: 'No room found',
          code: 404,
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteRoom(RoomId) {
    try {
      const result = await connection
        .request()
        .input('RoomId', RoomId)
        .query(`DELETE FROM Room WHERE RoomId = @RoomId`);
      return {
        message: 'Room deleted successfully',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getTypeInfoOfRoom(RoomId) {
    const result = await connection.request().input('RoomId', RoomId)
      .query(`SELECT t.*
              FROM Room r join ROOMTYPE t on r.Type = t.Type
              WHERE r.RoomID = @RoomId`);
    return result.recordset;
  }
}
