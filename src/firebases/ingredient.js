import { db } from ".";
import { getDocs , doc , collection , addDoc , deleteDoc, updateDoc} from "firebase/firestore";

const getAllIngredient = async () =>{
    let ingredients  = [] 
    try{
        const data = await getDocs(collection(db, 'ingredients'))
        data.forEach(d=>{
            ingredients.push({
                id:d.id,
                data:d.data()
            })
        })
        console.log("ingredient : ", ingredients)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
    return ingredients
}

const addNewIngredient = async(data) =>{
    try{
        await addDoc(collection(db, 'ingredients') , data)
        console.log("Add to firebase success")
    }catch{
        console.log(err)
        throw new Error(err)
    }
}

const deleteIngredient = async(id)=>{
    try{
        await deleteDoc(doc(db,'ingredients',id))
        console.log('deleted ingredient')
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
const updateIngredient = async(id , newData)=>{
    try{
        await updateDoc(doc(db, 'ingredients',id) , newData)
        console.log("update ingredient id : " , id , 'new data : ' , newData)
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
export {getAllIngredient , addNewIngredient , updateIngredient,  deleteIngredient }