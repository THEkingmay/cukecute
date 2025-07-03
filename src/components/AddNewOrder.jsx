import { DataContext } from "../pages/DataContextProvider";
import { useState, useContext, useEffect } from "react";

export default function AddNewOrder() {
  const { ingredientContext } = useContext(DataContext);
  const [ingredientList, setIngredient] = useState([]);

  useEffect(() => {
    setIngredient(ingredientContext);
  }, [ingredientContext]);

  const handleSave = async () => {
    const newOrder = {
      // เติมข้อมูลออเดอร์ตรงนี้
    };

    document.getElementById("closeOrderModal").click();
    console.log(newOrder);
  };

  return (
    <div
      className="modal fade"
      id="addOrderModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content bg-light">
          <div className="modal-header">
            <h5 className="modal-title">เพิ่มออเดอร์</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="ปิด"
              id="closeOrderModal"
            ></button>
          </div>

          <div className="modal-body">
            TEST
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ปิด
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
