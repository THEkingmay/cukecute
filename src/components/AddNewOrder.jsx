import { DataContext } from "../pages/DataContextProvider";
import { useState, useContext, useEffect } from "react";

export default function AddNewOrder() {
  const { ingredientContext, specialContext, sourceContext } = useContext(DataContext);
  const [ingredientList, setIngredient] = useState([]);
  const [specialList, setSpecial] = useState([]);
  const [sourceList, setSource] = useState([]);

  const [cupSize, setCup] = useState(0);
  const [selectToping, setSelectToping] = useState([]);
  const [selectSource, setSelectSource] = useState([]);
  const [selectSpecial, setSelectSpecial] = useState([]);
  const [currentPrice, setCurrPrice] = useState(0);

  useEffect(() => {
    setIngredient(ingredientContext);
  }, [ingredientContext]);

  useEffect(() => {
    setSpecial(specialContext);
  }, [specialContext]);

  useEffect(() => {
    setSource(sourceContext);
  }, [sourceContext]);

  useEffect(() => {
    let price = cupSize;

    // คำนวณ topping
    const maxLen = cupSize === 49 ? 2 : 4;
    if (selectToping.length > maxLen) {
      price += (selectToping.length - maxLen) * 5;
    }

    // คำนวณ source (เกิน 1 คิดเพิ่ม)
    if (selectSource.length > 1) {
      price += (selectSource.length - 1) * 5;
    }

    // คำนวณ special เพิ่ม
    let specialTotal = 0;
    specialList.forEach(s=>{
      if(selectSpecial.includes(s.id)){
        specialTotal+=Number(s.data.plusPrice)
      }
    })
    price += specialTotal;

    setCurrPrice(price);
  }, [cupSize, selectToping, selectSource, selectSpecial]);

  const handleCupsize = (size) => {
    setCup(size);
  };

  const toggleToping = (id) => {
    setSelectToping((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSource = (id) => {
    setSelectSource((prev)=>
      prev.includes(id) ? prev.filter((i)=>i!==id) : [...prev , id]
    )
  };

  const toggleSpecial = (id) => {
    setSelectSpecial((prev)=>
      prev.includes(id) ? prev.filter((i)=>i!==id) : [...prev , id]
    )
  };

  const handleSave = async () => {
    console.log("Order Saved");
    console.log({ cupSize, selectToping, selectSource, selectSpecial, currentPrice });
    document.getElementById("closeOrderModal").click();
  };

  const isTopingSelected = (id) => selectToping.includes(id);
  const isSourceSelected = (id) => selectSource.includes(id)
  const isSpecialSelected = (id) => selectSpecial.includes(id)

  return (
    <div className="modal fade" id="addOrderModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content bg-light">
          <div className="modal-header">
            <h5 className="modal-title">เพิ่มออเดอร์</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="ปิด"
              id="closeOrderModal"
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3 fw-bold text-success fs-5">ราคาปัจจุบัน: {currentPrice} บาท</div>

            {/* Cup Size */}
            <div className="mb-3">
              <div className="mb-2">เลือกขนาดถ้วย</div>
              <button
                onClick={() => handleCupsize(49)}
                className={`btn me-2 ${cupSize === 49 ? "btn-success" : "btn-outline-success"}`}
              >
                49 บาท
              </button>
              <button
                onClick={() => handleCupsize(69)}
                className={`btn ${cupSize === 69 ? "btn-success" : "btn-outline-success"}`}
              >
                69 บาท
              </button>
            </div>

            {/* Topping */}
            <div className="mb-3">
              <div className="mb-2">เลือกท็อปปิ้ง</div>
              <div className="d-flex flex-wrap gap-2">
                {ingredientList.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggleToping(i.id)}
                    className={`btn ${isTopingSelected(i.id) ? "btn-success" : "btn-outline-secondary"}`}
                  >
                    {i.data.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Special */}
            <div className="mb-3">
              <div className="mb-2">เลือกท็อปปิ้งเสริม</div>
              <div className="d-flex flex-wrap gap-2">
                {specialList.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggleSpecial(i.id)}
                    className={`btn ${isSpecialSelected(i.id) ? "btn-success" : "btn-outline-secondary"}`}
                  >
                    {i.data.name} (+{i.data.plusPrice}฿)
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div className="mb-3">
              <div className="mb-2">เลือกน้ำสลัด</div>
              <div className="d-flex flex-wrap gap-2">
                {sourceList.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggleSource(i.id)}
                    className={`btn ${isSourceSelected(i.id) ? "btn-success" : "btn-outline-secondary"}`}
                  >
                    {i.data.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              ปิด
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
