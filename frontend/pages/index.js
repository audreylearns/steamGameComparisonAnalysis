
import { Container, Card } from 'react-bootstrap'
import { useAtom } from 'jotai';
import { gameCtAtom, gameID1Atom, gameID2Atom} from '@/atoms';

import GameSearch from "@/components/gameSearch";
import GameData from '@/components/gameData';

export default function Home() {
  const [gameCt, setGameCt] = useAtom(gameCtAtom);
  const [gameID1, setGameID1] = useAtom(gameID1Atom);
  const [gameID2, setGameID2] = useAtom(gameID2Atom);

  return (

    <main>
      <Container fluid className="grid grid-flow-col place-content-center font-mono text-black space-x-10"> 
        {gameCt == 0 &&
            <Card  className="border-4 border-black rounded-lg p-8">
              <GameSearch/>
            </Card>
        }

        {gameCt == 1 &&
          <Card  className="border-4 border-black rounded-lg p-8">
            <GameData id={gameID1}/>
          </Card>
        }
        
      </Container>
    </main>
  );
}

