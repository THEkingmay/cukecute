import { db } from ".";
import { getDocs , collection } from "firebase/firestore";

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

export {getAllOrders}