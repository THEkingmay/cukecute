import { DataContext } from "../pages/DataContextProvider";
import { useState, useContext, useEffect } from "react";

export default function AddNewOrder() {
  const { ingredientContext } = useContext(DataContext);
  const [ingredientList, setIngredient] = useState([]);

  useEffect(() => {
    setIngredient(ingredientContext);
  }, [ingredientContext]);

  const handleSave = async () => {
    const newOrder = {
      // เติมข้อมูลออเดอร์ตรงนี้
    };

    document.getElementById("closeOrderModal").click();
    console.log(newOrder);
  };

  const [currentPrice , setCurrPrice] = useState(0)


  const [cupSize , setCup ] = useState(0)
  const [selectToping , setSelectToping] = useState([])
  const [selectSource , setSelectSource ] = useState([])

  useEffect(()=>{
    // console.log("Cupsize  : ", cupSize)
    // console.log("Select topping : " ,selectToping)
    setCup(cupSize)
    if(cupSize==0) return
    const MAX_LEN = cupSize===49 ? 2 : 4
    if((cupSize===49 && selectToping.length>2) || (cupSize===69 && selectToping.length>4)){ // ถ้าจำนวนท็อปปิ้งของแต่ละถ้วยเกินโควต้าค่อยคิดคำนวน
          const moreQuotaToping = (selectToping.length-MAX_LEN)*5 // จำนวนท็อปปอิงที่เลือกลบกับจำนวนท็อปปิงที่ทำได้ * 5 บาท เพราะอย่างละ 5บาท
          console.log("Toping ", moreQuotaToping)
          setCurrPrice(cupSize+moreQuotaToping)
    }else setCurrPrice(cupSize)

    if(selectSource.length>1){
      const moreSource = (selectSource.length-1)*5
      setCurrPrice(prev=>prev+moreSource)
    }

  },[cupSize , selectToping , selectSource])

  


  const handleCupsize =(size) =>{
    setCup(size)
    if(size==49){
      document.getElementById('cup49').className="btn btn-success"
      document.getElementById('cup69').className="btn btn-outline-success"
    }else{
      document.getElementById('cup49').className="btn btn-outline-success"
      document.getElementById('cup69').className="btn btn-success"
    }
  }

  const handleSelectToping = (id) =>{ // กดครั้งแรกเอาเข้า กดครั้งต่อไปเอาออก
    const haveId = selectToping.find(i=>i==id)
    if(haveId){ // มีอยู่แล้ว เอาออก 
        let tmp = selectToping.filter(s=>s!=id)
        setSelectToping(tmp)
        document.getElementById(`TP${id}`).className="btn btn-outline-success"
    }else{
        setSelectToping(prev=>[...prev , id])
        document.getElementById(`TP${id}`).className="btn btn-success"
    }
  }

  const handleSelectSource = (id)=>{
    
  }

  return (
    <div
      className="modal fade"
      id="addOrderModal"
      tabIndex="-1"
      aria-hidden="true"
    >
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
            <div>ราคาปัจจุบัน{currentPrice} บาท</div>
            <div>
                <div>เลือกขนาดถ้วย</div>
                <button onClick={()=>handleCupsize(49)} id="cup49" className="btn btn-outline-success ">49 บาท</button>
                <button onClick={()=>handleCupsize(69)}  id="cup69" className="btn btn-outline-success">69 บาท</button>
            </div>
            <div>
              <div>เลือกท็อปปิ้ง</div>
              {ingredientList.map(i=>
              <div key={i.id}>
                  <button id={`TP${i.id}`} onClick={()=>handleSelectToping(i.id)} className="btn btn-outline-success" key={i.id}>{i.data.name}</button>
              </div>)}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ปิด
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
