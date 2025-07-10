import { db } from ".";
import { getDocs , collection , addDoc , deleteDoc} from "firebase/firestore";

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

export {getAllOrders , addOrder  ,deleteOrder}