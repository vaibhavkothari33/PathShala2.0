// import React, { useState, useCallback } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import { toast } from "react-hot-toast";
// import { jsPDF } from "jspdf";
// import { 
//   CheckCircleIcon, 
//   XCircleIcon, 
//   DownloadIcon 
// } from "lucide-react";

// // Configuration object for payment details
// const PAYMENT_CONFIG = {
//   amount: 500,
//   currency: "INR",
//   upiId: "pranjalsrivastava.2021@ibl",
//   merchantName: "PathShala"
// };

// const RazorpayPayment = () => {
//   const [paymentState, setPaymentState] = useState({
//     status: 'initial', // 'initial', 'loading', 'success', 'failed'
//     transactionId: null,
//     errorMessage: null
//   });

//   // Generate UPI Payment Link dynamically
//   const generateUPIPaymentLink = useCallback(() => {
//     const { upiId, merchantName, amount, currency } = PAYMENT_CONFIG;
//     return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=${currency}`;
//   }, []);

//   // Simulate payment verification process
//   const handlePaymentVerification = useCallback(() => {
//     setPaymentState(prev => ({ ...prev, status: 'loading' }));

//     const paymentSimulation = new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const simulatedOutcome = Math.random();
//         if (simulatedOutcome > 0.2) {
//           resolve({
//             transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
//             amount: `₹${PAYMENT_CONFIG.amount}`,
//             date: new Date().toLocaleString()
//           });
//         } else {
//           reject(new Error("Payment verification failed. Please try again."));
//         }
//       }, 3000);
//     });

//     toast.promise(
//       paymentSimulation,
//       {
//         loading: 'Verifying payment...',
//         success: (data) => {
//           setPaymentState({
//             status: 'success',
//             transactionId: data.transactionId,
//             errorMessage: null
//           });
//           return 'Payment successful!';
//         },
//         error: (err) => {
//           setPaymentState({
//             status: 'failed',
//             transactionId: null,
//             errorMessage: err.message
//           });
//           return err.message;
//         }
//       }
//     );
//   }, []);

//   // Download payment receipt as PDF
//   const downloadReceipt = useCallback(() => {
//     if (paymentState.status !== 'success') return;

//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Payment Receipt", 20, 20);
//     doc.setFontSize(12);
//     doc.text(`Transaction ID: ${paymentState.transactionId}`, 20, 40);
//     doc.text(`Amount: ₹${PAYMENT_CONFIG.amount}`, 20, 50);
//     doc.text(`Date: ${new Date().toLocaleString()}`, 20, 60);
//     doc.text(`Status: Success`, 20, 70);
//     doc.save("payment_receipt.pdf");
//   }, [paymentState]);

//   const renderPaymentButton = () => {
//     switch (paymentState.status) {
//       case 'loading':
//         return (
//           <div className="flex items-center justify-center mt-4">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
//             <p className="ml-4 text-blue-500 font-semibold">Verifying Payment...</p>
//           </div>
//         );
//       case 'success':
//         return (
//           <div className="mt-6 bg-green-100 p-4 rounded-lg text-green-700 flex flex-col items-center">
//             <div className="flex items-center mb-4">
//               <CheckCircleIcon className="mr-2 text-green-500" />
//               <h2 className="text-lg font-semibold">Payment Successful!</h2>
//             </div>
//             <div className="text-center mb-4">
//               <p>Transaction ID: {paymentState.transactionId}</p>
//               <p>Amount: ₹{PAYMENT_CONFIG.amount}</p>
//               <p>Date: {new Date().toLocaleString()}</p>
//             </div>
//             <button
//               onClick={downloadReceipt}
//               className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//             >
//               <DownloadIcon className="mr-2" /> Download Receipt
//             </button>
//           </div>
//         );
//       case 'failed':
//         return (
//           <div className="mt-6 bg-red-100 p-4 rounded-lg text-red-700 flex items-center">
//             <XCircleIcon className="mr-2 text-red-500" />
//             <p>{paymentState.errorMessage}</p>
//           </div>
//         );
//       default:
//         return (
//           <button
//             onClick={handlePaymentVerification}
//             className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
//           >
//             Confirm Payment
//           </button>
//         );
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
//         <h1 className="text-2xl font-bold mb-4">Scan & Pay via UPI</h1>
//         <p className="text-gray-600 mb-4">Scan the QR code to pay ₹{PAYMENT_CONFIG.amount}.</p>

