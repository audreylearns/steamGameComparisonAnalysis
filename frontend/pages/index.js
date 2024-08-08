
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
      <br/><br/><br/><br/>
      <Container fluid className="grid grid-flow-col place-content-center font-mono text-black space-x-10"> 
        {gameCt == 0 &&
            <Card  className="border-4 border-black rounded-lg p-8">
              <Card.Body><GameSearch/></Card.Body>
            </Card>
        }

        {gameCt == 1 &&
          <>
            <Card  className="border-4 border-black rounded-lg p-8">
              <Card.Body class="overflow-y-auto max-h-96"><GameData id={gameID1}/></Card.Body>
            </Card>
            {add == true? (
              <Card  className="border-4 border-black rounded-lg p-8">
                <Card.Body><GameSearch/></Card.Body>
              </Card>
            ):(
              <Button className="place-self-start border  bg-black text-white rounded border-black hover:bg-white hover:border-black hover:text-black" variant="outline-light" type="button"  onClick={() => setAdd(true)} >+</Button>
            )}

          </>
        }

        {gameCt == 2 &&
        // add a check, ensure game id's !=
          <>
            {show1 == true? (
              <>
                <Card className="border-4 border-black rounded-lg p-8">
                  <Card.Body class="overflow-y-auto max-h-96">
                    <GameData id={gameID1}/>
                  </Card.Body>
                </Card>
                <Button className="place-self-start border  bg-black text-white rounded border-black hover:bg-white hover:border-black hover:text-black" variant="outline-light" type="button"  onClick={() => setShow1(false)} >x</Button>
              </>
              ): <>{/* Instead of =>, fn onlick Add reordering of cards, allow search again if gamect!=2 */}</>
            }

            {show2 == true? (
              <>
                <Card data-bs-theme="dark" className="border-4 border-black rounded-lg p-8">
                  <Card.Body class="overflow-y-auto max-h-96">
                    <GameData id={gameID2}/>
                  </Card.Body>
                </Card>
                <Button className="place-self-start border  bg-black text-white rounded border-black hover:bg-white hover:border-black hover:text-black" variant="outline-light" type="button"  onClick={() => setShow2(false)} >x</Button>
              </>

              ): <>{/* Instead of =>, fn onlick  Add reordering of cards, allow search again */}</>
            }
          </>
        }
        
      </Container>
    </main>
  );
}

