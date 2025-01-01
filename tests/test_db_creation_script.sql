--Create database

CREATE DATABASE HOTEL_MANAGEMENT_TEST
GO
--DROP DATABASE HOTEL_MANAGEMENT_TEST
USE [HOTEL_MANAGEMENT_TEST]
GO

CREATE TABLE ROOMTYPE
(
    Type char(1) PRIMARY KEY,
    Price int,
    Max_Occupancy int,
    Surcharge_Rate float,
    Min_Customer_for_Surcharge int,
)

CREATE TABLE ROOM
(
    RoomID int PRIMARY KEY CHECK (RoomID > 100),
    Type char(1),
    IsAvailable bit DEFAULT 1,
    Description ntext,
    ImgUrl varchar(150),
    FOREIGN KEY (Type) REFERENCES ROOMTYPE (Type) ON DELETE CASCADE,
)

CREATE TABLE CUSTOMERTYPE
(
    Type int IDENTITY (1, 1) PRIMARY KEY,
    Name varchar(10),
    Coefficient float,
)

CREATE TABLE CUSTOMER
(
    CustomerID int IDENTITY (1, 1) PRIMARY KEY,
    Name nvarchar (40),
    Address nvarchar (100),
    IdentityCard varchar(12),
    Type int NOT NULL DEFAULT 1,
    FOREIGN KEY (Type) REFERENCES CUSTOMERTYPE (Type) ON DELETE CASCADE,
)

ALTER TABLE CUSTOMER
ADD CONSTRAINT CK_CitizenCard_OnlyNumbers CHECK (
    IdentityCard LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
)

CREATE TABLE INVOICE
(
    InvoiceID int IDENTITY (1, 1) PRIMARY KEY,
    RepresentativeId int,
    InvoiceDate date,
    Amount float,
    FOREIGN KEY (RepresentativeId) REFERENCES CUSTOMER (CustomerID) ON DELETE CASCADE,
)

CREATE TABLE BOOKING
(
    BookingID int IDENTITY (1, 1) PRIMARY KEY,
    RoomID int,
    BookingDate date,
    Cost float,
    InvoiceId int,
    FOREIGN KEY (RoomID) REFERENCES Room (RoomID) ON DELETE CASCADE,
    FOREIGN KEY (InvoiceId) REFERENCES INVOICE (InvoiceID) ON DELETE CASCADE,
)

