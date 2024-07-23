const axios = require('axios');
const qs = require('qs');

class VivaPaymentService {
    constructor() {
        this.clientId = process.env.VIVA_CLIENT_ID;
        this.clientSecret = process.env.VIVA_CLIENT_SECRET;
    }

    async getAccessToken() {
        try {
            const response = await axios.post(
                'https://accounts.vivapayments.com/connect/token',
                qs.stringify({ grant_type: 'client_credentials' }),
                {
                    auth: {
                        username: this.clientId,
                        password: this.clientSecret,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const data = response.data;
            console.log('Received access token:', data.access_token);

            return data.access_token;
        } catch (error) {
            console.error('Error requesting access token:', error.response ? error.response.data : error.message);
            throw new Error('Failed to retrieve access token');
        }
    }

    async createOrder(amount, customerDetails) {
        try {
            const adjustedAmount = amount * 1 ;
            const accessToken = await this.getAccessToken();

            const response = await axios.post(
                'https://api.vivapayments.com/checkout/v2/orders',
                {
                    amount:adjustedAmount,
                    customerTrns: customerDetails.customerTrns,
                    customer: {
                        email: customerDetails.email,
                        fullName: customerDetails.fullName,
                        requestLang: customerDetails.requestLang,
                    },
                    paymentNotification: true,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const order = response.data;
            console.log('Order created successfully:', order);

            return order;
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
            throw new Error('Failed to create order');
        }
    }
}

module.exports = VivaPaymentService;
