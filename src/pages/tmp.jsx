import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  DollarSign,
  X,
  ChevronLeft,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderDetails = ({ orders, waitingOrders, completedOrders, updateOrderStatus, handleAddPayment, handleCompleteOrder }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the order in the appropriate array based on its status
  const order = 
    [...waitingOrders, ...orders, ...completedOrders].find(o => o.id === id);
  
  const [priceProposal, setPriceProposal] = useState({
    amount: "",
    notes: "",
  });
  
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionForm, setCompletionForm] = useState({
    elements: [],
    currentElement: "",
    notes: "",
  });

  const handleAddElement = () => {
    if (completionForm.currentElement.trim()) {
      setCompletionForm({
        ...completionForm,
        elements: [...completionForm.elements, completionForm.currentElement.trim()],
        currentElement: "",
      });
    }
  };

  const handleRemoveElement = (index) => {
    const newElements = [...completionForm.elements];
    newElements.splice(index, 1);
    setCompletionForm({ ...completionForm, elements: newElements });
  };

  const handleSubmitPriceProposal = () => {
    // In a real app, you would send this to your backend
    const updatedWaitingOrders = waitingOrders.map(o => 
      o.id === order.id ? { 
        ...o, 
        estimatedTotal: parseFloat(priceProposal.amount),
        proposalNotes: priceProposal.notes 
      } : o
    );
    // Update state or make API call
    setWaitingOrders(updatedWaitingOrders);
    navigate(-1); // Go back to orders list
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-md py-4 px-6 lg:px-8 sticky top-0 z-50 border-b transition-all duration-300 ${
        darkMode
          ? "bg-gray-900/80 border-gray-700/50"
          : "bg-white/80 border-gray-200/50"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            {t("orderDetails")} - {order.id}
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className={`rounded-2xl p-6 border transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
            : "bg-white/80 border-gray-200/50 backdrop-blur-sm shadow-sm"
        }`}>
          {/* Order Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {order.title}
              </h2>
              <p className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {order.date} • {order.client}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === "waiting"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "inProgress"
                ? "bg-blue-100 text-blue-800"
                : order.status === "shipping"
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
            }`}>
              {order.status === "waiting"
                ? t("waiting")
                : order.status === "inProgress"
                ? t("inProgress")
                : order.status === "shipping"
                ? t("shipping")
                : t("delivered")}
            </span>
          </div>

          {/* Order Images */}
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {order.images.map((img, index) => (
                <div key={index} className="relative h-48 rounded-xl overflow-hidden">
                  <img
                    src={img}
                    alt={`${order.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={`font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {t("clientInformation")}
              </h3>
              <div className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <p className="font-medium">{order.client}</p>
                <p className="text-sm">{order.email}</p>
                <p className="text-sm">{order.phone}</p>
              </div>
            </div>

            <div>
              <h3 className={`font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {t("orderInformation")}
              </h3>
              <div className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <p>
                  <span className="font-medium">ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-medium">Wood Type:</span> {order.woodType}
                </p>
                {order.status !== "waiting" && (
                  <>
                    <p>
                      <span className="font-medium">Estimated Total:</span> $
                      {order.estimatedTotal?.toLocaleString() || "N/A"}
                    </p>
                    {order.status === "delivered" && (
                      <p>
                        <span className="font-medium">Completed:</span>{" "}
                        {new Date(
                          order.completionDetails?.completedAt || order.date
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Conditional Sections Based on Order Status */}
          {order.status === "waiting" && (
            <div className={`p-4 rounded-lg mb-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <h3 className={`font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {t("priceProposal")}
              </h3>
              
              {!order.estimatedTotal ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {t("estimatedPrice")}
                    </label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        $
                      </span>
                      <input
                        type="number"
                        value={priceProposal.amount}
                        onChange={(e) => setPriceProposal({
                          ...priceProposal,
                          amount: e.target.value
                        })}
                        className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {t("notes")} ({t("optional")})
                    </label>
                    <textarea
                      rows={3}
                      value={priceProposal.notes}
                      onChange={(e) => setPriceProposal({
                        ...priceProposal,
                        notes: e.target.value
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("anySpecialNotes")}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitPriceProposal}
                      disabled={!priceProposal.amount}
                      className={`px-4 py-2 rounded-lg ${
                        !priceProposal.amount
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-400 text-black"
                      }`}
                    >
                      {t("submitProposal")}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    ${order.estimatedTotal.toLocaleString()}
                  </p>
                  {order.proposalNotes && (
                    <p className={`text-sm mt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {order.proposalNotes}
                    </p>
                  )}
                  <p className={`text-sm mt-4 ${
                    darkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}>
                    {t("waitingForClientApproval")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Payment Information (for non-waiting orders) */}
          {order.status !== "waiting" && (
            <div className={`p-4 rounded-lg mb-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`font-bold flex items-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  <DollarSign className="mr-2" size={18} />
                  {t("paymentInformation")}
                </h3>
                {order.status !== "delivered" && (
                  <button
                    onClick={() => handleAddPayment(order)}
                    className={`text-sm flex items-center space-x-1 px-3 py-1 rounded-lg ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-amber-400"
                        : "bg-gray-200 hover:bg-gray-300 text-blue-600"
                    }`}
                  >
                    <Plus size={14} />
                    <span>{t("addPayment")}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {t("estimatedTotal")}
                  </p>
                  <p className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    ${order.estimatedTotal?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {t("amountPaid")}
                  </p>
                  <p className={`font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}>
                    ${order.amountPaid?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {t("remainingBalance")}
                  </p>
                  <p className={`font-medium ${
                    darkMode ? "text-amber-400" : "text-amber-600"
                  }`}>
                    $
                    {(
                      (order.estimatedTotal || 0) - 
                      (order.amountPaid || 0)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {order.payments?.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {t("paymentHistory")}
                  </h4>
                  <div className={`rounded-lg overflow-hidden border ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}>
                    {order.payments.map((payment, index) => (
                      <div
                        key={index}
                        className={`p-3 border-b ${
                          darkMode
                            ? "border-gray-600 bg-gray-800/50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}>
                              ${payment.amount.toLocaleString()}
                            </p>
                            <p className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {payment.date} • {payment.method}
                            </p>
                          </div>
                          <p className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {payment.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completion Details (for completed orders) */}
          {order.status === "delivered" && order.completionDetails && (
            <div className={`p-4 rounded-lg mb-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <h3 className={`font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {t("completionDetails")}
              </h3>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {t("articlesUsed")}
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {order.completionDetails.elements.map((element, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {element}
                    </span>
                  ))}
                </div>

                {order.completionDetails.notes && (
                  <>
                    <h4 className={`text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {t("notes")}
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {order.completionDetails.notes}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {order.status === "waiting" && order.estimatedTotal && (
              <button
                onClick={() => updateOrderStatus(order.id, "inProgress")}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
              >
                {t("markAsInProgress")}
              </button>
            )}

            {order.status === "inProgress" && (
              <>
                <button
                  onClick={() => updateOrderStatus(order.id, "shipping")}
                  className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium"
                >
                  {t("markAsShipping")}
                </button>
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                >
                  {t("markAsCompleted")}
                </button>
              </>
            )}

            {order.status === "shipping" && (
              <button
                onClick={() => setShowCompletionForm(true)}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
              >
                {t("markAsCompleted")}
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              {t("backToOrders")}
            </button>
          </div>
        </div>
      </main>

      {/* Completion Form Modal */}
      {showCompletionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {t("completeOrder")}
                </h2>
                <button
                  onClick={() => setShowCompletionForm(false)}
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {t("articlesUsed")}
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={completionForm.currentElement}
                      onChange={(e) => setCompletionForm({
                        ...completionForm,
                        currentElement: e.target.value
                      })}
                      className={`flex-1 px-4 py-2 rounded-l-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder={t("addArticle")}
                    />
                    <button
                      onClick={handleAddElement}
                      className="px-4 py-2 rounded-r-lg bg-yellow-500 hover:bg-yellow-400 text-black"
                    >
                      {t("add")}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {completionForm.elements.map((element, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">{element}</span>
                        <button
                          onClick={() => handleRemoveElement(index)}
                          className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {t("completionNotes")}
                  </label>
                  <textarea
                    rows={3}
                    value={completionForm.notes}
                    onChange={(e) => setCompletionForm({
                      ...completionForm,
                      notes: e.target.value
                    })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={t("anySpecialNotes")}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCompletionForm(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    handleCompleteOrder(order.id, completionForm);
                    setShowCompletionForm(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                >
                  {t("completeOrder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;