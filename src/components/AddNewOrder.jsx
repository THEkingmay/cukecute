import { useState, useContext, useEffect } from "react";
import { DataContext } from "../pages/DataContextProvider";
import {
  FaPlusCircle, FaMugHot, FaSeedling, FaStar, FaTint, FaTruck,
  FaMotorcycle, FaSave, FaTimes, FaTag, FaMinus, FaPlus
} from "react-icons/fa";

import { addOrder } from "../firebases/orders";
import { Timestamp } from "firebase/firestore";

export default function AddNewOrder() {
  const [isLoad , setLoad] = useState(false)
  const { ingredientContext, specialContext, sourceContext  , fetchAllOrders} = useContext(DataContext);
  const [ingredientList, setIngredient] = useState([]);
  const [specialList, setSpecial] = useState([]);
  const [sourceList, setSource] = useState([]);

  const [description , setDescription]= useState('')
  const [cupSize, setCup] = useState(null);
  const [selectToping, setSelectToping] = useState({});
  const [selectSource, setSelectSource] = useState([]);
  const [selectSpecial, setSelectSpecial] = useState({});
  const [deliveryFee, setDeliFee] = useState(0);

  const clearOrderForm = () => {
  setDescription('');
  setCup(null);
  setSelectToping({});
  setSelectSource([]);
  setSelectSpecial({});
  setDeliFee(0);
};

  const [currentPrice, setCurrPrice] = useState(0);

  useEffect(() => setIngredient(ingredientContext), [ingredientContext]);
  useEffect(() => setSpecial(specialContext), [specialContext]);
  useEffect(() => setSource(sourceContext), [sourceContext]);

  useEffect(() => {
    let price = cupSize || 0;
    const maxLen = cupSize === 49 ? 3 : 5;
    const totalToppings = Object.values(selectToping).reduce((a, b) => a + b, 0);

    if (totalToppings > maxLen) price += (totalToppings - maxLen) * 5;
    if (selectSource.length > 1) price += (selectSource.length - 1) * 5;

    let specialTotal = 0;
    specialList.forEach(s => {
      if (selectSpecial[s.id]) {
        specialTotal += Number(s.data.plusPrice) * selectSpecial[s.id];
      }
    });

    price += specialTotal + deliveryFee;
    setCurrPrice(price);
  }, [cupSize, selectToping, selectSource, selectSpecial, deliveryFee, specialList]);

  const validateOrder = () => {
    if(!description){
      alert('กรอกรายละเอียดเล่นชื่อกับที่อยู่')
      return
    }
    if (!cupSize) {
      alert("กรุณาเลือกขนาดถ้วย");
      return false;
    }
    if (selectSource.length === 0) {
      alert("กรุณาเลือกน้ำสลัดอย่างน้อย 1 อย่าง");
      return false;
    }
    if(deliveryFee===0){
     alert("เลือกค่าจัดส่ง")
     return 
    }
    return true;
  };

  const handleSave = async () => {
    const newOrder = {
      description,
      cupSize , 
      selectToping,
      selectSpecial,
      selectSource , 
      deliveryFee ,
      totalPrice : currentPrice,
      date: Timestamp.now(),
      isDelivered:false
    }
    if (!validateOrder()) return;
    try{
      setLoad(true)
      await addOrder(newOrder)
      await fetchAllOrders()
      console.log("บันทึกออเดอร์ใหม่สำเร็จ ",newOrder) 
    }catch(err){
      console.log(err)
      alert("การเพิ่มออเดอร์มีปัญหา")
    }finally{
      setLoad(false)
       clearOrderForm()
        document.getElementById("closeOrderModal").click();
    }
  };

  const isTopingSelected = id => selectToping[id] > 0;
  const isSourceSelected = id => selectSource.includes(id);
  const isSpecialSelected = id => selectSpecial[id] > 0;

  const toggleToping = id => {
    setSelectToping(prev => {
      const newState = { ...prev };
      newState[id] ? delete newState[id] : (newState[id] = 1);
      return newState;
    });
  };

  const updateTopingQuantity = (id, qty) => {
    if (qty <= 0) {
      const newState = { ...selectToping };
      delete newState[id];
      setSelectToping(newState);
    } else {
      setSelectToping(prev => ({ ...prev, [id]: qty }));
    }
  };

  const toggleSource = id =>
    setSelectSource(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleSpecial = id => {
    setSelectSpecial(prev => {
      const newState = { ...prev };
      newState[id] ? delete newState[id] : (newState[id] = 1);
      return newState;
    });
  };

  const updateSpecialQuantity = (id, qty) => {
    if (qty <= 0) {
      const newState = { ...selectSpecial };
      delete newState[id];
      setSelectSpecial(newState);
    } else {
      setSelectSpecial(prev => ({ ...prev, [id]: qty }));
    }
  };

  return (
    <div className="modal fade" id="addOrderModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-0 shadow rounded-4 overflow-hidden">

          {/* Header */}
          <div className="modal-header bg-gradient" style={{ background: 'linear-gradient(135deg, #9face6 0%, #74ebd5 100%)' }}>
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FaPlusCircle /> เพิ่มออเดอร์ใหม่
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeOrderModal"></button>
          </div>

          <div className="modal-body p-4" style={{ backgroundColor: '#f7f9fb' }}>


            {/* Price */}
            <div className="card mb-4 border-0 shadow-sm" style={{ background: "#eaf4fc" }}>
              <div className="card-body text-center py-3">
                <div className="h-4 text-primary fw-bold d-flex justify-content-center align-items-center gap-2">
                  <FaTag /> ราคาปัจจุบัน: {currentPrice} บาท
                </div>
              </div>
            </div>
          {/*Description*/}
            <div className="mb-3">
                <label className="form-label ">กรอกรายละเอียด ชื่อกับที่จัดส่ง</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="เช่น เม นก3B"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            {/* Cup Size */}
            <div className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                  <FaMugHot /> เลือกขนาดถ้วย
                </h6>
                <div className="d-flex gap-3">
                  {[49, 69].map(size => (
                    <button key={size} onClick={() => setCup(size)}
                      className={`btn flex-fill ${cupSize === size ? "btn-success shadow" : "btn-outline-success"}`}>
                      <FaMugHot className="me-2" />{size} บาท
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Topping */}
            <div className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                  <FaSeedling /> เลือกท็อปปิ้ง (เลือกแตงกวาด้วย)
                </h6>
                <div className="row g-3">
                  {ingredientList.map(i => (
                    <div key={i.id} className="col-md-6">
                      <div className="d-flex align-items-center gap-2 p-1 bg-white rounded">
                        <button onClick={() => toggleToping(i.id)}
                          className={`btn flex-fill ${isTopingSelected(i.id) ? "btn-success" : "btn-outline-secondary"}`}>
                          {i.data.name}
                        </button>
                        {isTopingSelected(i.id) && (
                          <div className="d-flex align-items-center gap-1">
                            <button className="btn btn-sm btn-outline-danger rounded-circle"
                              onClick={() => updateTopingQuantity(i.id, selectToping[i.id] - 1)}>
                              <FaMinus />
                            </button>
                            <span className="badge bg-primary fs-6 px-3 py-2">
                              {selectToping[i.id]}
                            </span>
                            <button className="btn btn-sm btn-outline-success rounded-circle"
                              onClick={() => updateTopingQuantity(i.id, selectToping[i.id] + 1)}>
                              <FaPlus />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special */}
            <div className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-warning">
                  <FaStar /> เลือกท็อปปิ้งเสริม
                </h6>
                <div className="row g-3">
                  {specialList.map(i => (
                    <div key={i.id} className="col-md-6">
                      <div className="d-flex align-items-center gap-2 p-1 bg-white  rounded">
                        <button onClick={() => toggleSpecial(i.id)}
                          className={`btn flex-fill ${isSpecialSelected(i.id) ? "btn-success" : "btn-outline-secondary"}`}>
                          {i.data.name} <span className="badge bg-warning text-dark ms-2">+{i.data.plusPrice}฿</span>
                        </button>
                        {isSpecialSelected(i.id) && (
                          <div className="d-flex align-items-center gap-1">
                            <button className="btn btn-sm btn-outline-danger rounded-circle"
                              onClick={() => updateSpecialQuantity(i.id, selectSpecial[i.id] - 1)}>
                              <FaMinus />
                            </button>
                            <span className="badge bg-primary fs-6 px-3 py-2">{selectSpecial[i.id]}</span>
                            <button className="btn btn-sm btn-outline-success rounded-circle"
                              onClick={() => updateSpecialQuantity(i.id, selectSpecial[i.id] + 1)}>
                              <FaPlus />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-info">
                  <FaTint /> เลือกน้ำสลัด
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {sourceList.map(i => (
                    <button key={i.id} onClick={() => toggleSource(i.id)}
                      className={`btn ${isSourceSelected(i.id) ? "btn-info text-white shadow" : "btn-outline-info"}`}>
                      {i.data.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Fee */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                  <FaTruck /> เลือกค่าส่ง
                </h6>
                <div className="row g-2">
                  {[5, 10, 15,20].map(fee => (
                    <div key={fee} className="col-6 col-md-3">
                      <button onClick={() => setDeliFee(fee)}
                        className={`btn w-100 ${deliveryFee === fee ? "btn-primary shadow" : "btn-outline-primary"}`}>
                        <FaMotorcycle className="me-1" /> {fee} บาท
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-0 p-4 d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              <FaTimes className="me-2" /> ปิด
            </button>
            <button type="button" className="btn btn-success px-4" onClick={handleSave}>
              <FaSave className="me-2" /> {isLoad?'กำลังบันทึก ... '  : 'บันทึก'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
