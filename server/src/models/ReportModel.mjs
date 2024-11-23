import connection from "../database/connectSQL.mjs";

export default class ReportModel {
    static async getAllReportOverview() {
        const result = await connection.request().query('Select a.Month, a.Year, TotalRevenue, TotalRentalDay from RevenueReport a join Occupancy b on a.Month = b.Month and a.Year = b.Year');
        return result.recordset;
    }

    static async getRevenueReport(month, year) {
        const totalRevenue = await connection
          .request()
          .input('month', 'year')
          .query(
            `Select TotalRevenue from RevenueReport where Month = @month and Year = @year`
        );
        
        const Details = await connection.request().input('month', 'year').query(`Select Type, Revenue from RevenueReport_has_RoomType where Month = @month and Year = @year`);

        return {
            TotalRevenue: totalRevenue,
            Details: Details
        };
    }

    static async getOccupancyReport(month, year) {
        const TotalRentalDay = await connection.request().input('month', 'year').query(`Select TotalRentalDay from OccupancyReport where Month = @month and Year = @year`);

        const Details = await connection.request().input('month', 'year').query(`Select Type, RentalDay from OccupancyReport_has_Room where Month = @month and Year = @year`);

        return {
            TotalRentalDay: TotalRentalDay,
            Details: Details
        };
    }
}