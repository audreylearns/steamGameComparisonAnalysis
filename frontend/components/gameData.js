import useSWR from "swr";
import { Image } from "react-bootstrap";

export default function GameData({id}){
    const { data, isLoading, error,} = useSWR("http://localhost:8080/api/game?id="+ id)

    return (
        <>
            {data === undefined?
                (
                    <>
                        <Image class="text-center" src="https://i.gifer.com/XOsX.gif" width="100" height="100" />
                        <p class="text-center font-mono">L O A D I N G</p>
                    </>
                )
                :(
                    <>
                        <Image src={data.details.header_image} /> 
                    </>
                )
            }

        </>
    )

}