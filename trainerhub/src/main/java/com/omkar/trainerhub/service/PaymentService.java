package com.omkar.trainerhub.service;


import com.razorpay.RazorpayException;

import java.util.Map;

public interface PaymentService {
    String createOrder(Long requirementId, Double amount) throws RazorpayException;
    boolean verifyPayment(Map<String, String> paymentData);
}