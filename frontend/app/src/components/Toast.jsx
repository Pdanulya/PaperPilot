import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <i className={`ti ${toast.type === "success" ? "ti-circle-check" : "ti-circle-x"} mr-2`} />
      {toast.message}
    </div>
  );
}