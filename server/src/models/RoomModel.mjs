import connection from "../database/connectSQL.mjs";

//Room: {RoomId, Type, Status, Description}

export default class RoomModel {
    static async getAllRooms() {
        const result = await connection.request().query("SELECT * FROM Room");
        return result.recordset;
    }

    static async getRoomById(id) {
        const result = await connection
            .request()
            .input("id", id)
            .query("SELECT * FROM Room WHERE id = @id");
        return result.recordset[0];
    }

    static async getRoomByType(Type) {
        const result = await connection
            .request()
            .input("Type", Type)
            .query("SELECT * FROM Room WHERE Type = @Type");
        return result.recordset;
    }

    static async getRoomByStatus(Status) {
        const result = await connection
            .request()
            .input("Status", Status)
            .query("SELECT * FROM Room WHERE Status = @Status");
        return result.recordset;
    }

    static async getRoomByTypeAndStatus(Type, Status) {
        const result = await connection
            .request()
            .input("Type", Type)
            .input("Status", Status)
            .query(
                "SELECT * FROM Room WHERE Type = @Type AND Status = @Status"
            );
        return result.recordset;
    }

    static async CreateRoom(
        RoomId,
        Type,
        Status = "Available",
        Description = null
    ) {
        const result = await connection
            .request()
            .input("RoomId", RoomId)
            .input("Type", Type)
            .input("Status", Status)
            .input("Description", Description)
            .query(
                `INSERT INTO Room (RoomId, Type, Status, Description) VALUES (@RoomId, @Type, @Status, @Description)`
            );
        return result.recordset[0];
    }

    static async UpdateRoom(
        RoomId,
        Type = null,
        Status = null,
        Description = null
    ) {
        try {
            let query = `UPDATE Room SET `;
            const UpdateRoom = [];
            if (Type !== null) {
                UpdateRoom.push(`Type = ${Type}`);
            }
            if (Status !== null) {
                UpdateRoom.push(`Status = ${Status}`);
            }
            if (Description !== null) {
                UpdateRoom.push(`Description = ${Description}`);
            }
            if (UpdateRoom.length === 0) {
                throw new Error("No fields to update");
            }

            query += UpdateRoom.join(", ");
            query += ` WHERE RoomId = ${RoomId}`;
            const result = await connection.request().query(query);
            return result.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async DeleteRoom(RoomId) {
        const result = await connection
            .request()
            .input("RoomId", RoomId)
            .query(`DELETE FROM Room WHERE RoomId = @RoomId`);
        return result.recordset[0];
    }
}
