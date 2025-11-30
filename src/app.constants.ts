
export class AppConstants {
    constructor() {}

    public static app = {
        xyz: 'xyz',
        jwt: {
            expiryTime: 3600,
            type: 'JWT' 
        },
        bucket: 'klruploads',
        key: 'uploads',
        userType: {
            admin: 'Admin',
            user: 'User',
            vendor: 'Vendor',
            deliveryBoy: 'DeliveryBoy'
        },
        status: {
            active: 1,
            inactive: 0
        }
    };

}