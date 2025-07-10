import { createContext, useEffect , useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAllIngredient } from "../firebases/ingredient"
import { getAllOrders } from "../firebases/orders"
import { getAllSource } from "../firebases/source"
import { getAllSpecial } from "../firebases/specialIngredient"

const DataContext = createContext()

export default function DataContextProvider({ children }) {
  const [isLoading , setLoading ] = useState(true)

  const [ingredientContext , setIngredient] = useState([])
  const [specialContext , setSpecial ] = useState([])
  const [sourceContext , setSource ] = useState([])
  const [ordersContext , setOrders] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

  const fetchIngredient = async()=>{
    try{
        const data = await getAllIngredient()
        if(data) setIngredient(data)
        const special = await getAllSpecial()
        if(special) setSpecial(special)
        const souce = await getAllSource()
        if(souce) setSource(souce)
    }catch(err){
        alert(err)
    }
  }
  
  const fetchAllOrders = async () =>{
    try{
        const data = await getAllOrders()
       if(data)setOrders(data)
    }catch(err){
        alert(err)
    }
  }

  useEffect(()=>{
    fetchIngredient()
    fetchAllOrders()
    setLoading(false)
  },[])

  if(isLoading)return <div>กำลังโหลด...</div>

  return (
    <DataContext.Provider value={{ navigate, location , ingredientContext , specialContext , sourceContext, fetchIngredient  , fetchAllOrders, ordersContext}}>
      {children}
    </DataContext.Provider>
  )
}

export { DataContext }
