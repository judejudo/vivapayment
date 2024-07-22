const axios = require('axios');
require('dotenv').config();

class VivaPaymentService {
    constructor() {
        this.clientId = process.env.VIVA_CLIENT_ID;
        this.clientSecret = process.env.VIVA_CLIENT_SECRET;
    }

    async getAccessToken() {
        try {
            const response = await axios.post('https://accounts.vivapayments.com/connect/token', {}, {
                auth: {
                    username: this.clientId,
                    password: this.clientSecret
                },
                params: {
                    grant_type: 'client_credentials'
                }
            });

            console.log('Received access token from Viva Wallet API', response.data.access_token);
            return response.data.access_token;
        } catch (error) {
            console.error('Error fetching access token', error);
            throw error;
        }
    }

    async createOrder(amount, customerDetails) {
        try {
            const accessToken = await this.getAccessToken();

            const response = await axios.post('https://api.vivapayments.com/checkout/v2/orders', {
                amount: amount,
                customerTrns: customerDetails.customerTrns,
                customer: {
                    email: customerDetails.email,
                    fullName: customerDetails.fullName,
                    requestLang: customerDetails.requestLang
                },
                paymentNotification: true
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Order created successfully', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating order', error);
            throw error;
        }
    }
}

module.exports = VivaPaymentService;
