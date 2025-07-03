import { createContext, useEffect , useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAllIngredient } from "../firebases/ingredient"
import { getAllOrders } from "../firebases/orders"

const DataContext = createContext()

export default function DataContextProvider({ children }) {
  const [isLoading , setLoading ] = useState(true)

  const [ingredientContext , setIngredient] = useState([])
  const [ordersContext , setOrders] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

  const fetchIngredient = async()=>{
    try{
        const data = await getAllIngredient()
        if(data) setIngredient(data)
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

  if(isLoading)return <div>Loading</div>

  return (
    <DataContext.Provider value={{ navigate, location , ingredientContext , fetchIngredient  , ordersContext}}>
      {children}
    </DataContext.Provider>
  )
}

export { DataContext }
