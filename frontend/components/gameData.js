import useSWR from "swr";
import { Image, Container, Button, Carousel} from "react-bootstrap";
import { useAtom } from 'jotai';
import { gameCtAtom, gameID1Atom, gameID2Atom} from '@/atoms';
import Currency from '@/components/currency';
import GameSearch from "./gameSearch";

export default function GameData({id}){
    const { data, isLoading, error,} = useSWR("http://localhost:8080/api/game?id="+ id)
    const [gameCt, setGameCt] = useAtom(gameCtAtom);
    const [gameID1, setGameID1] = useAtom(gameID1Atom);
    const [gameID2, setGameID2] = useAtom(gameID2Atom);

    function unreleased(){
        if (gameCt == 2){
            setGameID2("")
        }else{
            setGameID1("")
        }
    }
    return (
        <>
            {data === undefined?
                (
                    <>
                        <Image class="text-center" src="./loading.gif" width="150" height="150" />
                        <p class="text-center font-mono">L O A D I N G</p>
                        
                    </>
                )
                :(
                    <>
                        {data.error?
                            (
                            <>
                                <br/><br/><br/><br/>
                                <p className="text-center text-xl font-bold uppercase">Review Analysis not possible</p>
                                <p className="text-center"> {data.error}</p>
                                <hr className="h-1 bg-black"/><br/>
                                <p className="text-center text-xs text-slate-400"> Please close the card and try again</p>
                            </>
                            
                            )
                            :
                            
                            (
                                <>
                                    <Image src={data.details.header_image} /> 
                                    <span class="max-w-96 min-w-96 font-bold text-2xl font-mono uppercase">{data.details.name}</span>
                                    <div class="max-w-96 min-w-96">
                                        <Container class="flex">
                                            <a target="_blank" className="hover:underline text-sm" href={data.details.website}>{data.details.developers}</a>       
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
                                                                
                                        <div className="text-sm p-2 bg-slate-200 border-black border-y-2">
                                            <p>STEAM scored {data.details.name} at <u>{Math.round(data.RevSummary.score)}% out of {data.RevSummary.total} (english) reviews!</u></p><br/>
                                            {data.details.recommendations?.total &&
                                                <p>Recommended by a total of <u>{data.details.recommendations?.total}</u> users! </p>
                                            }
                                            
                                        </div>

                                        <br/>
                                        <p class="font-bold text-center">Sentiment Analysis</p>
                                        <br/>
                                        Our In-depth analysis concluded: 
                                        <br/><br/>
                                        <Container>
                                        {data.result[1] &&
                                            <>
                                                <div className="text-center">
                                                    <img class="inline" src="./pos.png"/>
                                                        <span> {data.result[1]} %</span>
                                                    
                                                </div>
                                                <Carousel className="border-b-4" data-bs-theme="dark">
                                                    {data.pos_review?.map((pos, index) =>{
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
                                            </>
                                        }
                                            
                                            
                                            <br/><br/>
                                            {data.result[0] &&
                                                <>
                                                    <div className="text-center">
                                                        <img   class="inline" src="./neut.png"/>
                                                            <span> {data.result[0]} %</span>
                                                    </div>
                                                    <Carousel className="border-b-4" data-bs-theme="dark">
                                                        {data.neu_review?.map((neu, index) =>{
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
                                                </>
                                            }



                                            <br/><br/>
                                            {data.result[-1] &&
                                                <>
                                                    <div className="text-center">
                                                        <img   class="inline" src="./neg.png"/>
                                                            <span> {data.result[-1]} %</span>
                                                    </div>
                                                    <Carousel className="border-b-4" data-bs-theme="dark">
                                                        {data.neg_review?.map((neg, index) =>{
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
                                                </>
                                            }

                                            
                                        </Container>
                                        <br/>
                                        <p  className="font-bold text-center">Reviews Clustering Analysis</p><br/>
                                        <p className="text-xs"> <u>TOP 7 words</u>: 
                                        {data.keywords?.map((w)=> (
                                            <span className="text-xs font-light">{  w  } </span>
                                        ))}
                                        </p>
                
                                    </div><br/>
                                    <p className="text-center "><Button target="_blank" className="place-self-start border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button"  href={`https://store.steampowered.com/app/${id}`}> Get on steam </Button></p>                                                                       
                                </>
                            )

                        }
                        
                    </>
                )
            }

        </>
    )

}