const express = require('express');
const request = require('request');
const router = express.Router();

router.post("/paypal/createpayment/:jobId", (req, res, next) => {
  JobModel.findById(
    req.params.jobId,
    (err, jobFromDb) => {

			request(
				{
					method: "POST",
					url: "https://api.sandbox.paypal.com/v1/payments/payment",
					headers: {
						Authorization: "Bearer blah"
					},
					body: {
						intent: "sale",
						redirect_urls: {
							return_url: "balh",
							cancel_url: "balh"
						},
						payment_method: "paypal",
						transactions: [
							{
								amount: {
									total: jobFromDb.price,
									currency: "USD"
								},
								item_list{
									items: [
										{
											quantity: 1,
											name: "translation job",
											price: jobFromDb.price,
											currency: "USD",
											description: "languages"
										}
									]
								}
							}
						]
					}
				},
				(error, response, body) => {
					if(error){
						console.log(error);
						res.status(500).json({errorMessage: "fuck"})
						return;
					}
					const paypalInfo = JSON.parse(body);
					res.status(200).json({paymentID: paypalInfo.id});
				}
			)
    }
  );
  res.send("blah");
});



module.exports = router;
