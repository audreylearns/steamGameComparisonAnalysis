
import { Container, Card, Button} from 'react-bootstrap'
import { useAtom } from 'jotai';
import { gameCtAtom, gameID1Atom, gameID2Atom} from '@/atoms';
import { useState } from 'react';
import GameSearch from "@/components/gameSearch";
import GameData from '@/components/gameData';

export default function Home() {
  const [gameCt, setGameCt] = useAtom(gameCtAtom);
  const [gameID1, setGameID1] = useAtom(gameID1Atom);
  const [gameID2, setGameID2] = useAtom(gameID2Atom);
  
  const [add, setAdd] = useState(false)
  const [show1, setShow1] = useState(true)
  const [show2, setShow2] = useState(true)

  return (

    <main>
      
      <Container fluid className="grid grid-flow-col place-content-center font-mono text-black space-x-4"> 
        {gameCt == 0 &&
            <Card  className="border-4 border-black rounded-lg p-8">
              <Card.Body className="overflow-y-auto max-h-96" ><GameSearch/></Card.Body>
            </Card>
        }

        {gameCt == 1 &&
          <>
            <Card  className="border-4 border-black rounded-lg p-8">
              <Card.Body class="overflow-y-auto max-h-96"><GameData id={gameID1}/></Card.Body>
            </Card>
            {add == true? (
              <Card  className="border-4 border-black rounded-lg p-8">
                <Card.Body className="overflow-y-auto max-h-96"><GameSearch/></Card.Body>
              </Card>
            ):(
              <Button className="place-self-start border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button"  
              onClick={() => {
                setAdd(true);
                setShow1(true);
                setShow2(true);
              }} >+</Button>
            )}

          </>
        }

        {gameCt == 2 &&
          <>
            {show1 == true? (
              <>
                <Card className="border-4 border-black rounded-lg p-8">
                  <Card.Body class="overflow-y-auto max-h-96">
                    <GameData id={gameID1}/>
                  </Card.Body>
                </Card>
                <Button className="place-self-start border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button"  
                  onClick={() => 
                    {setShow1(false);
                      setAdd(false);
                      setGameID1(gameID2)
                      setGameID2("");
                      setGameCt(1);
                    }} >x</Button>
              </>
              ): <></>
            }

            {show2 == true? (
              <>
                <Card className="border-4 border-black rounded-lg p-8">
                  <Card.Body class="overflow-y-auto max-h-96">
                    {gameID1 != gameID2?
                      (
                        <GameData id={gameID2}/>
                      ):
                      (
                        <>
                          <p>The game you searched for is already displayed</p>
                          <br/><br/>
                          <GameSearch/>
                        </>
                        
                      )
                    }
                    
                  </Card.Body>
                </Card>
                <Button className="place-self-start border rounded-md border-black hover:bg-white hover:border-black hover:text-black" variant="dark" type="button"  
                onClick={() => 
                  {setShow2(false);
                    setAdd(false);
                    setGameID2("");
                    setGameCt(1);
                  }} >x</Button>
              </>

              ): <></>
            }
          </>
        }
        
      </Container>
    </main>
  );
}

