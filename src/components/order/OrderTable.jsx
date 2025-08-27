import { TableBody, TableCell, TableRow } from "@windmill/react-ui";

import { useTranslation } from "react-i18next";
import { FiZoomIn, FiTruck, FiPackage, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

//internal import

import Status from "@/components/table/Status";
import Tooltip from "@/components/tooltip/Tooltip";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import PrintReceipt from "@/components/form/others/PrintReceipt";
import SelectStatus from "@/components/form/selectOption/SelectStatus";
import DeliveryLocationIndicator from "@/components/delivery/DeliveryLocationIndicator";
import DeliveryProgressIndicator from "@/components/delivery/DeliveryProgressIndicator";
import { adminCancelOrder } from "@/services/OrderServices";

const OrderTable = ({ orders }) => {
  const { t } = useTranslation();
  const { showDateTimeFormat, currency, getNumberTwo } = useUtilsFunction();

  const handleAdminCancel = async (order) => {
    const reason = window.prompt("Enter cancel reason:", "Cancelled by admin");
    if (reason === null) return;
    try {
      await adminCancelOrder(order._id, reason || "Cancelled by admin");
      window.alert("Order cancelled successfully");
      window.location.reload();
    } catch (err) {
      console.error("Admin cancel error:", err);
      window.alert(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <>
      <TableBody className="dark:bg-gray-900">
        {orders?.map((order, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?.invoice}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {showDateTimeFormat(order?.updatedDate)}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <span className="text-sm">{order?.user_info?.name}</span>{" "}
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {order?.paymentMethod}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {getNumberTwo(order?.total)}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <Status status={order?.status} />
              {(order?.status === 'Processing' || order?.status === 'Out for Delivery') && (
                <div className="mt-1">
                  <Link to={`/order/${order._id}`}>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 cursor-pointer">
                      <FiTruck className="mr-1" size={12} />
                      View Checklist
                    </span>
                  </Link>
                  <DeliveryProgressIndicator orderId={order._id} orderStatus={order?.status} />
                </div>
              )}
            </TableCell>

            <TableCell className="text-center">
              <SelectStatus id={order._id} order={order} />
            </TableCell>

            <TableCell className="text-center">
              <DeliveryLocationIndicator order={order} />
            </TableCell>

            <TableCell className="text-right flex justify-end space-x-2">
              <PrintReceipt orderId={order._id} />

              {/* Admin Cancel Button */}
              {!(order?.status === 'Delivered' || order?.status === 'Cancel' || order?.status === 'Cancelled') && (
                <button
                  onClick={() => handleAdminCancel(order)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
                  title="Cancel Order"
                >
                  <FiX className="mr-1" size={12} />
                  Cancel
                </button>
              )}

              <span className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600">
                <Link to={`/order/${order._id}`}>
                  <Tooltip
                    id="view"
                    Icon={FiZoomIn}
                    title={t("ViewInvoice")}
                    bgColor="#059669"
                  />
                </Link>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrderTable;
