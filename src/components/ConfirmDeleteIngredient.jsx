import { deleteIngredient } from "../firebases/ingredient";
import {DataContext} from "../pages/DataContextProvider";
import { useContext } from "react";

export default function ConfirmToDeleteIngredient({ id, name }) {
  const {fetchIngredient} = useContext(DataContext)
  
    const handleDelete = () => {
    deleteIngredient(id)
      .then(() => {
        document.getElementById(`close-delete-${id}`).click(); // ปิด modal
        fetchIngredient()
      })
      .catch((err) => {
        alert("❌ ลบไม่สำเร็จ: " + err.message);
      });
  };

  return (
    <div
      className="modal fade"
      id={`deleteModal-${id}`}
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3">
          <div className="modal-header">
            <h5 className="modal-title text-danger" id="deleteModalLabel">
              ⚠️ ยืนยันการลบ
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id={`close-delete-${id}`}
            ></button>
          </div>
          <div className="modal-body text-center">
            <p>คุณต้องการลบ <strong>{name}</strong> หรือไม่?</p>
            <p className="text-muted">ข้อมูลนี้จะหายไปอย่างถาวร ❗</p>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ❌ ยกเลิก
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              🗑️ ลบเลย
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
