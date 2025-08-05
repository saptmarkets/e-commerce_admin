import { Badge } from "@windmill/react-ui";

const Status = ({ status }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "Delivered":
        return "Delivered";
      case "Processing":
        return "Processing";
      case "Pending":
        return "Pending";
      case "Received":
        return "Received";
      case "Out for Delivery":
        return "Out for Delivery";
      case "Cancelled":
        return "Cancelled";
      case "Cancel":
        return "Cancelled";
      case "Active":
        return "Active";
      case "Inactive":
        return "Inactive";
      case "Waiting for Password Reset":
        return "Waiting for Password Reset";
      default:
        return status;
    }
  };
  return (
    <>
      <span className="font-serif">
        {(status === "Pending" || status === "Inactive") && (
          <Badge type="warning">{getStatusText(status)}</Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge type="warning">{getStatusText(status)}</Badge>
        )}
        {status === "Processing" && <Badge>{getStatusText(status)}</Badge>}
        {(status === "Delivered" || status === "Active") && (
          <Badge type="success">{getStatusText(status)}</Badge>
        )}
        {status === "Cancel" && <Badge type="danger">{getStatusText(status)}</Badge>}
        {status === `POS-Completed` && (
          <Badge className="dark:bg-teal-900 bg-teal-100">{getStatusText(status)}</Badge>
        )}
      </span>
    </>
  );
};

export default Status;