CREATE TABLE BookingCustomers
(
    BookingID int,
    CustomerID int,
    PRIMARY KEY (BookingID, CustomerID),
    FOREIGN KEY (BookingID) REFERENCES BOOKING (BookingID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE NO ACTION,
)

CREATE TABLE REVENUEREPORT
(
    Month int,
    Year int,
    PRIMARY KEY (Month, year),
    TotalRevenue Float
)

CREATE TABLE REVENUEREPORT_HAS_ROOMTYPE
(
    Month int,
    Year int,
    Type char,
    Revenue float,
    PRIMARY KEY (Month, Year, Type),
    FOREIGN KEY (Month, Year) REFERENCES REVENUEREPORT (Month, year) ON DELETE CASCADE,
    FOREIGN KEY (Type) REFERENCES ROOMTYPE (Type) ON DELETE CASCADE,
)

CREATE TABLE OCCUPANCY
(
    Month int,
    Year int,
    PRIMARY KEY (Month, year),
    TotalRentalDay float
)

CREATE TABLE OCCUPANCY_HAS_ROOM
(
    Month int,
    Year int,
    RoomId int,
    RentalDays float,
    PRIMARY KEY (Month, Year, RoomId),
    FOREIGN KEY (Month, Year) REFERENCES OCCUPANCY (Month, year) ON DELETE CASCADE,
    FOREIGN KEY (RoomId) REFERENCES ROOM (RoomId) ON DELETE CASCADE,
)
GO

-- Hàm đếm số lượng khách hàng
CREATE FUNCTION CountNumberOfCustomer(@bookingId INT)
RETURNS INT
AS
BEGIN
    DECLARE @numberCustomer INT;
    SELECT @numberCustomer = COUNT(DISTINCT CustomerID)
    FROM BookingCustomers
    WHERE BookingID = @bookingId;

    RETURN @numberCustomer;
END;

GO

-- Hàm lấy hệ số lớn nhất
CREATE FUNCTION GetMaxCoefficient(@bookingId INT)
RETURNS FLOAT
AS
BEGIN
    DECLARE @maxCoefficient FLOAT;
    SELECT @maxCoefficient = MAX(ct.Coefficient)
    FROM BookingCustomers bc
        JOIN CUSTOMER c ON bc.CustomerID = c.CustomerID
        JOIN CUSTOMERTYPE ct ON ct.Type = c.Type
    WHERE bc.BookingID = @bookingId;

    RETURN @maxCoefficient;
END;

GO

-- Hàm tính chi phí đặt phòng
CREATE FUNCTION calcCostOfBooking(@bookingId INT)
RETURNS FLOAT
AS
BEGIN
    DECLARE @numberCustomer INT;
    DECLARE @maxCoefficient FLOAT;
    DECLARE @nights INT;
    DECLARE @minCustomerForSurCharge INT;
    DECLARE @price INT;
    DECLARE @surcharge FLOAT;
    DECLARE @cost FLOAT;

    -- Lấy số khách hàng
    SET @numberCustomer = dbo.CountNumberOfCustomer(@bookingId);

    -- Lấy hệ số lớn nhất
    SET @maxCoefficient = dbo.GetMaxCoefficient(@bookingId);

    -- Tính số đêm
    SELECT @nights = DATEDIFF(DAY, BookingDate, GETDATE())
    FROM BOOKING
    WHERE BookingID = @bookingId;

    -- Lấy thông tin giá, phụ phí
    SELECT
        @minCustomerForSurCharge = rt.Min_Customer_for_Surcharge,
        @price = rt.Price,
        @surcharge = rt.Surcharge_Rate
    FROM BOOKING b
        JOIN ROOM r ON b.RoomID = r.RoomID
        JOIN ROOMTYPE rt ON r.Type = rt.Type
    WHERE b.BookingID = @bookingId;

    -- Tính chi phí
    SET @cost = ISNULL(@price, 0) * ISNULL(@nights, 1) * ISNULL(@maxCoefficient, 1);

    DECLARE @ExtraCustomer INT;
    SET @ExtraCustomer = @numberCustomer - @minCustomerForSurCharge;
    IF (@ExtraCustomer > 0)
    BEGIN
        SET @cost = @cost * (1 + @surcharge * @ExtraCustomer);
    END

    RETURN @cost;
END;
GO



-- UPDATE REVENUE REPORT
CREATE PROCEDURE UpdateRevenueReport
    @InvoiceID INT
AS
BEGIN
    DECLARE @InvoiceDate DATE;
    DECLARE @Amount FLOAT;
    DECLARE @Month INT;
    DECLARE @Year INT;

    -- Lấy thông tin hóa đơn
    SELECT @InvoiceDate = InvoiceDate, @Amount = Amount
    FROM INVOICE
    WHERE InvoiceID = @InvoiceID;

    -- Lấy tháng và năm từ ngày hóa đơn
    SET @Month = MONTH(@InvoiceDate);
    SET @Year = YEAR(@InvoiceDate);

    -- Kiểm tra và cập nhật tổng doanh thu
    IF EXISTS (
        SELECT 1
    FROM REVENUEREPORT
    WHERE Month = @Month AND Year = @Year
    )
    BEGIN
        UPDATE REVENUEREPORT
        SET TotalRevenue = TotalRevenue + @Amount
        WHERE Month = @Month AND Year = @Year;
    END
    ELSE
    BEGIN
        INSERT INTO REVENUEREPORT
            (Month, Year, TotalRevenue)
        VALUES
            (@Month, @Year, @Amount);
    END
END;
GO

-- UPDATE REVENUE REPORT HAS ROOMTYPE
CREATE PROCEDURE UpdateRevenueReportHasRoomType
    @InvoiceID INT
AS
BEGIN
    DECLARE @InvoiceDate DATE;
    DECLARE @Month INT;
    DECLARE @Year INT;

    -- Lấy thông tin hóa đơn
    SELECT @InvoiceDate = InvoiceDate
    FROM INVOICE
    WHERE InvoiceID = @InvoiceID;

    -- Lấy tháng và năm từ ngày hóa đơn
    SET @Month = MONTH(@InvoiceDate);
    SET @Year = YEAR(@InvoiceDate);

    -- Lưu thông tin loại phòng liên quan đến hóa đơn vào biến bảng
    DECLARE @RoomTypes TABLE (Type NVARCHAR(50),
        Revenue DECIMAL(18, 2));

    INSERT INTO @RoomTypes
        (Type, Revenue)
    SELECT
        R.Type,
        SUM(B.Cost) AS Revenue
    FROM BOOKING B
        JOIN ROOM R ON B.RoomID = R.RoomID
    WHERE B.InvoiceId = @InvoiceID
    GROUP BY R.Type;

    -- Duyệt qua từng loại phòng để cập nhật hoặc thêm mới
    DECLARE @Type NVARCHAR(50);
    DECLARE @Revenue DECIMAL(18, 2);

    DECLARE RoomTypeCursor CURSOR FOR
    SELECT Type, Revenue
    FROM @RoomTypes;

    OPEN RoomTypeCursor;

    FETCH NEXT FROM RoomTypeCursor INTO @Type, @Revenue;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Kiểm tra nếu bản ghi đã tồn tại
        IF EXISTS (
            SELECT 1
        FROM REVENUEREPORT_HAS_ROOMTYPE
        WHERE Month = @Month AND Year = @Year AND Type = @Type
        )
        BEGIN
            -- Cập nhật doanh thu
            UPDATE REVENUEREPORT_HAS_ROOMTYPE
            SET Revenue = Revenue + @Revenue
            WHERE Month = @Month AND Year = @Year AND Type = @Type;
        END
        ELSE
        BEGIN
            -- Thêm mới bản ghi
            INSERT INTO REVENUEREPORT_HAS_ROOMTYPE
                (Month, Year, Type, Revenue)
            VALUES
                (@Month, @Year, @Type, @Revenue);
        END;

        FETCH NEXT FROM RoomTypeCursor INTO @Type, @Revenue;
    END;

    CLOSE RoomTypeCursor;
    DEALLOCATE RoomTypeCursor;
END;
GO

-- UPDATE OCCUPANCY REPORT
CREATE PROCEDURE UpdateOccupancy
    @InvoiceID INT
AS
BEGIN
    DECLARE @InvoiceDate DATE;
    DECLARE @Month INT;
    DECLARE @Year INT;
    DECLARE @RentalDays INT;

    -- Lấy thông tin hóa đơn
    SELECT @InvoiceDate = InvoiceDate
    FROM INVOICE
    WHERE InvoiceID = @InvoiceID;

    -- Lấy tháng và năm từ ngày hóa đơn
    SET @Month = MONTH(@InvoiceDate);
    SET @Year = YEAR(@InvoiceDate);

    -- Tính tổng số ngày thuê (bao gồm cả ngày bắt đầu)
    SELECT @RentalDays = ISNULL(SUM(
    CASE 
        WHEN DATEDIFF(DAY, BookingDate, InvoiceDate) = 0 THEN 1
        ELSE DATEDIFF(DAY, BookingDate, InvoiceDate)
    END
	), 0)
    FROM BOOKING b
        JOIN INVOICE i ON b.InvoiceId = i.InvoiceID
    WHERE i.InvoiceID = @InvoiceID;

    -- Cập nhật hoặc thêm dữ liệu vào OCCUPANCY
    IF EXISTS (
        SELECT 1
        FROM OCCUPANCY
        WHERE Month = @Month AND Year = @Year
    )
    BEGIN
        UPDATE OCCUPANCY
        SET TotalRentalDay = TotalRentalDay + @RentalDays
        WHERE Month = @Month AND Year = @Year;
    END
    ELSE
    BEGIN
        INSERT INTO OCCUPANCY
            (Month, Year, TotalRentalDay)
        VALUES
            (@Month, @Year, @RentalDays);
    END
END;
GO


-- UPDATE OCCUPANCY HAS ROOM
CREATE PROCEDURE UpdateOccupancyHasRoom
    @InvoiceID INT
AS
BEGIN
    DECLARE @InvoiceDate DATE;
    DECLARE @Month INT;
    DECLARE @Year INT;

    -- Lấy thông tin hóa đơn
    SELECT @InvoiceDate = InvoiceDate
    FROM INVOICE
    WHERE InvoiceID = @InvoiceID;

    -- Lấy tháng và năm từ ngày hóa đơn
    SET @Month = MONTH(@InvoiceDate);
    SET @Year = YEAR(@InvoiceDate);

    -- Kiểm tra nếu đã tồn tại bản ghi trong OCCUPANCY_HAS_ROOM
    IF EXISTS (
        SELECT 1 
        FROM OCCUPANCY_HAS_ROOM o
        JOIN BOOKING b ON b.RoomID = o.RoomID
        JOIN INVOICE i ON b.InvoiceID = i.InvoiceID
        WHERE o.Month = @Month AND o.Year = @Year AND i.InvoiceID = @InvoiceID
    )
    BEGIN
        -- Nếu tồn tại, cập nhật RentalDays
        UPDATE o
        SET RentalDays = RentalDays + ISNULL(
		CASE 
			WHEN DATEDIFF(DAY, BookingDate, InvoiceDate) = 0 THEN 1
			ELSE DATEDIFF(DAY, BookingDate, InvoiceDate)
		END, 1)
        FROM OCCUPANCY_HAS_ROOM o
        JOIN BOOKING b ON b.RoomID = o.RoomID
        JOIN INVOICE i ON b.InvoiceID = i.InvoiceID
        WHERE o.Month = @Month AND o.Year = @Year AND i.InvoiceID = @InvoiceID;
    END
    ELSE
    BEGIN
        -- Nếu chưa tồn tại, thêm mới
        INSERT INTO OCCUPANCY_HAS_ROOM
            (Month, Year, RoomId, RentalDays)
        SELECT
            @Month,
            @Year,
            b.RoomID,
            ISNULL(
		CASE 
			WHEN DATEDIFF(DAY, BookingDate, InvoiceDate) = 0 THEN 1
			ELSE DATEDIFF(DAY, BookingDate, InvoiceDate)
		END, 1) AS RentalDays
        FROM BOOKING b JOIN INVOICE I
		ON B.InvoiceId = I.InvoiceID
        WHERE b.InvoiceId = @InvoiceID;
    END
END;
GO



-- EXEC ALL THE PROCEDURE TO UPDATE ALL REPORT
CREATE PROCEDURE UpdateAllReports
    @InvoiceID INT
AS
BEGIN
    -- Gọi các Stored Procedure lần lượt
    EXEC UpdateRevenueReport @InvoiceID;
    EXEC UpdateRevenueReportHasRoomType @InvoiceID;
    EXEC UpdateOccupancy @InvoiceID;
    EXEC UpdateOccupancyHasRoom @InvoiceID;
END;
GO