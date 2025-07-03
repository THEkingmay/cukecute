import { useState } from "react";
import { addNewIngredient } from "../firebases/ingredient";
import { useContext } from "react";
import {DataContext} from "../pages/DataContextProvider";

export default function AddIngredientModal() {
  const [name, setName] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [unit, setUnit] = useState("kilogram");
  const [gramIfUnitGram, setGram] = useState(0);
const { fetchIngredient} = useContext(DataContext)

  const submitAdd = async() => {
    if (!name.trim()) {
      alert("⚠️ กรุณากรอกชื่อวัตถุดิบ");
      return;
    }
    if (pricePerUnit <= 0) {
      alert("⚠️ ราคาต่อหน่วยต้องมากกว่า 0");
      return;
    }
    if (unit === "gram" && gramIfUnitGram <= 0) {
      alert("⚠️ ระบุน้ำหนักกรัมให้ถูกต้อง");
      return;
    }

    const pricePerGram =
      unit === "kilogram"
        ? pricePerUnit/1000
        : pricePerUnit / gramIfUnitGram;

    const newIngredient = { 
        name, 
        pricePerUnit,
        unit,
        perUnit:unit=='kilogram'? 1 : gramIfUnitGram , // if unit is Kilogram set to 1 else if gram set perunit
        pricePerGram
    };
    try{
        await addNewIngredient(newIngredient)
        console.log("✅ วัตถุดิบใหม่:", newIngredient);
        fetchIngredient()
    }catch(err){
        alert(err)
        console.log(err)
    }finally{
        // reset
        setName("");
        setPricePerUnit(0);
        setUnit("kilogram");
        setGram(0);
        document.getElementById("closeModalBtn").click(); // ปิด modal
    }
    
  };

  return (
    <div
      className="modal fade"
      id="addIngredientModal"
      tabIndex="-1"
      aria-labelledby="addIngredientModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content bg-light">
          <div className="modal-header">
            <h5 className="modal-title" id="addIngredientModalLabel">
              ➕ เพิ่มวัตถุดิบใหม่
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="ปิด"
              id="closeModalBtn"
            ></button>
          </div>
          <div className="modal-body">

            <div className="mb-3">
              <label className="form-label">ชื่อวัตถุดิบ 🏷️</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น น้ำตาล"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">ราคาต่อหน่วย 💰</label>
              <input
                type="number"
                className="form-control"
                placeholder="เช่น 35"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">หน่วย 📏</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="kilogram"
                  checked={unit === "kilogram"}
                  onChange={() => setUnit("kilogram")}
                  id="radioKg"
                />
                <label className="form-check-label" htmlFor="radioKg">
                  กิโลกรัม (kg)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="gram"
                  checked={unit === "gram"}
                  onChange={() => setUnit("gram")}
                  id="radioGram"
                />
                <label className="form-check-label" htmlFor="radioGram">
                  กรัม (g)
                </label>
              </div>
            </div>

            {unit === "gram" && (
              <div className="mb-3">
                <label className="form-label">ต่อกี่กรัม (กรัม) ⚖️</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="เช่น 500"
                  value={gramIfUnitGram}
                  onChange={(e) => setGram(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ❌ ยกเลิก
            </button>
            <button className="btn btn-primary" onClick={submitAdd}>
              ✅ เพิ่มวัตถุดิบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
