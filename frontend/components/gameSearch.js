import { useForm } from 'react-hook-form';
import {Button, Accordion, Image } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import useSWR from "swr";
import { gameCtAtom, gameID1Atom, gameID2Atom } from '@/atoms';

export default function GameSearch(){

  const [search, setSearch] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [gameTitle, setGameTitle] = useState("")

  const { data, isLoading, error,} = useSWR("http://localhost:8080/api/search?title="+ gameTitle)

  const { register,handleSubmit} = useForm({
    defaultValues: {
      title: ""
    }
  });
  
  const [gameCt, setGameCt] = useAtom(gameCtAtom);
  const [gameID1, setGameID1] = useAtom(gameID1Atom);
  const [gameID2, setGameID2] = useAtom(gameID2Atom);

  useEffect(() => {
    let results = []
    if (search && data !== undefined) { 
        
        for (let x in data) {
          results.push(data[x]);
        }
        setSearchResult(results);
    }
    },[data])

  function submitForm(data){
    setGameTitle(data.title)
    setSearch(true)
  }

  function gameAnalysis(id){
    // set gameid

    if (gameCt == 0){
      setGameID1(id)
      setGameCt(1)
    }else{
      setGameID2(id)
      setGameCt(2)

    }

  }
  return (
      <>
        {search === false ? (
          <>
            <p className="text-center">Enter the game title:</p>
            <form className="text-center" onSubmit={handleSubmit(submitForm)}>
                <input className="text-center border text-center border-3 border-black" {...register("title")} /><br /><br />
                <Button className="border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="submit">search</Button>
            </form>
          </>
      ) : (
        <>
          <div>
              <Accordion>
                {searchResult?.length == 0 && 
                    <div className="text-center">We&apos;re sorry, &quot;{gameTitle}&quot; is not available in Steam! 
                      <br/><br/>
                    </div> 
                  }
                {
                  searchResult?.map(game =>{
                    return(
                      <Accordion.Item Key={game.appid} className="border border-black">
                        <Accordion.Body className="grid grid-cols-1 p-3">
                          <Image style={{verticalAlign: "center" }}src={game.logo} rounded /> 
                          <p class="text-centered">{game.name }</p>
                          <Button className="place-self-end border  border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button"  onClick={() => gameAnalysis(game.appid)} >analyze</Button>
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })
                }
              </Accordion>
              <br/><br/>
              <div className="text-center"><Button className="border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button" onClick={() => setSearch(false)}>try again</Button></div>
          </div>
        </>
      )
    }

    </>
  )
}