const VivaPaymentService = require('../services/vivaPaymentService');
const vivaPaymentService = new VivaPaymentService();

class PaymentController {
    async createOrder(req, res) {
        try {
            const { amount, customerTrns, email, fullName, requestLang } = req.body;

            if (!amount || !customerTrns || !email || !fullName || !requestLang) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const customerDetails = { customerTrns, email, fullName, requestLang };

            const order = await vivaPaymentService.createOrder(amount, customerDetails);

            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
