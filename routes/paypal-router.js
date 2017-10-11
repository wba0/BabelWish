const express = require('express');
const request = require('request');
const paypal = require('paypal-rest-sdk');
const router = express.Router();
const JobModel = require('../models/job-model');


paypal.configure({
  "mode": process.env.payPalMode,
  "client_id": process.env.payPalClientId,
  "client_secret": process.env.payPalClientSecret
});

router.post("/paypal/createpayment/:jobId", (req, res, next) => {
  JobModel.findById(req.params.jobId)
		.populate("beneficiaryId")
		.exec(
    (err, jobFromDb) => {
      const payment = {
        intent: "sale",
        redirect_urls: {
          return_url: "http://example.com/dashboard",
          cancel_url: "http://example.com/dashboard"
        },
        payer:{
					payment_method: "paypal"
				},
        transactions: [{
          amount: {
            total: jobFromDb.price,
            currency: "USD"
          },
					payee: {
						email: jobFromDb.beneficiaryId.payPalAddress
					},
          item_list: {
            items: [{
              quantity: 1,
              name: "translation job",
              price: jobFromDb.price,
              currency: "USD",
              description: "languages"
            }]
          }
        }]
      };
      paypal.payment.create(payment, (error, paypalInfo) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            errorMessage: "fuck"
          })
          return;
        }
				jobFromDb.paypalPaymentId = paypalInfo.id;
				jobFromDb.save((err) => {
					if(err){
						res.status(500).json({errorMessage: "fuck"})
						return;
					}
					res.status(200).json({
						paymentID: paypalInfo.id
					});
				});
      });
  });
});

router.post("/paypal/executepayment", (req, res, next) => {
	const execution = {
		payer_id: req.body.payerID
	};

	paypal.payment.execute(req.body.paymentID, execution, (error, paypalInfo) => {
		if(error){
			res.status(500).json({errorMessage: "fuck"});
			return;
		}
	JobModel.findOne(
		{ paypalPaymentId: req.body.paymentID },
		(err, jobFromDb) => {
			if(err){
				res.status(500).json({errorMessage: "feck"});
				return;
			}
			jobFromDb.set({
				finishedNotPaid: false,
				finishedAndPaid: true
			});
			jobFromDb.save((err) => {
				if(err){
					res.status(500).json({errorMessage: "fucl"})
					console.log("error", err);
				}
				res.status(200).json(jobFromDb);
			});
		}
	);
})
});

module.exports = router;
