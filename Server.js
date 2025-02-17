const express = require('express');
const Paydunya = require('paydunya');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const setup = new Paydunya.Setup({
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  publicKey: 'live_public_8GS9iEEXpV0vD6Xrg9BZRiMpggE',
  privateKey: 'live_private_uN5Fg1NATULKuQH0EDKqKzYtPV2',
  token: 'vUuMZQvzt7PCHi3eQRu5',
  mode: 'live'
});

app.post('/api/payment', async (req, res) => {
  try {
    const invoice = new Paydunya.Checkout.Invoice(setup);
    invoice.addItem("Achat Crypto", 1, req.body.amount, req.body.amount);
    
    const paymentResponse = await setup.requestMobilePayment({
      invoice: await invoice.create(),
      phone: req.body.phone,
      provider: req.body.provider
    });

    res.json({ url: paymentResponse.response_text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
