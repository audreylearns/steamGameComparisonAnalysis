import useSWR from "swr";
import { Image, Container, Button, Carousel} from "react-bootstrap";
import { useAtom } from 'jotai';
import { gameCtAtom} from '@/atoms';
import Currency from '@/components/currency';
import GameSearch from "./gameSearch";

export default function GameData({id}){
    const { data, isLoading, error,} = useSWR("http://localhost:8080/api/game?id="+ id)
    const [gameCt, setGameCt] = useAtom(gameCtAtom);

    return (
        <>
            {data === undefined?
                (
                    <>
                        <Image class="text-center" src="https://i.gifer.com/XOsX.gif" width="150" height="150" />
                        <p class="text-center font-mono">L O A D I N G</p>
                    </>
                )
                :(
                    <>
                        {data == "game unreleased"?
                            (
                            <>
                                <p>{data}</p>
                                <GameSearch />
                            </>
                            
                            )
                            :
                            
                            (
                                <>
                                    <Image src={data.details.header_image} /> 
                                    <span class="max-w-96 min-w-96 font-bold text-2xl font-mono uppercase">{data.details.name}</span>
                                    <div class="max-w-96 min-w-96">
                                        <Container class="flex">
                                            <a class="hover:underline text-sm" href={data.details.website}>{data.details.developers}</a>       
                                            {data.details.is_free == false ?
                                                (<p className="self-end text-right"> <Currency val={data.details.price_overview.final/100}/></p>) : (
                                                    <p className="self-end text-right"> F R E E </p>
                                                )
                                            }               
                                            
                                        </Container>
                                        <br/>
                                        <span class="text-sm">{data.details.short_description}<br/><br/></span>
                                        {data.details.genres.map((genre)=> (
                                            <span class="text-xs font-light">{ genre.description  } </span>
                                        ))}
                                                                
                                        <div className="p-2 border-y-2">
                                            <p>STEAM scored {data.details.name} at <u>{Math.round(data.RevSummary.score)}% out of {data.RevSummary.total} (english) reviews!</u></p><br/>
                                            <p>Recommended by a total of <u>{data.details.recommendations.total}</u> users! </p>
                                        </div>

                                        <br/>
                                        <p class="font-bold text-center">Sentiment Analysis</p>
                                        <br/>
                                        Our In-depth analysis concluded: 
                                        <br/><br/>
                                        <Container>
                                            <div className="text-center">
                                                <img class="inline" src="./pos.png"/>
                                                <span> {data.result[1]} %</span>
                                            </div>
                                            <Carousel className="border-b-4" data-bs-theme="dark">
                                                {data.pos_review.map((pos, index) =>{
                                                    return(
                                                    <Carousel.Item key={index}>
                                                        <img class="inline"
                                                        src="./banner_bg.png" alt=""/>    
                                                        <Carousel.Caption>
                                                            <span className="text-xs">{pos.review}</span>
                                                            <p className="text-neutral-400">
                                                                <span className="text-xs">pos:{pos.pos} </span>
                                                                <span className="text-xs">neu:{pos.neu} </span>
                                                                <span className="text-xs">neg:{pos.neg} </span>
                                                            </p>
                                                        </Carousel.Caption>
                                                    </Carousel.Item>
                                                    )
                                                })}
                                            </Carousel>
                                            
                                            <br/><br/>
                                            <div className="text-center">
                                                <img   class="inline" src="./neut.png"/>
                                                <span> {data.result[0]} %</span>
                                            </div>
                                            <Carousel className="border-b-4" data-bs-theme="dark">
                                                {data.neu_review.map((neu, index) =>{
                                                    return(
                                                    <Carousel.Item key={index}>
                                                        <img class="inline"
                                                        src="./banner_bg.png" alt=""/>    
                                                        <Carousel.Caption>
                                                            <span className="text-xs">{neu.review}</span>
                                                            <p className="text-neutral-400">
                                                                <span className="text-xs">pos:{neu.pos} </span>
                                                                <span className="text-xs">neu:{neu.neu} </span>
                                                                <span className="text-xs">neg:{neu.neg} </span>
                                                            </p>
                                                        </Carousel.Caption>
                                                    </Carousel.Item>
                                                    )
                                                })}
                                            </Carousel>


                                            <br/><br/>
                                            <div className="text-center">
                                                <img   class="inline" src="./neg.png"/>
                                                <span> {data.result[-1]} %</span>
                                            </div>
                                            <Carousel className="border-b-4" data-bs-theme="dark">
                                                {data.neg_review.map((neg, index) =>{
                                                    return(
                                                    <Carousel.Item key={index}>
                                                        <img class="inline"
                                                        src="./banner_bg.png" alt=""/>    
                                                        <Carousel.Caption>
                                                            <span className="text-xs">{neg.review}</span>
                                                            <p className="text-neutral-400">
                                                                <span className="text-xs">pos:{neg.pos} </span>
                                                                <span className="text-xs">neu:{neg.neu} </span>
                                                                <span className="text-xs">neg:{neg.neg} </span>
                                                            </p>
                                                        </Carousel.Caption>
                                                    </Carousel.Item>
                                                    )
                                                })}
                                            </Carousel>

                                            <br/>
                                        </Container>

                                        <p  className="font-bold text-center">Reviews Clustering Analysis</p>
                                        <p className="text-xs"> <u>TOP 7 words</u>: 
                                        {data.keywords.map((w)=> (
                                            <span className="text-xs font-light">{  w  } </span>
                                        ))}
                                        </p>
                
                                    </div><br/>
                                    <p className="text-center "><Button className="place-self-start border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button"  href={`https://store.steampowered.com/app/${id}`}> Get on steam </Button></p>                                                                       
                                </>
                            )

                        }
                        
                    </>
                )
            }

        </>
    )

}