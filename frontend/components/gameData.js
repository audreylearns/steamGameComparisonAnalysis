import useSWR from "swr";
import { Image, Container } from "react-bootstrap";
import Currency from '@/components/currency';

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
                        <span class="max-w-96 min-w-96 font-bold text-2xl font-mono uppercase">{data.details.name}</span>
                        <div class="max-w-96 min-w-96">
                            <Container class="flex">
                                <a class="hover:underline text-sm" href={data.details.website}>{data.details.developers}</a>                      
                                <p className="self-end text-right"> <Currency val={data.details.price_overview.final/100}/></p>
                            </Container>
                            <br/>
                            <span class="text-sm">{data.details.short_description}<br/><br/></span>
                            {data.details.genres.map((genre)=> (
                                <span class="text-xs font-light">{ genre.description  } </span>
                            ))}
                            <hr className="h-1 bg-black"/>
                            <br/>
                            <p class="font-bold text-center">Sentiment Analysis</p>
                            <p>STEAM scored {data.details.name} at <u>{Math.round(data.RevSummary.score)}% out of {data.RevSummary.total} reviews!</u></p><br/>
                            <br/>
                            Our In-depth analysis concluded: 
                            <br/><br/>
                            <Container class="flex">
                                <img class="inline" src="./pos.png"/>
                                <span> {data.result[1]} %</span>
                                {/* Review sample */}
                                <br/><br/>
                                <img   class="inline" src="./neut.png"/>
                                <span> {data.result[0]} %</span>
                                {/* Review sample */}
                                <br/><br/>
                                <img   class="inline" src="./neg.png"/>
                                <span> {data.result[-1]} %</span>
                                {/* Review sample */}
                                <br/>
                            </Container>
     
                        </div>

                    </>
                )
            }

        </>
    )

}