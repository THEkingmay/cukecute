import { useEffect , useContext, useState} from "react";
import {DataContext } from "../pages/DataContextProvider";

export default function UpdateOrderModal({ selectOrder }) {
    const { ingredientContext, specialContext, sourceContext  , fetchAllOrdersByDate} = useContext(DataContext);

    const [ingredientList, setIngredient] = useState([]);
    const [specialList, setSpecial] = useState([]);
    const [sourceList, setSource] = useState([]);

    const [description , setDescription]= useState('')
    const [cupSize, setCup] = useState(null);
    const [selectToping, setSelectToping] = useState({});
    const [selectSource, setSelectSource] = useState([]);
    const [selectSpecial, setSelectSpecial] = useState({});
    const [deliveryFee, setDeliFee] = useState(0);
    const [date , setDate] = useState('')

    const formatDate = (date) => {
        const d = new Date(date.toDate());
        console.log("date : " ,d.toISOString().split("T")[0])
        return d.toISOString().split("T")[0]; // return "2025-07-17"
    }
    useEffect(() => {
        if (!selectOrder || !selectOrder.data) return;

        const data = selectOrder.data;

        setCup(data.cupSize || '');
        setDate(formatDate(data.date) || '');
        setDeliFee(data.deliveryFee || '');
        setDescription(data.description || '');
        setSelectToping(data.selectToping || '');
        setSelectSource(data.selectSource || '');
        setSelectSpecial(data.selectSpecial || '');
        console.log(selectOrder)
    }, [selectOrder]);

    useEffect(() => setIngredient(ingredientContext), [ingredientContext]);
    useEffect(() => setSpecial(specialContext), [specialContext]);
    useEffect(() => setSource(sourceContext), [sourceContext]);

    return (
        <div 
            className="modal fade"
            id="updateOrder"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">อัปเดตคำสั่งซื้อ</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <p>กำลังสร้างเร็วๆนี้</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                        {/* <button type="button" className="btn btn-primary">บันทึกการเปลี่ยนแปลง</button> */}
                    </div>

                </div>
            </div>
        </div>
    );
}
