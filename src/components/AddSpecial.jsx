import { useState, useContext } from "react";
import { DataContext } from "../pages/DataContextProvider";
import { addSpecial } from "../firebases/specialIngredient";

export default function AddSpecialModal() {
  const [isAdd , setAdd] = useState(false)

  const [name, setName] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [unit, setUnit] = useState("kilogram");
  const [gramIfUnitGram, setGram] = useState(0);
  const [quantitySmall, setQSM] = useState(0);
  const [quantityBig, setQB] = useState(0);
  const [plusPrice, setPlusPrice] = useState(0); // เผื่อใช้ในอนาคต

  const { fetchIngredient } = useContext(DataContext);

  const validateForm = () => {
    if (!name.trim()) return "⚠️ กรุณากรอกชื่อวัตถุดิบ";
    if (pricePerUnit <= 0) return "⚠️ ราคาต่อหน่วยต้องมากกว่า 0";
    if (unit === "gram" && gramIfUnitGram <= 0)
      return "⚠️ ระบุน้ำหนักกรัมให้ถูกต้อง";
    if (quantityBig === 0 || quantitySmall === 0)
      return "⚠️ กรอกปริมาณให้ถูกต้องต้องมากกว่า 0";
    if (plusPrice<0) return "⚠️ ราคาต่อ 1 ที่ต้องไม่ติดลบ";
    return null;
  };

  const resetForm = () => {
    setName("");
    setPricePerUnit(0);
    setUnit("kilogram");
    setGram(0);
    setQSM(0);
    setQB(0);
    setPlusPrice(0);
  };

  const submitAdd = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    let pricePerGram =
      unit === "kilogram"
        ? pricePerUnit / 1000
        : pricePerUnit / gramIfUnitGram;

    pricePerGram = Number(pricePerGram.toFixed(3)); // เอาทศนิยม 3 ตำแหน่ง

    const newIngredient = {
      name,
      pricePerUnit,
      unit,
      perUnit: unit === "kilogram" ? 1 : gramIfUnitGram,
      pricePerGram,
      quantityBig,
      quantitySmall,
      plusPrice,
    };

    try {   
      setAdd(true)
      await addSpecial(newIngredient);
      console.log("✅ วัตถุดิบพิเศษใหม่:", newIngredient);
      await fetchIngredient();
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาด: " + err.message);
      console.error(err);
    } finally {
      setAdd(false)
      document.getElementById("closeSpecialModalBtn").click(); // ปิด modal
      resetForm();
    }
  };

  return (
    <div
      className="modal fade"
      id="addSpecial"
      tabIndex="-1"
      aria-labelledby="addSpecialModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content bg-light">
          <div className="modal-header">
            <h5 className="modal-title" id="addSpecialModalLabel">
              ➕ เพิ่มวัตถุดิบพิเศษใหม่
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="ปิด"
              id="closeSpecialModalBtn"
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

            <div className="mb-3">
              <label className="form-label">ปริมาณที่ใช้ (กรัม)</label>
              <div className="input-group mb-2">
                <span className="input-group-text">ถ้วยเล็ก 🥤</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="เช่น 15"
                  value={quantitySmall}
                  onChange={(e) => setQSM(Number(e.target.value))}
                />
                <span className="input-group-text">กรัม</span>
              </div>
              <div className="input-group">
                <span className="input-group-text">ถ้วยใหญ่ 🧋</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="เช่น 30"
                  value={quantityBig}
                  onChange={(e) => setQB(Number(e.target.value))}
                />
                <span className="input-group-text">กรัม</span>
              </div>
            </div>

            <div className="mb-3">
                <label className="form-label">ราคาต่อ 1 ที่ ➕</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="เช่น 10, 20"
                    value={plusPrice}
                    onChange={(e) => setPlusPrice(Number(e.target.value))}
                />
                </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              id="closeModal"
              disabled={isAdd}
              >
              ❌ ยกเลิก
            </button>
            <button className="btn btn-primary" onClick={submitAdd}disabled={isAdd}>
              {isAdd ? 'กำลังเพิ่ม...':'✅ เพิ่มวัตถุดิบ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
