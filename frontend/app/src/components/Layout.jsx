import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {/* <Sidebar/> */}
      {children}
    </>
  );
}

export default Layout;