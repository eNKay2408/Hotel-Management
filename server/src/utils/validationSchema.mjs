export const RoomValidationSchema = {
    RoomID: {
        isInt: {
            errorMessage: 'RoomID must be an integer',
        },
        notEmpty:{
            errorMessage: 'RoomID is required'
        },
    },
    RoomType: {
        isString: {
            Options: {
                min: 1,
                max: 1,
            },
            errorMessage: 'RoomType must be A, B or C',
        },
        notEmpty:{
            errorMessage: 'RoomType is required'
        },
    },
    Price: {
        isInt: {
            min: 100,
            errorMessage: 'Price must be an integer',
        },
        notEmpty:{
            errorMessage: 'Price is required'
        },
    },
    Des: {
        isString: {
            errorMessage: 'Description must be a string',
        },
    },
};