import { useState , useContext } from "react";
import { deleteOrder } from "../firebases/orders";
import {DataContext} from "../pages/DataContextProvider";

export default function DeleteOrderModal({ selectDelete}) {
const { fetchAllOrdersByDate} = useContext(DataContext);
  const { id, data } = selectDelete || {};
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await deleteOrder(id);
    await fetchAllOrdersByDate()
      setLoading(false);
      // ปิด modal แบบ Bootstrap (ถ้ามี JS Bootstrap ใช้อยู่)
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteOrder'));
      modal?.hide();

    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div
      id="deleteOrder"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="deleteOrderModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="deleteOrderModalLabel">ยืนยันการลบออเดอร์</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <p>คุณแน่ใจไหมว่าจะลบออเดอร์นี้?</p>
            <p><strong>{data?.description || "ไม่มีรายละเอียด"}</strong></p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              ยกเลิก
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? "กำลังลบ..." : "ลบเลย"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
