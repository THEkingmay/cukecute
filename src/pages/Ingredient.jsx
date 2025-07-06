import { useContext, useEffect, useState } from "react"
import { DataContext } from "./DataContextProvider"
import AddIngredientModal from "../components/AddIngredient"
import ConfirmToDeleteIngredient from "../components/ConfirmDeleteIngredient"

export default function IngredientPage() {
  const [ingredient, setIngredient] = useState([])
  const { ingredientContext } = useContext(DataContext)

  useEffect(() => {
    setIngredient(ingredientContext)
  }, [ingredientContext])

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🥬 วัตถุดิบทั้งหมด</h2>
        <button 
        className="btn btn-success"
        data-bs-toggle='modal'
        data-bs-target="#addIngredientModal"
        >
          ➕ เพิ่มวัตถุดิบ
        </button>
      </div>
      
      <div className="row shadow-sm rounded p-2">
        <div  className="h5">วัตถุดิบทั่วไป</div>
        {ingredient.map((i) => (
          <div className="col-md-6 col-lg-3 mb-2" key={i.id}>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">{i.data.name}</h5>
                <p className="card-text">
                  <span className="d-block mb-1">
                    💰 <strong>ราคา:</strong> {i.data.pricePerUnit} บาท / {i.data.perUnit} {i.data.unit}
                  </span>
                  <span className="d-block text-muted">
                    ⚖️ <strong>ราคาต่อกรัม:</strong> {i.data.pricePerGram} บาท
                  </span>
                  <span className="d-block text-muted">
                    🎈 <strong>ปริมาณถ้วยเล็ก:</strong> {i.data.quantitySmall} กรัม
                  </span>
                  <span className="d-block text-muted">
                    🎈 <strong>ปริมาณถ้วยใหญ่</strong> {i.data.quantityBig} กรัม
                  </span>
                </p>
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn btn-sm w-100 btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target={`#deleteModal-${i.id}`}
                  >
                    🗑️ ลบ
                    </button>
                  <ConfirmToDeleteIngredient id={i.id} name={i.data.name}/>
                </div>
              </div>
            </div>
          </div>
        ))}
        <AddIngredientModal/>
      </div>
      
      <div className="row shadow-sm rounded p-2 mt-2">
          <div className="col col-12 col-lg-6 p-2 border">
                <div className="h5">วัตถุดิบพิเศษ</div>
          </div>
          <div className="col col-12 col-lg-6 p-2">
              <div className="h5">ซอส</div>
          </div>
      </div>
    </div>
  )
}
