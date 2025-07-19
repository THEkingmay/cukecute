import { useContext, useState, useEffect } from "react";
import { DataContext } from "../pages/DataContextProvider";
import { updateSource } from "../firebases/source";
import { updateIngredient } from "../firebases/ingredient";
import { updateSpecial } from "../firebases/specialIngredient";

export default function UpdateIngredientModal({ ingredient }) {
  const [name, setName] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [unit, setUnit] = useState("kilogram");
  const [perUnit, setGram] = useState(0);
  const [quantitySmall, setQSM] = useState(0);
  const [quantityBig, setQB] = useState(0);
  const [plusPrice, setPlusPrice] = useState(0); // for special ingredient
  const [isLoad, setLoad] = useState(false);

  const { fetchIngredient } = useContext(DataContext);

  const validate = () => {
    if (!name.trim()) {
      alert("กรุณากรอกชื่อวัตถุดิบ");
      return false;
    }

    if (Number(pricePerUnit) <= 0) {
      alert("ราคาต่อหน่วยต้องมากกว่า 0");
      return false;
    }

    if (unit === "gram" && Number(perUnit) <= 0) {
      alert("ต้องระบุจำนวนกรัมให้ถูกต้อง");
      return false;
    }

    if (Number(quantitySmall) <= 0) {
      alert("ปริมาณที่ใช้สำหรับถ้วยเล็กต้องมากกว่า 0");
      return false;
    }

    if (Number(quantityBig) <= 0) {
      alert("ปริมาณที่ใช้สำหรับถ้วยใหญ่ต้องมากกว่า 0");
      return false;
    }

    if (ingredient.type === "special" && Number(plusPrice) <= 0) {
      alert("ราคาพิเศษ (plusPrice) ต้องมากกว่า 0 สำหรับวัตถุดิบพิเศษ");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    let newData = {
      name: name.trim(),
      pricePerUnit: Number(pricePerUnit),
      unit,
      quantitySmall: Number(quantitySmall),
      quantityBig: Number(quantityBig),
      perUnit: unit==='kilogram' ? 1 : Number(perUnit),
      pricePerGram : unit==='kilogram' ? (pricePerUnit / 1000).toFixed(3) :(pricePerUnit / perUnit).toFixed(3)
    };

    try {
      setLoad(true);

      switch (ingredient.type) {
        case "ingredient":
          await updateIngredient(ingredient.object.id, newData);
          break;
        case "source":
          await updateSource(ingredient.object.id, newData);
          break;
        case "special":
          newData = {...newData , plusPrice: Number(plusPrice),}
          await updateSpecial(ingredient.object.id, newData);
          break;
        default:
          throw new Error("ไม่รู้จักประเภทของวัตถุดิบ");
      }

      await fetchIngredient();
      document.getElementById("updateIngredientCloseBtn")?.click(); // ปิด modal
    } catch (err) {
      console.log(err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    console.log(ingredient?.object)
    if (!ingredient?.object?.data) return;
    const {
      name,
      pricePerUnit,
      unit,
      quantitySmall,
      quantityBig,
      plusPrice,
      perUnit,
    } = ingredient.object.data;

    setName(name || "");
    setPricePerUnit(pricePerUnit || 0);
    setUnit(unit || "kilogram");
    setGram(perUnit || 0);
    setQSM(quantitySmall || 0);
    setQB(quantityBig || 0);
    setPlusPrice(ingredient.type === "special" ? plusPrice || 0 : 0);
  }, [ingredient?.object?.data]);

  return (
    <div className="modal fade" id="updateIngredient">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow rounded-4 border-0">
          <div className="modal-header bg-primary text-white rounded-top-4">
            <h5 className="modal-title">🛠️ อัปเดตวัตถุดิบ</h5>
            <button
              id="updateIngredientCloseBtn"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 py-3">
            <div className="mb-3">
              <label className="form-label fw-bold">ชื่อวัตถุดิบ 🏷️</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น น้ำตาล"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">ราคาต่อหน่วย 💰</label>
              <input
                type="number"
                className="form-control"
                placeholder="เช่น 35"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">หน่วย 📏</label>
              <div className="d-flex gap-4">
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
            </div>

            {unit === "gram" && (
              <div className="mb-3">
                <label className="form-label fw-bold">ต่อกี่กรัม (⚖️)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="เช่น 500"
                  value={perUnit}
                  onChange={(e) => setGram(e.target.value)}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold">ปริมาณที่ใช้ (กรัม) 🧪</label>
              <div className="input-group mb-2">
                <span className="input-group-text">ถ้วยเล็ก 🥤</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="เช่น 15"
                  value={quantitySmall}
                  onChange={(e) => setQSM(e.target.value)}
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
                  onChange={(e) => setQB(e.target.value)}
                />
                <span className="input-group-text">กรัม</span>
              </div>
            </div>

            {ingredient.type === "special" && (
              <div className="mb-3">
                <label className="form-label fw-bold">ราคาต่อ 1 ที่ ➕</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="เช่น 10, 20"
                  value={plusPrice}
                  onChange={(e) => setPlusPrice(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal-footer rounded-bottom-4 px-4 py-3">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ❌ ปิด
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleUpdate}
              disabled={isLoad}
            >
              {isLoad ? "⏳ กำลังอัปเดต..." : "✅ อัปเดต"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
