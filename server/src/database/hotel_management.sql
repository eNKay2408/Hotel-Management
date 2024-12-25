--Create database

CREATE DATABASE HOTEL_MANAGEMENT
GO
--DROP DATABASE HOTEL_MANAGEMENT
USE [HOTEL_MANAGEMENT]
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
    FOREIGN KEY (Type) REFERENCES ROOMTYPE (Type),
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
    FOREIGN KEY (Type) REFERENCES CUSTOMERTYPE (Type),
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
    FOREIGN KEY (RepresentativeId) REFERENCES CUSTOMER (CustomerID),
)

CREATE TABLE BOOKING
(
    BookingID int IDENTITY (1, 1) PRIMARY KEY,
    RoomID int,
    BookingDate date,
    Cost float,
    InvoiceId int,
    FOREIGN KEY (RoomID) REFERENCES Room (RoomID),
    FOREIGN KEY (InvoiceId) REFERENCES INVOICE (InvoiceID),
)

CREATE TABLE BookingCustomers
(
    BookingID int,
    CustomerID int,
    PRIMARY KEY (BookingID, CustomerID),
    FOREIGN KEY (BookingID) REFERENCES BOOKING (BookingID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID),
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


    primary key (Month, Year, Type),
    Foreign key (Month, Year) references REVENUEREPORT(Month, year),
    Foreign key (Type) references ROOMTYPE(Type),
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


    primary key (Month, Year, RoomId),
    Foreign key (Month, Year) references OCCUPANCY(Month, year),
    Foreign key (RoomId) references ROOM(RoomId),
)


INSERT INTO [ROOMTYPE]
VALUES
    ('A', 150, 6, 0.25, 3),
    ('B', 170, 4, 0.25, 2),
    ('C', 200, 2, 0.25, 1)


INSERT INTO
    ROOM
    (RoomID, Type)
VALUES
    (101, 'A'),
    (102, 'B'),
    (103, 'C'),
    (201, 'A'),
    (202, 'B'),
    (203, 'C'),
    (301, 'A'),
    (302, 'B'),
    (303, 'C'),
    (104, 'A')

INSERT INTO CUSTOMERTYPE
VALUES
    ('domestic', 1),
    ('foreign', 1.5)

INSERT INTO
    CUSTOMER
    (Name, Address, IdentityCard)
VALUES
    (
        N'Hoàng Tiến Huy',
        N'Dĩ An, Bình Dương',
        '066204006779'
    ),
    (
        N'Nguyễn Trấn An',
        N'Tp.Thủ Đức',
        '081197006912'
    ),
    (
        N'Rồi Sẽ Ổn',
        N'Yên Bình',
        '077200106219'
    ),
    (
        N'Nông Văn Lâm',
        N'KTX khu A',
        '014199206014'
    ),
    (
        N'Mường Thanh',
        N'KTX khu B',
        '042194749147'
    )

INSERT INTO
    CUSTOMER
    (Name, Type)
VALUES
    (N'Lebrons James', 2),
    (N'Ishow Speed', 2),
    (N'Leo Messi', 2),
    (N'Cristiano Ronaldo', 2)

INSERT INTO
    BOOKING
    (RoomID, BookingDate)
VALUES
    (101, '08-01-2024'),
    --3 (INVOICE 1)
    (102, '08-01-2024'),
    --2 (INVOICE 1)
    (201, '08-02-2024'),
    --1 (INVOICE 2)
    (202, '08-01-2024'),
    --1 (INVOICE 3)
    (301, '08-17-2024')
--2  (INVOICE 4)

INSERT INTO
    BookingCustomers
    (BookingID, CustomerID)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (3, 6),
    (4, 7),
    (5, 8),
    (5, 9)

update ROOM
set IsAvailable = 0
where RoomID = 101 or RoomID = 102 or RoomID = 201
    or RoomID = 202 or RoomID = 301

-- Cập nhật Room
DECLARE @RoomId INT;
DECLARE @i INT = 1;
DECLARE RoomCursor CURSOR FOR
SELECT RoomId
FROM Room;

OPEN RoomCursor;
FETCH NEXT FROM RoomCursor INTO @RoomId;

WHILE @@FETCH_STATUS = 0
BEGIN
    UPDATE Room
    SET ImgUrl = CONCAT('https://res.cloudinary.com/dvzhmi7a9/image/upload/t_scale_10/HotelManagement/', @i)
    WHERE RoomId = @RoomId;

    SET @i = @i + 1;
    IF(@i > 20)
    BEGIN
        SET @i = 1;
    END
    FETCH NEXT FROM RoomCursor INTO @RoomId;
