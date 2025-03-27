import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = ({ paymentLink }) => {
    if (!paymentLink) {
        return (
            <div className="flex flex-col items-center p-4 bg-red-100 text-red-600 rounded-lg">
                <p className="text-lg font-semibold">Error: Payment link is missing!</p>
                <p className="text-sm">Please provide a valid UPI payment link.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Scan to Pay</h2>
            <QRCodeSVG 
                value={paymentLink} 
                size={200} 
                aria-label="QR Code for Payment"
            />
            <p className="text-sm mt-2 text-gray-500">
                Scan this QR code to complete your payment.
            </p>
        </div>
    );
};

export default QRCodeGenerator;
