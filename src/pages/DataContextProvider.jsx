import { createContext, useEffect , useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAllIngredient } from "../firebases/ingredient"
import { getOrdersByDate} from "../firebases/orders"
import { getAllSource } from "../firebases/source"
import { getAllSpecial } from "../firebases/specialIngredient"
import Loading from "../components/Loading"

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
        const special = await getAllSpecial() 
        const source = await getAllSource() 

        // let data = await import('../../devData/ingredient.json') // comment this line when production
        // data = data.default // comment this line when production
        // let special = await import('../../devData/special.json') // comment this line when production
        // special = special.default // comment this line when production
        // let source = await import('../../devData/source.json') // comment this line when production
        // source = source.default // comment this line when production

      
        if(data) setIngredient(data)
        if(special) setSpecial(special)
        if(source) setSource(source) 
    }catch(err){
        alert(err)
    }
  }
  
  const fetchAllOrdersByDate = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2025-07-11"
    const data = await getOrdersByDate(today);
    if (data) setOrders(data);
  } catch (err) {
    alert(err.message || err);
  }
};

useEffect(() => {
  const fetchAll = async () => {
    await fetchIngredient();
    await fetchAllOrdersByDate();
    setLoading(false);
  };
  fetchAll();
}, []);

  if(isLoading)return <div><Loading/></div>

  return (
    <DataContext.Provider value={{ navigate, location , ingredientContext , specialContext , sourceContext, fetchIngredient  , fetchAllOrdersByDate, ordersContext}}>
      {children}
    </DataContext.Provider>
  )
}

export { DataContext }
