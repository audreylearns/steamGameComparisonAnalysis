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
    if (gameCt == 2 ){
      setGameID2(id)
      setGameCt(2)
    }else{
      setGameID1(id)
      setGameCt(1)
    }
  }
  return (
      <>
        {search === false ? (
          <>
            <p class="text-center">Enter the game title:</p>
            <form class="text-center" onSubmit={handleSubmit(submitForm)}>
                <input class="text-center border text-center border-3 border-black" {...register("title")} /><br /><br />
                <Button class="border bg-black text-white rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="outline-light" type="submit">search</Button>
            </form>
          </>
      ) : (
        <Accordion>
          {searchResult?.length == 0 && <p>We're sorry, "{gameTitle}" is not available in Steam! </p> }
          {
            searchResult?.map(game =>{
              return(
                <Accordion.Item eventKey={game.appid} className="border border-black">
                  <Accordion.Body className="grid grid-cols-1 p-3">
                    <Image style={{verticalAlign: "center" }}src={game.logo} rounded /> 
                    <p class="text-centered">{game.name }</p>
                    <Button className="place-self-end border  bg-black text-white rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="outline-light" type="button"  onClick={() => gameAnalysis(game.appid)} >analyze</Button>
                  </Accordion.Body>
                </Accordion.Item>
              )
            })
          }
        </Accordion>
      )
    }

    </>
  )
}