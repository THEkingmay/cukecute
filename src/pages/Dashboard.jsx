import { useState, useEffect, useContext } from "react";
import { getOrdersByDate } from "../firebases/orders";
import { DataContext } from "./DataContextProvider";
import {
  FaCoins,
  FaCalendarAlt,
  FaSearch,
  FaShoppingCart,
  FaChartLine, // แทน FaTrendingUp
  FaReceipt,
  FaCoffee,
  FaPlus,
  FaTint
} from "react-icons/fa";

import DeleteOrderModal from "../components/DeleteOrderModal";
import UpdateOrderModal from "../components/UpdateOrderModal";

export default function Dashboard() {
  const [selectOrerDelete , setSelDel ] = useState({})
  const [selectOrderUpdate , setUpdate] = useState({})

  const [selectDay, setDay] = useState("");
  const [filterOrder, setFilterOrder] = useState([]);
  const [loading, setLoad] = useState(false);

  const { ingredientContext, specialContext, sourceContext ,  ordersContext  } = useContext(DataContext);
  const [ingredient, setIngredient] = useState([]);
  const [special, setSpecial] = useState([]);
  const [source, setSource] = useState([]);

  useEffect(() => {
    setIngredient(ingredientContext);
    setSpecial(specialContext);
    setSource(sourceContext);
  }, [ingredientContext, specialContext, sourceContext]);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setDay(date);
    fetchOrder(date);
  }, []);

  useEffect(()=>{
    fetchOrder(selectDay)
  },[ordersContext]) // ถ้ามีการเรียก fectAllOrderbydate ผ่าน context ทำให้ contexr เปลี่ยน จึงมีการเรียก useEffect นี้อีกที
 

  const handleSearch = () => {
    if (!selectDay) {
      alert("กรอกวันที่ต้องการค้นหา");
      return;
    }
    fetchOrder(selectDay);
  };

  const fetchOrder = async (date) => {
    setLoad(true);
    try {
      const data = await getOrdersByDate(date);
      if (data) setFilterOrder(data);
      else setFilterOrder([]);
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoad(false);
    }
  };

  const calPriceToping = (ingredientId, qtyInOrder, cupSize) => {
    const findIngredient = ingredient.find((i) => i.id === ingredientId);
    if (!findIngredient) return 0;
    if (cupSize === 49) {
      return Number(qtyInOrder) * Number(findIngredient.data.quantitySmall) * Number(findIngredient.data.pricePerGram);
    } else if (cupSize === 69) {
      return Number(qtyInOrder) * Number(findIngredient.data.quantityBig) * Number(findIngredient.data.pricePerGram);
    }
    return 0;
  };

  const calPriceSpecial = (specialId, qtyInOrder, cupSize) => {
    const findSpecial = special.find((s) => s.id === specialId);
    if (!findSpecial) return 0;
    if (cupSize === 49) {
      return Number(qtyInOrder) * Number(findSpecial.data.quantitySmall) * Number(findSpecial.data.pricePerGram);
    } else if (cupSize === 69) {
      return Number(qtyInOrder) * Number(findSpecial.data.quantityBig) * Number(findSpecial.data.pricePerGram);
    }
    return 0;
  };

  const calPriceSource = (sourceId, qtyInOrder, cupSize) => {
    const findSource = source.find((s) => s.id === sourceId);
    if (!findSource) return 0;
    if (cupSize === 49) {
      return Number(qtyInOrder) * Number(findSource.data.quantitySmall) * Number(findSource.data.pricePerGram);
    } else if (cupSize === 69) {
      return Number(qtyInOrder) * Number(findSource.data.quantityBig) * Number(findSource.data.pricePerGram);
    }
    return 0;
  };

  const calculateDailySummary = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalOrders = filterOrder.length;

    filterOrder.forEach((order) => {
      const d = order.data;
      const productRevenue = Number(d.totalPrice) - Number(d.deliveryFee);
      totalRevenue += productRevenue;

      let orderCost = 0;

      if (d.selectToping && ingredient.length > 0) {
        Object.entries(d.selectToping).forEach(([ingredientId, qty]) => {
          orderCost += calPriceToping(ingredientId, qty, d.cupSize);
        });
      }

      if (d.selectSpecial && special.length > 0) {
        Object.entries(d.selectSpecial).forEach(([specialId, qty]) => {
          orderCost += calPriceSpecial(specialId, qty, d.cupSize);
        });
      }

      if (Array.isArray(d.selectSource) && source.length > 0) {
        d.selectSource.forEach((sourceId) => {
          orderCost += calPriceSource(sourceId, 1, d.cupSize);
        });
      }

      totalCost += orderCost;
    });

    return {
      totalRevenue,
      totalCost,
      totalProfit: totalRevenue - totalCost,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  };

  const dailySummary = calculateDailySummary();

  return (
  <div className="container-fluid py-4">
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary mb-3">
            <FaCoins className="me-3" />
            สรุปผลต้นทุนกำไรรายวัน
          </h1>
        </div>

        {/* Search Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <FaCalendarAlt />
                  </span>
                  <input
                    type="date"
                    className="form-control form-control-md"
                    value={selectDay}
                    onChange={(e) => setDay(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <button 
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                  onClick={handleSearch} 
                  disabled={loading}
                >
                  <FaSearch className="me-2" />
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      กำลังค้นหา...
                    </>
                  ) : (
                    "ค้นหา"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {filterOrder.length > 0 && (
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-lg-3">
              <div className="card text-white bg-success shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <FaShoppingCart className="fs-2 me-3" />
                    <div>
                      <h6 className="card-title mb-0">ยอดขายสินค้า</h6>
                      <h4 className="mb-0">฿{dailySummary.totalRevenue.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card text-white bg-danger shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <FaCoins className="fs-2 me-3" />
                    <div>
                      <h6 className="card-title mb-0">ต้นทุนรวม</h6>
                      <h4 className="mb-0">฿{dailySummary.totalCost.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card text-white bg-info shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <FaChartLine  className="fs-2 me-3" />
                    <div>
                      <h6 className="card-title mb-0">กำไรรวม</h6>
                      <h4 className="mb-0">฿{dailySummary.totalProfit.toFixed(2)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card text-white bg-warning shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <FaReceipt className="fs-2 me-3" />
                    <div>
                      <h6 className="card-title mb-0">จำนวนออเดอร์</h6>
                      <h4 className="mb-0">{dailySummary.totalOrders}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Orders Message */}
        {filterOrder.length === 0 && !loading && (
          <div className="alert alert-info text-center py-4">
            <FaShoppingCart className="fs-1 text-muted mb-3" />
            <h5>ไม่มีออเดอร์ในวันที่เลือก</h5>
            <p className="mb-0 text-muted">กรุณาเลือกวันที่อื่นเพื่อค้นหาข้อมูล</p>
          </div>
        )}

        {/* Orders List */}
        {filterOrder.map((order) => {
          const d = order.data;
          let orderCost = 0;

          const toppingCosts = [];
          const specialCosts = [];
          const sourceCosts = [];

          if (d.selectToping && ingredient.length > 0) {
            Object.entries(d.selectToping).forEach(([ingredientId, qty]) => {
              const cost = calPriceToping(ingredientId, qty, d.cupSize);
              const name = ingredient.find(i => i.id === ingredientId)?.data.name || 'Unknown';
              toppingCosts.push({ name, qty, cost });
              orderCost += cost;
            });
          }

          if (d.selectSpecial && special.length > 0) {
            Object.entries(d.selectSpecial).forEach(([specialId, qty]) => {
              const cost = calPriceSpecial(specialId, qty, d.cupSize);
              const name = special.find(s => s.id === specialId)?.data.name || 'Unknown';
              specialCosts.push({ name, qty, cost });
              orderCost += cost;
            });
          }

          if (Array.isArray(d.selectSource) && source.length > 0) {
            d.selectSource.forEach((sourceId) => {
              const cost = calPriceSource(sourceId, 1, d.cupSize);
              const name = source.find(s => s.id === sourceId)?.data.name || 'Unknown';
              sourceCosts.push({ name, cost });
              orderCost += cost;
            });
          }

          const profit = (Number(d.totalPrice) - Number(d.deliveryFee)) - orderCost;
          const productRevenue = Number(d.totalPrice) - Number(d.deliveryFee);
          const profitMargin = productRevenue > 0 ? (profit / productRevenue) * 100 : 0;

          return (
            <div key={order.id} className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="mb-0">
                      <FaReceipt className="me-2" />
                      Order #{order.id.slice(-6)}
                    </h5>
                  </div>
                  <div className="col-auto">
                    <span className={`badge ${profit >= 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                      {profit >= 0 ? '📈' : '📉'} ฿{profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                <div className="row g-4">
                  {/* Order Details */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <h6 className="text-primary mb-2">
                        <FaCoffee className="me-2" />
                        รายละเอียดสินค้า
                      </h6>
                      <p className="mb-2">{d.description}</p>
                      <div className="badge bg-secondary">
                        ขนาดถ้วย: {d.cupSize} ml
                      </div>
                    </div>

                    {/* Toppings */}
                    {toppingCosts.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-warning mb-2">
                          <FaPlus className="me-2" />
                          ท็อปปิง
                        </h6>
                        <div className="list-group list-group-flush">
                          {toppingCosts.map((item, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                              <small>{item.name} ({item.qty} หน่วย)</small>
                              <span className="text-danger">฿{item.cost.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Items */}
                    {specialCosts.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-info mb-2">
                          <FaCoins className="me-2" />
                          พิเศษ
                        </h6>
                        <div className="list-group list-group-flush">
                          {specialCosts.map((item, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                              <small>{item.name} ({item.qty} หน่วย)</small>
                              <span className="text-danger">฿{item.cost.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sauces */}
                    {sourceCosts.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-success mb-2">
                          <FaTint className="me-2" />
                          ซอส
                        </h6>
                        <div className="list-group list-group-flush">
                          {sourceCosts.map((item, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                              <small>{item.name}</small>
                              <span className="text-danger">฿{item.cost.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary */}
                  <div className="col-lg-6">
                    <h6 className="text-primary mb-3">
                      <FaChartLine  className="me-2" />
                      สรุปทางการเงิน
                    </h6>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="card bg-light h-100">
                          <div className="card-body p-3">
                            <small className="text-muted">ราคาขายรวม</small>
                            <h6 className="text-primary mb-0">฿{Number(d.totalPrice).toFixed(2)}</h6>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-light h-100">
                          <div className="card-body p-3">
                            <small className="text-muted">ค่าจัดส่ง</small>
                            <h6 className="text-warning mb-0">฿{Number(d.deliveryFee).toFixed(2)}</h6>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-light h-100">
                          <div className="card-body p-3">
                            <small className="text-muted">ราคาสินค้า</small>
                            <h6 className="text-success mb-0">฿{productRevenue.toFixed(2)}</h6>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-light h-100">
                          <div className="card-body p-3">
                            <small className="text-muted">ต้นทุน</small>
                            <h6 className="text-danger mb-0">฿{orderCost.toFixed(2)}</h6>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className={`card ${profit >= 0 ? 'bg-success' : 'bg-danger'} text-white`}>
                          <div className="card-body p-3">
                            <div className="row align-items-center">
                              <div className="col">
                                <small>กำไร</small>
                                <h5 className="mb-0">฿{profit.toFixed(2)}</h5>
                              </div>
                              <div className="col-auto">
                                <div className="text-end">
                                  <small>ส่วนแบ่งกำไร</small>
                                  <h6 className="mb-0">{profitMargin.toFixed(1)}%</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  <div className="col-12 d-flex mt-2 gap-2 d-flex">
                      <button 
                      className="btn btn-warning w-50"
                      data-bs-toggle='modal'
                      data-bs-target='#updateOrder'
                      onClick={()=>setUpdate(order)}
                      >แก้ไข</button>
                      <button 
                      className="btn btn-danger w-50"
                      data-bs-toggle='modal'
                      data-bs-target='#deleteOrder'
                      onClick={()=>setSelDel(order)}
                      >ลบ</button>
                  </div>
                  </div>
                  
                </div>
              </div>
            </div>
          );
        })}
        <DeleteOrderModal selectDelete={selectOrerDelete}/>
        <UpdateOrderModal selectOrder={selectOrderUpdate}/>
      </div>
    </div>
  </div>
);
}
