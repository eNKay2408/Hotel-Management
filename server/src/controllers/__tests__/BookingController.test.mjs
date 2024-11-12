import { BookingController, resolveBookingById } from '../BookingController.mjs';
import MockData from '../../database/MockData.mjs';
import { StatusCodes } from 'http-status-codes';

describe('BookingController', () => {
    let req, res;
    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    test('should get all bookings', () => {
        req.query = {};
        BookingController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith(MockData.MockBooking);
    });

    test('should return error for invalid BookingID', () => {
        req.query.BookingID = 'invalid';
        BookingController.get(req, res);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith("Invalid BookingID supplied");
    });

    test('should create a booking successfully', () => {
        req.body = {
            RoomID: 101,
            BookingDate: "2024-10-15",
            CheckOutDate: "2024-10-16",
            Cost: 300
        };
        BookingController.post(req, res);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining(req.body));
    });

    test('should return error for invalid booking data', () => {
        req.body = {
            RoomID: null,
            BookingDate: null,
            CheckOutDate: null,
            Cost: null
        };
        BookingController.post(req, res);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith("Invalid data supplied");
    });

    test('should update a booking successfully', () => {
        req.params.id = 1;
        req.body = {
            RoomID: 101,
            BookingDate: "2024-10-15",
            CheckOutDate: "2024-10-16",
            Cost: 300
        };
        resolveBookingById(req, res, () => {
            BookingController.patch(req, res);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining(req.body));
        });
    });

    test('should get number of customers in a room by booking ID', () => {
        req.params.id = 1;
        BookingController.getNumberOfCustomer(req, res);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.send).toHaveBeenCalledWith({ numberOfCustomer: expect.any(Number) });
    });

    test('should return error for invalid booking ID in getNumberOfCustomer', () => {
        req.params.id = 'invalid';
        BookingController.getNumberOfCustomer(req, res);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith("Invalid ID supplied");
    });
});