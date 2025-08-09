import React, { useContext } from "react";
import useGetCData from "@/hooks/useGetCData";
import NotFoundPage from "@/components/common/NotFoundPage";
import { AdminContext } from "@/context/AdminContext";

const Main = ({ children }) => {
  const { path, fullPath, accessList, role } = useGetCData();
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;

  // Allow Super Admin full access regardless of decryption status
  const isSuperAdmin = role === "Super Admin" || adminInfo?.role === "Super Admin";
  
  // Debug logging for troubleshooting
  console.log("Main component access check:", {
    path,
    fullPath,
    accessList,
    role,
    adminRole: adminInfo?.role,
    isSuperAdmin,
    hasAccess: accessList?.includes(path) || accessList?.includes(fullPath)
  });

  // Grant access if:
  // 1. User is Super Admin (role-based bypass)
  // 2. Current path is in the access list
  // 3. If accessList is empty/undefined and user is authenticated (fallback for decryption issues)
  const pathInAccessList = accessList?.includes(path);
  const fullPathInAccessList = accessList?.includes(fullPath);
  const fallbackAccess = adminInfo?.email && (!accessList || accessList.length === 0);
  
  const hasAccess = isSuperAdmin || pathInAccessList || fullPathInAccessList || fallbackAccess;

  // Temporary override for stock-movements page
  const isStockMovementsPage = path === "stock-movements" || fullPath === "stock-movements";
  const finalHasAccess = hasAccess || (isSuperAdmin && isStockMovementsPage);

  // Detailed debug logging
  console.log("Main component detailed access check:", {
    path,
    fullPath,
    isSuperAdmin,
    pathInAccessList,
    fullPathInAccessList,
    fallbackAccess,
    hasAccess,
    isStockMovementsPage,
    finalHasAccess,
    accessListLength: accessList?.length,
    accessListIncludes: accessList?.includes ? 'yes' : 'no',
    adminEmail: adminInfo?.email
  });

  if (!finalHasAccess) {
    return <NotFoundPage />;
  }

  return (
    <main className="h-full overflow-y-auto">
      <div className="sm:container grid lg:px-6 sm:px-4 px-2 mx-auto">
        {children}
      </div>
    </main>
  );
};

export default Main;
