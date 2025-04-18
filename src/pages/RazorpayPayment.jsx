import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ClockIcon,
  CreditCardIcon,
  BadgeCheckIcon,
  ArrowRightIcon
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
  const navigate = useNavigate();
  const [paymentState, setPaymentState] = useState({
    status: 'initial', // 'initial', 'loading', 'success', 'failed'
    transactionId: null,
    errorMessage: null,
    paymentDetails: null
  });
  const [countdown, setCountdown] = useState(1800); // 30 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && paymentState.status === 'initial') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, paymentState.status]);

  // Format countdown timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  // Auto-redirect to dashboard after successful payment
  useEffect(() => {
    if (paymentState.status === 'success') {
      const redirectTimer = setTimeout(() => {
        navigate('/coaching/dashboard');
      }, 5000); // 5 seconds delay before redirect
      
      return () => clearTimeout(redirectTimer);
    }
  }, [paymentState.status, navigate]);

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

  const goBack = () => {
    window.history.back();
  };

  const goToDashboard = () => {
    navigate('/coaching/dashboard');
  };

  const renderPaymentButton = () => {
    switch (paymentState.status) {
      case 'loading':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mt-4 space-x-3 bg-blue-50 p-6 rounded-xl"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            <p className="text-blue-600 font-medium text-lg">Verifying Your Payment...</p>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-green-50 border border-green-200 p-6 rounded-xl text-green-800"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircleIcon className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Payment Successful!</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="font-medium text-gray-600">Transaction ID</span>
                <span className="text-sm font-mono bg-green-50 px-3 py-1 rounded">{paymentState.transactionId}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="font-medium text-gray-600">Amount</span>
                <span className="text-lg font-bold text-green-700">₹{PAYMENT_CONFIG.amount}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="font-medium text-gray-600">Date</span>
                <span className="text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadReceipt}
                className="w-full flex items-center justify-center bg-white border border-green-300 text-green-700 px-5 py-3 rounded-lg hover:bg-green-50 transition shadow"
              >
                <DownloadIcon className="mr-2" /> Download Receipt
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToDashboard}
                className="w-full flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition shadow-lg"
              >
                Go to Dashboard <ArrowRightIcon className="ml-2 w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="mt-6 text-center text-green-600 text-sm">
              <div className="flex items-center justify-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>Redirecting to dashboard in 5 seconds...</span>
              </div>
            </div>
          </motion.div>
        );
      case 'failed':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-50 border border-red-200 p-6 rounded-xl text-red-800"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <XCircleIcon className="w-16 h-16 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-red-700 mb-4">Payment Failed</h2>
            <p className="mb-6 text-center">{paymentState.errorMessage}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentVerification}
              className="w-full bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition shadow-lg"
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
            className="mt-4 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-4 rounded-xl transition shadow-lg"
          >
            <BadgeCheckIcon className="mr-2" /> Confirm Payment
          </motion.button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-blue-100"
        >
          {/* Header with progress indicator */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={goBack}
                className="flex items-center text-blue-100 hover:text-white transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                <span>Back</span>
              </button>
              <div className="flex items-center">
                <ShieldIcon className="h-5 w-5 text-blue-200 mr-1" />
                <span className="text-sm">Secure Payment</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mt-4">Complete Your Payment</h1>
            <p className="text-blue-100">PathShala Institute Registration</p>
            
            {/* Progress steps */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <div className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold">1</div>
                <span className="ml-2 text-sm text-blue-100">Registration</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-blue-400">
                <div className="h-full bg-white" style={{width: '50%'}}></div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-500 text-white ring-2 ring-blue-200 rounded-full h-8 w-8 flex items-center justify-center font-bold">2</div>
                <span className="ml-2 text-sm text-white font-medium">Payment</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-blue-400"></div>
              <div className="flex items-center">
                <div className="bg-blue-500 text-blue-200 rounded-full h-8 w-8 flex items-center justify-center font-bold">3</div>
                <span className="ml-2 text-sm text-blue-100">Dashboard</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <CreditCardIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
              </div>
              <div className="bg-blue-50 text-blue-700 font-medium px-4 py-2 rounded-full">
                ₹{PAYMENT_CONFIG.amount}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-700">
                  Scan & Pay via UPI
                </h2>
                <div className="flex items-center gap-2 text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{formatTime(countdown)}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100 mx-auto">
                  <QRCodeSVG 
                    value={generateUPIPaymentLink()} 
                    size={180} 
                    bgColor={"#FFFFFF"}
                    fgColor={"#1E40AF"}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-gray-600 mb-1 text-sm">Amount to pay</p>
                    <p className="text-3xl font-bold text-blue-700">₹{PAYMENT_CONFIG.amount}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Payment Details:</p>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">UPI ID:</span>
                        <span className="font-mono">PathShala@ybl.in</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Description:</span>
                        <span>Coaching Registerion Fee</span>
                      </div>
                    </div>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={generateUPIPaymentLink()}
                    className="w-full flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <QrCodeIcon className="mr-2" /> Open UPI App
                  </motion.a>
                </div>
              </div>
            </motion.div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Important Note</h3>
                  <p className="text-yellow-700 text-sm">
                    Please complete the payment in your UPI app before clicking the confirm button below. Your payment will be automatically verified.
                  </p>
                </div>
              </div>
            </div>

            {renderPaymentButton()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RazorpayPayment;