import { BrowserRouter , Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IngredientPage from './pages/Ingredient';
import DataContextProvider from './pages/DataContextProvider';

export default function App(){
    return(
        <BrowserRouter>
            <DataContextProvider>
                <Navbar/>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/ingredient' element={<IngredientPage/>}/>
                </Routes>
            </DataContextProvider>
        </BrowserRouter>
    )
}