END;

CLOSE RoomCursor;
DEALLOCATE RoomCursor;

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

    IF (@numberCustomer >= @minCustomerForSurCharge)
    BEGIN
        SET @cost = @cost * (1 + @surcharge);
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
    SELECT @RentalDays = ISNULL(SUM(DATEDIFF(DAY, BookingDate, InvoiceDate)), 0)
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
        SET RentalDays = RentalDays + ISNULL(DATEDIFF(DAY, b.BookingDate, @InvoiceDate), 0)
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
            ISNULL(DATEDIFF(DAY, b.BookingDate, @InvoiceDate), 0) AS RentalDays
        FROM BOOKING b
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

-- drop procedure UpdateOccupancy
-- drop procedure UpdateRevenueReport
-- drop procedure UpdateRevenueReportHasRoomType
-- drop procedure UpdateOccupancyHasRoom
-- drop procedure UpdateAllReports

SET IDENTITY_INSERT Invoice ON;
INSERT INTO INVOICE
    (invoiceId, RepresentativeId, InvoiceDate, Amount)
VALUES
    (1, 1, '2023-10-03', 640),
    (2, 2, '2023-10-08', 960),
    (3, 3, '2023-10-14', 1480);
SET IDENTITY_INSERT Invoice OFF;

SET IDENTITY_INSERT BOOKING ON;
-- Insert Bookings for October 2023
INSERT INTO BOOKING
    (BookingId, BookingDate, RoomID, cost, InvoiceId)
VALUES
    (6, '2023-10-01', 101, 300, 1),
    (7, '2023-10-01', 102, 340, 1),
    (8, '2023-10-05', 201, 450, 2),
    (9, '2023-10-05', 202, 510, 2),
    (10, '2023-10-10', 302, 680, 3),
    (11, '2023-10-10', 303, 800, 3);

SET IDENTITY_INSERT BOOKING OFF;
-- Insert BookingCustomers for October 2023
INSERT INTO BookingCustomers
    (BookingID, CustomerID)
VALUES
    (6, 1),
    (6, 2),
    (6, 3),
    -- Booking 1
    (7, 4),
    (7, 5),
    -- Booking 2
    (8, 1),
    (8, 2),
    -- Booking 3
    (9, 3),
    (9, 4),
    -- Booking 4
    (10, 5),
    (10, 1),
    -- Booking 5
    (11, 3);
-- Booking 6


-- Inserting bookings for November 2023

-- Insert Invoice
SET IDENTITY_INSERT Invoice ON;
INSERT INTO INVOICE
    (invoiceid, RepresentativeId, InvoiceDate, Amount)
VALUES
    (4, 1, '2023-11-03', 740),
    (5, 4, '2023-11-08', 1110),
    (6, 3, '2023-11-12', 740);
SET IDENTITY_INSERT Invoice OFF;

-- Insert Bookings for November 2023
SET IDENTITY_INSERT BOOKING ON;
INSERT INTO BOOKING
    (BookingId, BookingDate, RoomID, cost, InvoiceId)
VALUES
    (12, '2023-11-01', 103, 400, 4),
    (13, '2023-11-01', 102, 340, 4),
    (14, '2023-11-05', 203, 600, 5),
    (15, '2023-11-05', 201, 510, 5),
    (16, '2023-11-10', 302, 340, 6),
    (17, '2023-11-10', 303, 400, 6);
SET IDENTITY_INSERT BOOKING OFF;
-- Insert BookingCustomers for November 2023
INSERT INTO BookingCustomers
    (BookingID, CustomerID)
VALUES
    (12, 1),
    -- Booking 1
    (13, 2),
    (13, 3),
    -- Booking 2
    (14, 4),
    -- Booking 3
    (15, 1),
    (15, 2),
    -- Booking 4
    (16, 3),
    (16, 4),
    -- Booking 5
    (17, 1);          
    -- Booking 6

exec UpdateAllReports @InvoiceID = 1;
exec UpdateAllReports @InvoiceID = 2;
exec UpdateAllReports @invoiceID = 3;
exec UpdateAllReports @invoiceID = 4;
exec UpdateAllReports @invoiceID = 5;
exec UpdateAllReports @invoiceID = 6;