// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// function Layout({ children }) {
//   return (
//     <>
//       <Navbar />
//       {/* <Sidebar/> */}
//       {children}
//     </>
//   );
// }

// export default Layout;

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UploadModal from "./UploadModal";
import { useApp } from "../context/AppContext";

function Layout({ children }) {
  const { showUpload, closeUpload } = useApp();

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="flex-1">{children}</div>
      </div>

      {showUpload && (
        <UploadModal
          onClose={closeUpload}
          onSuccess={() => {
            closeUpload();
          }}
        />
      )}
    </>
  );
}

export default Layout;