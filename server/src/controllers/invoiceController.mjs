import MockData from "../database/MockData.mjs";
import { StatusCodes } from "http-status-codes";

const invoiceData = MockData.MockInvoice;
const invoiceDetailData = MockData.MockInvoiceDetails;

export const resolveInvoiceById = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid ID supplied");
    }
    const invoiceIndex = invoiceData.findIndex(
        (invoice) => invoice.InvoiceID === parseInt(id)
    );
    if (invoiceIndex === -1) {
        return res.status(StatusCodes.NOT_FOUND).send("Invoice not found");
    }

    req.invoiceIndex = invoiceIndex;
    next();
};

function getBookingIDs(InvoiceID) {
    return invoiceDetailData
        .filter((invoiceDetail) => invoiceDetail.InvoiceID === InvoiceID)
        .map((invoiceDetail) => invoiceDetail.BookingID);
}

export const InvoiceController = {
    get: (req, res) => {
        const { InvoiceID, TotalCost, Representator } = req.query;
        let invoices = invoiceData;

        // check valid value
        if (InvoiceID && isNaN(InvoiceID)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid InvoiceID supplied");
        }
        if (TotalCost && isNaN(TotalCost)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid TotalCost supplied");
        }
        if (Representator && isNaN(Representator)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid Representator supplied");
        }

        // filter invoices
        if (InvoiceID) {
            invoices = invoices.filter(
                (invoice) => invoice.InvoiceID === parseInt(InvoiceID)
            );
        }
        if (TotalCost) {
            invoices = invoices.filter(
                (invoice) => invoice.TotalCost === parseInt(TotalCost)
            );
        }
        if (Representator) {
            invoices = invoices.filter(
                (invoice) => invoice.Representator === parseInt(Representator)
            );
        }

        // return result
        if (invoices.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Invoice not found");
        }
        return res.status(StatusCodes.OK).send(invoices);
    },

    post: (req, res) => {
        const { TotalCost, Representator } = req.body;
        if (!TotalCost || isNaN(TotalCost)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid TotalCost supplied");
        }
        if (!Representator || isNaN(Representator)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid Representator supplied");
        }

        const newInvoice = {
            InvoiceID: invoiceData.length + 1,
            TotalCost,
            Representator,
        };
        invoiceData.push(newInvoice);
        return res.status(201).send(newInvoice);
    },

    put: (req, res) => {
        const { TotalCost, Representator } = req.body;
        if (!TotalCost || isNaN(TotalCost)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid TotalCost supplied");
        }
        if (!Representator || isNaN(Representator)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Invalid Representator supplied");
        }

        const { invoiceIndex } = req;
        invoiceData[invoiceIndex] = {
            ...invoiceData[invoiceIndex],
            TotalCost,
            Representator,
        };
        return res.status(StatusCodes.OK).send(invoiceData[invoiceIndex]);
    },

    patch: (req, res) => {
        const { body, invoiceIndex } = req;
        invoiceData[invoiceIndex] = { ...invoiceData[invoiceIndex], ...body };
        return res.status(StatusCodes.OK).send(invoiceData[invoiceIndex]);
    },

    delete: (req, res) => {
        const { invoiceIndex } = req;
        invoiceData.splice(invoiceIndex, 1);
        return res.status(StatusCodes.OK).send("Invoice deleted");
    },

    getAllBooking: (req, res) => {
        const { id } = req.params;
        const bookingIDs = getBookingIDs(parseInt(id));
        const bookings = MockData.MockBooking.filter((booking) =>
            bookingIDs.includes(booking.BookingID)
        );
        return res.status(StatusCodes.OK).send(bookings);
    },
    /*
    calcTotalCost: (req, res) => {
        const { id } = req.params;
        const bookingIDs = getBookingIDs(parseInt(id));
        const bookings = MockData.MockBooking.filter((booking) => bookingIDs.includes(booking.BookingID));
        const totalCost = bookings.reduce((total, booking) => total + booking.Cost, 0);
        return res.status(StatusCodes.OK).send({ TotalCost: totalCost });
    }
    */
};
