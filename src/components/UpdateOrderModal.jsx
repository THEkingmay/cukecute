import { useEffect } from "react";

export default function UpdateOrderModal({ selectOrder }) {
    useEffect(()=>{
        console.log(selectOrder)
    },[selectOrder])
    return (
        <div 
            className="modal fade"
            id="updateOrder"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">อัปเดตคำสั่งซื้อ</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <p>กำลังสร้างเร็วๆนี้</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                        {/* <button type="button" className="btn btn-primary">บันทึกการเปลี่ยนแปลง</button> */}
                    </div>

                </div>
            </div>
        </div>
    );
}