//         <div className="flex justify-center mb-4">
//           <QRCodeSVG value={generateUPIPaymentLink()} size={200} />
//         </div>
//         <p className="text-gray-500 mb-4">Or tap below to open UPI app:</p>
//         <a
//           href={generateUPIPaymentLink()}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//         >
//           Pay Now
//         </a>
//         {renderPaymentButton()}

//         {paymentState.status === 'initial' && (
//           <p className="mt-4 text-red-500 font-semibold">
//             Ensure you complete payment before confirming.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RazorpayPayment;
import React, { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  DownloadIcon,
  QrCodeIcon 
} from "lucide-react";

// Configuration object for payment details
const PAYMENT_CONFIG = {
  amount: 500,
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
        ['Amount', '₹' + details.amount],
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

  // Rest of the component remains the same as in the previous version...

  const renderPaymentButton = () => {
    switch (paymentState.status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center mt-4 space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
            <p className="text-blue-500 font-medium">Processing Payment...</p>
          </div>
        );
      case 'success':
        return (
          <div className="mt-6 bg-green-50 border border-green-200 p-5 rounded-lg text-green-800 flex flex-col items-center">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="mr-2 w-8 h-8 text-green-500" />
              <h2 className="text-xl font-bold">Payment Successful</h2>
            </div>
            <div className="text-center mb-4 space-y-2">
              <p><span className="font-semibold">Transaction ID:</span> {paymentState.transactionId}</p>
              <p><span className="font-semibold">Amount:</span> ₹{PAYMENT_CONFIG.amount}</p>
              <p><span className="font-semibold">Date:</span> {new Date().toLocaleString()}</p>
            </div>
            <button
              onClick={downloadReceipt}
              className="flex items-center bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition"
            >
              <DownloadIcon className="mr-2" /> Download Receipt
            </button>
          </div>
        );
      case 'failed':
        return (
          <div className="mt-6 bg-red-50 border border-red-200 p-5 rounded-lg text-red-800 flex items-center">
            <XCircleIcon className="mr-3 w-8 h-8 text-red-500" />
            <p className="font-medium">{paymentState.errorMessage}</p>
          </div>
        );
      default:
        return (
          <button
            onClick={handlePaymentVerification}
            className="mt-4 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition space-x-2"
          >
            <QrCodeIcon className="mr-2" /> Confirm Payment
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full border border-blue-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">PathShala</h1>
          <p className="text-gray-500">Complete your course enrollment</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            Scan & Pay via UPI
          </h2>
          <p className="text-gray-600 mb-4">Scan the QR code to pay ₹{PAYMENT_CONFIG.amount}</p>

          <div className="flex justify-center mb-4">
            <QRCodeSVG 
              value={generateUPIPaymentLink()} 
              size={250} 
              bgColor={"#F0F9FF"}
              fgColor={"#1E40AF"}
            />
          </div>
          
          <a
            href={generateUPIPaymentLink()}
            className="inline-flex items-center bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition"
          >
            <QrCodeIcon className="mr-2" /> Open UPI App
          </a>
        </div>

        {renderPaymentButton()}

        {paymentState.status === 'initial' && (
          <p className="mt-4 text-center text-red-500 font-medium">
            Ensure you complete payment before confirming.
          </p>
        )}
      </div>
    </div>
  );
};

export default RazorpayPayment;