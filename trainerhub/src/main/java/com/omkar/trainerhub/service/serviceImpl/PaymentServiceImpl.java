package com.omkar.trainerhub.service.serviceImpl;

import com.omkar.trainerhub.model.Payment;
import com.omkar.trainerhub.model.Requirement;
import com.omkar.trainerhub.repository.PaymentRepo;
import com.omkar.trainerhub.repository.modelrepos.RequirementRepo;
import com.omkar.trainerhub.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.api.key}")
    private String razorpayKey;

    @Value("${razorpay.api.secret}")
    private String razorpaySecret;

    private PaymentRepo paymentRepo;
    private RequirementRepo requirementRepo;

    public PaymentServiceImpl(PaymentRepo paymentRepo, RequirementRepo requirementRepo)
    {
        this.paymentRepo = paymentRepo;
        this.requirementRepo = requirementRepo;
    }

    @Override
    public String createOrder(Long requirementId, Double amount) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKey, razorpaySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // amount in the smallest currency unit (paise)
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "req_" + requirementId);

        Order order = razorpay.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setRazorpayOrderId(order.get("id"));
        payment.setAmount(amount);
        payment.setCurrency("INR");
        payment.setRequirementId(requirementId);
        payment.setStatus("Created");
        paymentRepo.save(payment);

        return order.get("id");
    }

    @Override
    public boolean verifyPayment(Map<String, String> paymentData) {
        String orderId = paymentData.get("razorpay_order_id");
        String paymentId = paymentData.get("razorpay_payment_id");
        String signature = paymentData.get("razorpay_signature");

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKey, razorpaySecret);

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpaySecret);

            if (isValid) {
                Optional<Payment> paymentOpt = paymentRepo.findByRazorpayOrderId(orderId);
                if (paymentOpt.isPresent()) {
                    Payment payment = paymentOpt.get();
                    payment.setRazorpayPaymentId(paymentId);
                    payment.setRazorpaySignature(signature);
                    payment.setStatus("Paid");
                    paymentRepo.save(payment);

                    Optional<Requirement> reqOpt = requirementRepo.findById(payment.getRequirementId());
                    if (reqOpt.isPresent()) {
                        Requirement requirement = reqOpt.get();
                        requirement.setStatus("Closed");
                        requirement.setPaymentStatus("Completed");
                        requirementRepo.save(requirement);
                    }
                }
            }
            return isValid;
        } catch (RazorpayException e) {
            e.printStackTrace();
            return false;
        }
    }
}