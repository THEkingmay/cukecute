import { db } from ".";
import { getDocs , collection , addDoc , doc , deleteDoc } from "firebase/firestore";

const getAllSpecial = async () =>{
    try{
        const data =await getDocs(collection(db,'special'))
        let tmp = [] 
        if(data){
            data.forEach(d=>tmp.push({
                id:d.id,
                data:d.data()
            }))
        }
        console.log("get all special : ", tmp)
        return tmp
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

const addSpecial = async(data)=>{
    try{
        await addDoc(collection(db , 'special') , data)
        console.log("add special : ",data)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
const deleteSpecial = async(id)=>{
    try{
        await deleteDoc(doc(db,'special' , id))
        console.log("delete special : ",id)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

export {getAllSpecial , addSpecial , deleteSpecial}