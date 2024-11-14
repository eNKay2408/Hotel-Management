--Create database
  
CREATE DATABASE HOTEL_MANAGEMENT
--DROP DATABASE HOTEL_MANAGEMENT
USE [HOTEL_MANAGEMENT]


CREATE TABLE ROOMTYPE (
    Type char(1) PRIMARY KEY,
    Price int,
    Max_Occupancy int,
    Surcharge_Rate float,
    Min_Customer_for_Surcharge int,
)

CREATE TABLE ROOM (
    RoomID int PRIMARY KEY CHECK (RoomID > 100),
    Type char(1),
    Status bit DEFAULT 0,
    Description ntext,
    ImgUrl varchar(100),
    FOREIGN KEY (Type) REFERENCES ROOMTYPE (Type),
)

CREATE TABLE CUSTOMERTYPE (
    Type int IDENTITY (1, 1) PRIMARY KEY,
    Name varchar(10),
    Coefficient float,
)

CREATE TABLE CUSTOMER (
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

CREATE TABLE INVOICE (
    InvoiceID int IDENTITY (1, 1) PRIMARY KEY,
    RepresentativeId int,
    InvoiceDate date,
    Amount float,
    FOREIGN KEY (RepresentativeId) REFERENCES CUSTOMER (CustomerID),
)

CREATE TABLE BOOKING (
    BookingID int IDENTITY (1, 1) PRIMARY KEY,
    RoomID int,
    BookingDate date,
    Cost float,
    InvoiceId int,
    FOREIGN KEY (RoomID) REFERENCES Room (RoomID),
    FOREIGN KEY (InvoiceId) REFERENCES INVOICE (InvoiceID),
)

CREATE TABLE BookingCustomers (
    BookingID int,
    CustomerID int,
    PRIMARY KEY (BookingID, CustomerID),
    FOREIGN KEY (BookingID) REFERENCES BOOKING (BookingID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID),
)

CREATE TABLE REVENUEREPORT (
    Month int,
    Year int,
    PRIMARY KEY (Month, year),
    TotalRevenue Float
)

CREATE TABLE REVENUEREPORT_HAS_ROOMTYPE (
	Month int,
	Year int,
	Type char,
	Revenue float,


	primary key (Month, Year, Type),
	Foreign key (Month, Year) references REVENUEREPORT(Month, year),
	Foreign key (Type) references ROOMTYPE(Type),
)


CREATE TABLE OCCUPANCY (
    Month int,
    Year int,
    PRIMARY KEY (Month, year),
    TotalRentalDay float
)

CREATE TABLE OCCUPANCY_HAS_ROOM (
	Month int,
	Year int,
	RoomId int,
	Rate float,


	primary key (Month, Year, RoomId),
	Foreign key (Month, Year) references OCCUPANCY(Month, year),
	Foreign key (RoomId) references ROOM(RoomId),
)


INSERT INTO [ROOMTYPE] VALUES 
	('A', 150, 3, 0.25, 3),
	('B', 170, 3, 0.25, 3),
	('C', 200, 3, 0.25, 3)


INSERT INTO
    ROOM (RoomID, Type)
VALUES (101, 'A'),
    (102, 'B'),
    (103, 'C'),
    (201, 'A'),
    (202, 'B'),
    (203, 'C'),
    (301, 'A'),
    (302, 'B'),
    (303, 'C')

INSERT INTO CUSTOMERTYPE VALUES ('domestic', 1), ('foreign', 1.5)

INSERT INTO
    CUSTOMER (Name, Address, IdentityCard)
VALUES (
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
    CUSTOMER (Name, Type)
VALUES (N'Lebrons James', 2),
    (N'Ishow Speed', 2),
    (N'Leo Messi', 2),
    (N'Cristiano Ronaldo', 2)

INSERT INTO
    BOOKING (RoomID, BookingDate)
VALUES (101, '08-01-2024'), --3 (INVOICE 1)
    (102, '08-01-2024'), --2 (INVOICE 1)
    (201, '08-02-2024'), --1 (INVOICE 2)
    (202, '08-01-2024'), --1 (INVOICE 3)
    (301, '08-17-2024') --2  (INVOICE 4)

INSERT INTO
    BookingCustomers (BookingID, CustomerID)
VALUES (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (3, 6),
    (4, 7),
    (5, 8),
    (5, 9)

INSERT INTO
    INVOICE (RepresentativeId, InvoiceDate)
VALUES (1, '8-3-2024'),
    (6, '8-9-2024'),
    (7, '8-10-2024'),
    (8, '8-20-2024')

UPDATE BOOKING
SET
    InvoiceId = 1
WHERE
    BookingID = 1
    OR BookingID = 2

UPDATE BOOKING SET InvoiceId = 2 WHERE BookingID = 3

UPDATE BOOKING SET InvoiceId = 3 WHERE BookingID = 4

UPDATE BOOKING SET InvoiceId = 4 WHERE BookingID = 5

UPDATE ROOM SET ImgUrl = 'https://placehold.co/400'

UPDATE ROOM SET Description = 'This is a room'