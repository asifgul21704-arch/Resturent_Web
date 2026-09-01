import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

export const OrderInvoiceModal: React.FC = () => {
  const { invoiceModalOrder, setInvoiceModalOrder, showToast } = useApp();

  if (!invoiceModalOrder) return null;

  const order: Order = invoiceModalOrder;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
    showToast('Invoice PDF generated! Select "Save as PDF" in your print dialog.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[32px] max-w-2xl w-full overflow-hidden shadow-2xl border border-[#EDE7DD] relative my-6 print:shadow-none print:border-none print:rounded-none print:m-0"
      >
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="p-4 bg-[#FAF7F2] border-b border-[#F0EAE1] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-[#2C2724]">Official Foody Tax Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#EDE7DD] text-xs font-bold text-[#2C2724] hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#E85B43]" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 rounded-full bg-[#E85B43] text-white text-xs font-bold hover:bg-[#D44730] flex items-center gap-1.5 shadow-md shadow-[#E85B43]/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setInvoiceModalOrder(null)}
              className="w-8 h-8 rounded-full bg-white border border-[#EDE7DD] hover:bg-[#F0EAE1] flex items-center justify-center text-[#2C2724] ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-order-invoice" className="p-8 sm:p-10 space-y-8 text-[#2C2724]">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-[#EAE3D5] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#E85B43] flex items-center justify-center text-white font-black text-sm">
                  🍔
                </div>
                <span className="text-2xl font-black text-[#E85B43] tracking-tight font-display">
                  Foody
                </span>
              </div>
              <p className="text-xs text-[#78716A]">The FOODY Gourmet Delivery Co.</p>
              <p className="text-[11px] text-[#8C847A]">Via del Corso 84, Rome, Italy</p>
              <p className="text-[11px] text-[#8C847A]">VAT Reg: IT-8932019482</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-widest text-[#E85B43] bg-[#E85B43]/10 px-2.5 py-0.5 rounded-full">
                TAX INVOICE
              </span>
              <h3 className="text-lg font-black text-[#2C2724] font-mono mt-2">
                #{order.id}
              </h3>
              <p className="text-xs text-[#78716A]">
                Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span className="inline-block mt-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Paid in Full ({order.paymentMethod.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold text-[#8C847A] uppercase tracking-wider mb-1">Billed & Delivered To:</p>
              <p className="font-black text-sm text-[#2C2724]">{order.customerName}</p>
              <p className="text-[#6B655F]">{order.deliveryAddress.street}</p>
              <p className="text-[#6B655F]">{order.deliveryAddress.city}, {order.deliveryAddress.zipCode}</p>
              <p className="text-[#6B655F] mt-1">📞 {order.customerPhone}</p>
              <p className="text-[#6B655F]">✉️ {order.customerEmail}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-[#8C847A] uppercase tracking-wider mb-1">Dispatch Details:</p>
              <p className="text-[#6B655F]">Assigned Courier: <strong>{order.courier?.name || order.courierName || 'Marco Rossi'}</strong></p>
              <p className="text-[#6B655F]">Vehicle: Red Vespa 125 (FDY-7729)</p>
              <p className="text-[#6B655F]">Delivery Status: <span className="font-bold uppercase text-[#E85B43]">{order.status.replace('_', ' ')}</span></p>
              {order.deliveryNotes && (
                <p className="text-[11px] text-[#8C847A] italic mt-1">Note: "{order.deliveryNotes}"</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#2C2724] text-[#2C2724] font-black">
                  <th className="py-2">Item / Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {order.items.map((item, idx) => {
                  const basePrice = item.foodItem.discountPrice || item.foodItem.price;
                  const addonsSum = item.selectedAddons.reduce((acc, a) => acc + a.price, 0);
                  const lineTotal = (basePrice + addonsSum) * item.quantity;

                  return (
                    <tr key={idx} className="py-2">
                      <td className="py-2.5">
                        <p className="font-bold text-[#2C2724]">{item.foodItem.name}</p>
                        {item.selectedAddons.length > 0 && (
                          <p className="text-[10px] text-[#78716A]">
                            Add-ons: {item.selectedAddons.map(a => `${a.name} (+$${a.price.toFixed(2)})`).join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[10px] text-[#A0988E] italic">Notes: {item.specialInstructions}</p>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-bold text-[#2C2724]">{item.quantity}</td>
                      <td className="py-2.5 text-right text-[#6B655F]">${(basePrice + addonsSum).toFixed(2)}</td>
                      <td className="py-2.5 text-right font-black text-[#2C2724]">${lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="flex justify-end pt-4 border-t border-[#EAE3D5]">
            <div className="w-64 space-y-1.5 text-xs text-[#6B655F]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[#2C2724]">${order.subtotal.toFixed(2)}</span>
              </div>
              {(order.discount || order.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-${(order.discount || order.discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {(order.tip || order.tipAmount || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Courier Tip:</span>
                  <span>${(order.tip || order.tipAmount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#2C2724] pt-2 border-t-2 border-[#2C2724]">
                <span>Total Paid:</span>
                <span className="text-[#E85B43]">${(order.total || order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="pt-6 border-t border-[#EAE3D5] flex items-center justify-between text-[11px] text-[#8C847A]">
            <div className="space-y-1">
              <p className="font-bold text-[#2C2724]">Thank you for ordering with Foody!</p>
              <p>For questions regarding this order, contact support@foody.kitchen</p>
              <p className="text-[10px]">Digitally certified via Foody Cloud Engine</p>
            </div>

            <div className="text-center font-mono text-[9px] text-[#57514B]">
              <div className="w-28 h-7 bg-neutral-900 mx-auto rounded-xs opacity-80 flex items-center justify-around px-1">
                <span className="w-0.5 h-full bg-white" />
                <span className="w-1 h-full bg-white" />
                <span className="w-0.5 h-full bg-white" />
                <span className="w-1.5 h-full bg-white" />
                <span className="w-0.5 h-full bg-white" />
                <span className="w-1 h-full bg-white" />
              </div>
              <p className="mt-1">{order.id}</p>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
