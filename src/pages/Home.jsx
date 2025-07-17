import { useState, useContext, useEffect } from "react"
import { DataContext } from "./DataContextProvider"
import AddNewOrder from "../components/AddNewOrder"
import UpdateOrderModal from "../components/UpdateOrderModal"
import DeleteOrderModal from "../components/DeleteOrderModal"
import { updateStatus } from "../firebases/orders"

export default function Dashboard() {
  const [orders, setOrders] = useState([])

  const { ordersContext } = useContext(DataContext)
  const [selectOrderToUpdate , setupdate] = useState({})
const [deleteId, setDelete]= useState({})

const [isChanging , setIsChanging] = useState(false)

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

  const changeOredrStatus = async (id)=>{
    let newStatus = !(orders.find(order => order.id===id).data.isDelivered)
    try{
      setIsChanging(true)
      await updateStatus(id , newStatus)
    }catch(err){
      console.log(err)
      alert(err)
    }finally{
      setIsChanging(false)
      setOrders((prev)=>{
        return prev.map((order)=>{
          if(order.id!==id)return order
          return{
            ...order,
            data:{
              ...order.data , 
              isDelivered: newStatus
            }
          }
        })
      })
    }
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
          const { name, totalPrice, deliveryFee, date, isDelivered , description } = o.data

          return (
            <div className="col-md-6 col-lg-4 mb-4" key={o.id}>
              <div className={`card shadow-sm  h-100 ${o.data.isDelivered ? 'bg-success-subtle' : 'bg-white'}`}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{name}</h5>
                    <ul className="list-unstyled">
                      <li><strong>ส่งที่ :</strong> {description} </li>
                      <li>🛒 <strong>สินค้า:</strong> {totalPrice} บาท</li>
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
                    <button 
                    className="btn btn-primary btn-sm w-100"
                     data-bs-toggle='modal'
                      data-bs-target='#updateOrder'
                      onClick={()=>setupdate(o)}
                    > แก้ไข</button>
                      <button 
                      className="btn btn-danger btn-sm w-100" 
                      data-bs-toggle='modal'
                      data-bs-target='#deleteOrder'
                      onClick={()=>setDelete(o)}
                      > ลบ</button>
                    <button
                      disabled={isChanging}
                      onClick={()=>changeOredrStatus(o.id)}
                      className={`btn btn-sm w-100 ${
                        isDelivered ? "btn-success" : "btn btn-warning text-dark"
                      }`}
                    >
                      {isDelivered  ? "✅ ส่งแล้ว" : " ยังไม่ส่ง"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {orders.length===0 && <div className="display-6 d-flex justify-content-center align-items-center"> คุณยังไม่มีออเดอร์ในวันนี้ </div>}
      <UpdateOrderModal selectOrder={selectOrderToUpdate}/>
      <DeleteOrderModal selectDelete={deleteId}/>
    </div>
  )
}
