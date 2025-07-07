import { deleteIngredient } from "../firebases/ingredient";
import { deleteSpecial } from "../firebases/specialIngredient";
import { deleteSource } from "../firebases/source";

import {DataContext} from "../pages/DataContextProvider";
import { useContext, useState } from "react";


export default function ConfirmToDeleteIngredient({selectDelete , clear}) {
  const {fetchIngredient} = useContext(DataContext)

   const handleDelete = async () => {
    try {
      if (selectDelete.type === 'ingredient') await deleteIngredient(selectDelete.id);
      else if (selectDelete.type === 'special') await deleteSpecial(selectDelete.id);
      else if (selectDelete.type === 'source') await deleteSource(selectDelete.id);

      await fetchIngredient();
    } catch (err) {
      console.log(err);
    } finally {
      clear()

      const modalId = `deleteModal`;
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
      id={`deleteModal`}
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
              id={`close-delete`}
            ></button>
          </div>
          <div className="modal-body text-center">
            <p>คุณต้องการลบ <strong>{selectDelete.name}</strong> หรือไม่?</p>
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
