import { useState, useContext, useEffect } from "react"
import { DataContext } from "./DataContextProvider"
import AddNewOrder from "../components/AddNewOrder"

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const { ordersContext } = useContext(DataContext)

  useEffect(() => {
    setOrders(ordersContext)
  }, [ordersContext])

  const formatDate = (date) => {
    const dateObj = new Date(date.seconds * 1000)
    return dateObj.toLocaleString("th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    })
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 d-flex justify-content-between align-items-center">
        📦 รายการคำสั่งซื้อ
        <span className="text-muted fs-6">
          วันที่ {new Date().toLocaleDateString("th-TH", { dateStyle: "long" })}
        </span>
        <button 
          className="btn btn-success"
          data-bs-toggle='modal'
          data-bs-target='#addOrderModal'
          >เพิ่มออเดอร์
        </button>
        <AddNewOrder/>
      </h3>

      <div className="row">
        {orders.map((o) => {
          const { name, price, deliveryFee, date, isDelivered } = o.data

          return (
            <div className="col-md-6 col-lg-4 mb-4" key={o.id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{name}</h5>
                    <ul className="list-unstyled">
                      <li>🛒 <strong>สินค้า:</strong> {price} บาท</li>
                      <li>🚚 <strong>ค่าส่ง:</strong> {deliveryFee} บาท</li>
                      <li>📅 <strong>สั่งเมื่อ:</strong> {formatDate(date)}</li>
                      <li>
                        📦 <strong>สถานะ:</strong>{" "}
                        <span className={isDelivered ? "text-success" : "text-warning"}>
                          {isDelivered ? "ส่งแล้ว" : "ยังไม่ส่ง"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex justify-content-between gap-2 mt-3">
                    <button className="btn btn-outline-primary btn-sm w-100">✏️ แก้ไข</button>
                    <button className="btn btn-outline-danger btn-sm w-100">🗑️ ลบ</button>
                    <button
                      className={`btn btn-sm w-100 ${
                        isDelivered ? "btn-success" : "btn-warning text-dark"
                      }`}
                    >
                      {isDelivered ? "✅ ส่งแล้ว" : "📦 ยังไม่ส่ง"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
