import connection from "../database/connectSQL.mjs";

export default class ReportModel {
  static async getAllReportOverview() {
    const result = await connection.request().query(
      `SELECT a.Month, a.Year, TotalRevenue, TotalRentalDay 
         FROM RevenueReport a 
         JOIN Occupancy b ON a.Month = b.Month AND a.Year = b.Year`
    );
    return result.recordset;
  }

  static async getRevenueReport(month, year) {
    const totalRevenueQuery = await connection
      .request()
      .input('month', month)
      .input('year', year)
      .query(
        `SELECT TotalRevenue 
         FROM RevenueReport 
         WHERE Month = @month AND Year = @year`
      );

    const detailsQuery = await connection
      .request()
      .input('month', month)
      .input('year', year)
      .query(
        `SELECT Type, Revenue 
         FROM RevenueReport_has_RoomType 
         WHERE Month = @month AND Year = @year`
      );

    return {
      TotalRevenue: totalRevenueQuery.recordset[0]?.TotalRevenue || 0,
      Details: detailsQuery.recordset,
    };
  }

  static async getOccupancyReport(month, year) {
    const totalRentalDayQuery = await connection
      .request()
      .input('month', month)
      .input('year', year)
      .query(
        `SELECT TotalRentalDay 
         FROM Occupancy 
         WHERE Month = @month AND Year = @year`
      );

    const detailsQuery = await connection
      .request()
      .input('month', month)
      .input('year', year)
      .query(
        `SELECT RoomID, RentalDays 
         FROM Occupancy_has_Room 
         WHERE Month = @month AND Year = @year`
      );

    return {
      TotalRentalDay: totalRentalDayQuery.recordset[0]?.TotalRentalDay || 0,
      Details: detailsQuery.recordset,
    };
  }
}