import { useContext, useEffect, useState } from "react"
import { DataContext } from "./DataContextProvider"
import AddIngredientModal from "../components/AddIngredient"
import AddSourceModal from "../components/AddSource"
import AddSpecialModal from "../components/AddSpecial"

import { deleteIngredient } from "../firebases/ingredient";
import { deleteSpecial } from "../firebases/specialIngredient";
import { deleteSource } from "../firebases/source";

export default function IngredientPage() {
  const [ingredient, setIngredient] = useState([])
  const [special , setSpecial ] = useState([])
  const [source , setSource] = useState([])
  const { ingredientContext , specialContext , sourceContext } = useContext(DataContext)

  useEffect(() => {
    setIngredient(ingredientContext)
    setSpecial(specialContext)
    setSource(sourceContext)
  }, [ingredientContext , sourceContext , specialContext])

  const { fetchIngredient } = useContext(DataContext); // ถ้าอยู่ใน context

  const handleDelete = async (id, name, type) => {
    const confirmDelete = window.confirm(`คุณต้องการลบ "${name}" ใช่หรือไม่? ข้อมูลนี้จะหายไปถาวร`);
    if (!confirmDelete) return;

    try {
      if (type === 'ingredient') await deleteIngredient(id);
      else if (type === 'special') await deleteSpecial(id);
      else if (type === 'source') await deleteSource(id);

      await fetchIngredient();
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการลบ:", err);
      alert("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่");
    }
  };

 return (
  <div className="container mt-4">
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold">🥬 วัตถุดิบทั้งหมด</h2>
      <button 
        className="btn btn-success rounded-pill px-4"
        data-bs-toggle="modal"
        data-bs-target="#addIngredientModal"
      >
        ➕ เพิ่มวัตถุดิบ
      </button>
    </div>

    {/* วัตถุดิบทั่วไป */}
    <div className="row shadow-sm rounded  bg-white mb-3 p-4">
      <div className="h5 mb-3 fw-semibold border-bottom pb-2 ">วัตถุดิบทั่วไป</div>
      {ingredient.map((i) => (
        <div className="col-md-6 col-lg-3 mb-3" key={i.id}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold">{i.data.name}</h5>
              <p className="card-text small text-secondary">
                💰 <strong>ราคา:</strong> {i.data.pricePerUnit} บาท / {i.data.perUnit} {i.data.unit}<br/>
                ⚖️ <strong>ราคาต่อกรัม:</strong> {i.data.pricePerGram} บาท<br/>
                🎈 <strong>ถ้วยเล็ก:</strong> {i.data.quantitySmall} กรัม<br/>
                🎈 <strong>ถ้วยใหญ่:</strong> {i.data.quantityBig} กรัม
              </p>
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-outline-danger btn-sm w-100 rounded-pill"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteModal-${i.id}`}
                  onClick={() => handleDelete(i.id, i.data.name, 'ingredient')}

                >
                  🗑️ ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <AddIngredientModal />
    </div>

    {/* พื้นที่วัตถุดิบพิเศษและซอส */}
    <div className="row g-3">
      {/* วัตถุดิบพิเศษ */}
      <div className="col-12 col-lg-6 ">
        <div className="shadow-sm rounded p-4 bg-white h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="h5 fw-semibold mb-0">วัตถุดิบพิเศษ</div>
            <button
              className="btn btn-success rounded-pill btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#addSpecial"
            >
              ➕ เพิ่มวัตถุดิบพิเศษ
            </button>
          </div>
          <div className="row">
            {special.map((i) => (
              <div className="col-md-6 col-lg-6" key={i.id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{i.data.name}</h5>
                    <p className="card-text small text-secondary">
                      💰 <strong>ราคา:</strong> {i.data.pricePerUnit} บาท / {i.data.perUnit} {i.data.unit}<br/>
                      ⚖️ <strong>ราคาต่อกรัม:</strong> {i.data.pricePerGram} บาท<br/>
                      🎈 <strong>ถ้วยเล็ก:</strong> {i.data.quantitySmall} กรัม<br/>
                      🎈 <strong>ถ้วยใหญ่:</strong> {i.data.quantityBig} กรัม<br/>
                      💵 <strong>ราคาต่อ 1 ที่:</strong> {i.data.plusPrice} บาท
                    </p>
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn btn-outline-danger btn-sm w-100 rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target={`#deleteModal-${i.id}`}
                        onClick={() => handleDelete(i.id, i.data.name, 'special')}
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <AddSpecialModal />
          </div>
        </div>
      </div>

      {/* ซอส */}
      <div className="col-12 col-lg-6">
        <div className="shadow-sm p-4 rounded bg-white h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="h5 fw-semibold mb-0">ซอส</div>
            <button
              className="btn btn-success rounded-pill btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#addSource"
            >
              ➕ เพิ่มซอส
            </button>
          </div>
          <div className="row">
            {source.map((i) => (
              <div className="col-md-6 col-lg-6 mb-3" key={i.id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{i.data.name}</h5>
                    <p className="card-text small text-secondary">
                      💰 <strong>ราคา:</strong> {i.data.pricePerUnit} บาท / {i.data.perUnit} {i.data.unit}<br/>
                      ⚖️ <strong>ราคาต่อกรัม:</strong> {i.data.pricePerGram} บาท<br/>
                      🎈 <strong>ถ้วยเล็ก:</strong> {i.data.quantitySmall} กรัม<br/>
                      🎈 <strong>ถ้วยใหญ่:</strong> {i.data.quantityBig} กรัม
                    </p>
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn btn-outline-danger btn-sm w-100 rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target={`#deleteModal-${i.id}`}
                        onClick={() => handleDelete(i.id, i.data.name, 'source')}
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <AddSourceModal />
          </div>
        </div>
      </div>
    </div>
  </div>
)

}
