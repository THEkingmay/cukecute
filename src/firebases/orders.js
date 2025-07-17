import { db } from ".";
import { getDocs , collection , addDoc , deleteDoc , where , query , Timestamp , doc , updateDoc} from "firebase/firestore";

const getAllOrders = async() =>{
    try{
        const data = await getDocs(collection(db,'orders'))
       let orders = [] 
       if(data){
            data.forEach(d=>{
                orders.push({
                    id:d.id,
                    data:d.data()
                })
            })
       }
       console.log("orders " ,orders)
       return orders
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
 
const getOrdersByDate = async (selectDate) => {
    if(!selectDate) selectDate=new Date().toISOString().split('T')[0]
  try {
    const rawDate = new Date(selectDate);  // selectDate เป็น "YYYY-MM-DD"

    // สร้าง start และ end โดยไม่ทำลาย rawDate
    const start = new Date(rawDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(rawDate);
    end.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "orders"),
      where("date", ">=", Timestamp.fromDate(start)),
      where("date", "<=", Timestamp.fromDate(end))
    );

    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    console.log(`orders on ${selectDate}:`, orders);
    return orders;

  } catch (err) {
    console.error(err);
    throw err;
  }
};

const addOrder = async (newOrder)=>{
    try{
        await addDoc(collection(db,'orders'), newOrder)
        console.log("add order in firestore")
    }catch(err){
        console.log(err)
    }
}

const deleteOrder = async (id ) =>{
try{
        await deleteDoc(doc(db,'orders',id))
        console.log("delete order in firestore")
    }catch(err){
        console.log(err)
    }
}

const updateStatus =async(id , newStatus) =>{
    try{
        const docRef = doc(db , 'orders' , id)
        await updateDoc(docRef  , {
            isDelivered : newStatus
        } )
        console.log("เปลี่ยนสถานะการส่งออเดอร์แล้วเป็น ", newStatus)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

const updateOrder = async (id , data)=>{
    try{
        const docRef = doc(db, 'orders' , id)
        await updateDoc(docRef , data)
        console.log("update order id : " , id , "with new data : "  ,data)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

export {getAllOrders , addOrder  ,deleteOrder, updateOrder , getOrdersByDate , updateStatus}