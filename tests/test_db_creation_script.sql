--Create database

CREATE DATABASE HOTEL_MANAGEMENT_TEST
GO
--DROP DATABASE HOTEL_MANAGEMENT_TEST
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