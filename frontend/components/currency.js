import useSWR from "swr";
import { useState, useEffect } from "react";

export default function Currency({val}){

    
    const [ISO, setISO] = useState("CAD")
    const [convPrice, setConvPrice] = useState(val)
    const { data, isLoading, error,} = useSWR("http://localhost:8080/api/currency?value=" + val + "&code=" + ISO)
    
    
    useEffect(() => {
        if (data) { 
            setConvPrice(data);
        }
        },[data])

    return(
        <>
            <label>$ 
                {ISO == "CAD"?
                    (
                        <span>{val}</span>
                    ):(
                        <span>{convPrice}</span>
                    ) 
                }


                <select
                    name="isoChange"
                    onChange={e => setISO(e.target.value)}
                >
                    <option value="CAD">CAD</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                    <option value="USD">USD</option>
                </select>
            </label>
        </>
    )
}