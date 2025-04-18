import React, { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  DownloadIcon,
  QrCodeIcon,
  ArrowLeftIcon,
  InfoIcon,
  ShieldIcon,
  ClockIcon
} from "lucide-react";

// Configuration object for payment details
const PAYMENT_CONFIG = {
  amount: 499,
  currency: "INR",
  upiId: "pranjalsrivastava.2021@ibl",
  merchantName: "PathShala",
  description: "Course Enrollment Fee"
};

const RazorpayPayment = () => {
  const [paymentState, setPaymentState] = useState({
    status: 'initial', // 'initial', 'loading', 'success', 'failed'
    transactionId: null,
    errorMessage: null,
    paymentDetails: null
  });

  // Generate UPI Payment Link dynamically
  const generateUPIPaymentLink = useCallback(() => {
    const { upiId, merchantName, amount, currency } = PAYMENT_CONFIG;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=${currency}`;
  }, []);

  // Simulate payment verification process
  const handlePaymentVerification = useCallback(() => {
    setPaymentState(prev => ({ ...prev, status: 'loading' }));

    const paymentSimulation = new Promise((resolve, reject) => {
      setTimeout(() => {
        const simulatedOutcome = Math.random();
        if (simulatedOutcome > 0.2) {
          const paymentDetails = {
            transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
            amount: PAYMENT_CONFIG.amount,
            date: new Date(),
            merchantName: PAYMENT_CONFIG.merchantName,
            description: PAYMENT_CONFIG.description
          };
          resolve(paymentDetails);
        } else {
          reject(new Error("Payment verification failed. Please try again."));
        }
      }, 3000);
    });

    toast.promise(
      paymentSimulation,
      {
        loading: 'Verifying payment...',
        success: (data) => {
          setPaymentState({
            status: 'success',
            transactionId: data.transactionId,
            errorMessage: null,
            paymentDetails: data
          });
          return 'Payment successful!';
        },
        error: (err) => {
          setPaymentState({
            status: 'failed',
            transactionId: null,
            errorMessage: err.message,
            paymentDetails: null
          });
          return err.message;
        }
      }
    );
  }, []);

  const downloadReceipt = useCallback(() => {
    if (paymentState.status !== 'success' || !paymentState.paymentDetails) return;

    const doc = new jsPDF();
    const details = paymentState.paymentDetails;

    // Company Logo and Header
    doc.setFontSize(22);
    doc.setTextColor(33, 150, 243); // Material Blue
    doc.text(PAYMENT_CONFIG.merchantName, 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Official Payment Receipt", 105, 40, { align: 'center' });

    // Payment Details Table
    autoTable(doc, {
      startY: 60,
      head: [['Payment Information', 'Details']],
      body: [
        ['Transaction ID', details.transactionId],
        ['Amount', details.amount],
        ['Date', details.date.toLocaleString()],
        ['Merchant', details.merchantName],
        ['Description', details.description],
        ['Payment Status', 'Successful']
      ],
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold' }
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This is a computer-generated receipt", 105, 280, { align: 'center' });

    doc.save("PathShala_Payment_Receipt.pdf");
  }, [paymentState]);

  const renderPaymentButton = () => {
    switch (paymentState.status) {
      case 'loading':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mt-4 space-x-3 bg-blue-50 p-4 rounded-xl"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
            <p className="text-blue-600 font-medium">Processing Payment...</p>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-green-50 border border-green-200 p-6 rounded-xl text-green-800"
          >
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="mr-3 w-8 h-8 text-green-500" />
              <h2 className="text-xl font-bold">Payment Successful</h2>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Transaction ID</span>
                <span className="text-sm font-mono">{paymentState.transactionId}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Amount</span>
                <span className="text-lg font-bold">₹{PAYMENT_CONFIG.amount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Date</span>
                <span className="text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadReceipt}
              className="w-full flex items-center justify-center bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 transition shadow-lg"
            >
              <DownloadIcon className="mr-2" /> Download Receipt
            </motion.button>
          </motion.div>
        );
      case 'failed':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-50 border border-red-200 p-6 rounded-xl text-red-800"
          >
            <div className="flex items-center mb-4">
              <XCircleIcon className="mr-3 w-8 h-8 text-red-500" />
              <h2 className="text-xl font-bold">Payment Failed</h2>
            </div>
            <p className="mb-4">{paymentState.errorMessage}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentVerification}
              className="w-full bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition shadow-lg"
            >
              Try Again
            </motion.button>
          </motion.div>
        );
      default:
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePaymentVerification}
            className="mt-4 w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl transition shadow-lg"
          >
            <QrCodeIcon className="mr-2" /> Confirm Payment
          </motion.button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-2xl p-8 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">Back</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-500">Secure Payment</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">PathShala</h1>
            <p className="text-gray-500">Complete your course enrollment</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-700">
                Scan & Pay via UPI
              </h2>
              <div className="flex items-center gap-2 text-blue-600">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">Valid for 30 mins</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCodeSVG 
                  value={generateUPIPaymentLink()} 
                  size={200} 
                  bgColor={"#FFFFFF"}
                  fgColor={"#1E40AF"}
                />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-2">Amount to pay</p>
                <p className="text-2xl font-bold text-blue-700">₹{PAYMENT_CONFIG.amount}</p>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={generateUPIPaymentLink()}
                className="w-full flex items-center justify-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition shadow-lg"
              >
                <QrCodeIcon className="mr-2" /> Open UPI App
              </motion.a>
            </div>
          </motion.div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Important Note</h3>
                <p className="text-yellow-700 text-sm">
                  Please complete the payment before clicking the confirm button. Your payment will be verified automatically.
                </p>
              </div>
            </div>
          </div>

          {renderPaymentButton()}
        </motion.div>
      </div>
    </div>
  );
};

export default RazorpayPayment;