import { deleteIngredient } from "../firebases/ingredient";
import { deleteSpecial } from "../firebases/specialIngredient";
import { deleteSource } from "../firebases/source";

import {DataContext} from "../pages/DataContextProvider";
import { useContext } from "react";

export default function ConfirmToDeleteIngredient({ id, name , type}) {
  const {fetchIngredient} = useContext(DataContext)
  
   const handleDelete = async () => {
  try {
    if (type === 'ingredient') await deleteIngredient(id);
    else if (type === 'special') await deleteSpecial(id);
    else if (type === 'source') await deleteSource(id);

    await fetchIngredient();
  } catch (err) {
    console.log(err);
  } finally {
    // ให้ใช้ id ให้ตรงกับ modal ที่ประกาศไว้
    const modalId = `deleteModal-${id}`;
    const myModalEl = document.getElementById(modalId);

    if (myModalEl) {
      const modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      } else {
        // ถ้ายังไม่มี instance ให้สร้างขึ้นก่อน
        const newModal = new bootstrap.Modal(myModalEl);
        newModal.hide();
      }
    } else {
      console.warn(`ไม่พบ modal ที่ id = ${modalId}`);
    }
  }
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
