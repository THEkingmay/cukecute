import { db } from ".";
import { getDocs , collection , addDoc , doc, deleteDoc } from "firebase/firestore";

const getAllSource = async () =>{
    try{
        const data =await getDocs(collection(db,'source'))
        let tmp = [] 
        if(data){
            data.forEach(d=>tmp.push({
                id:d.id,
                data:d.data()
            }))
        }
        console.log("get all soure : ", tmp) 
        return tmp
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

const addSource = async(data)=>{
    try{
        await addDoc(collection(db , 'source') , data)
        console.log("add source : ",data)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
const deleteSource = async(id)=>{
    try{
        await deleteDoc(doc(db,'source' , id))
        console.log("delete source : ",id)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

export {getAllSource , addSource , deleteSource}