import GameSearch from "@/components/gameSearch";
// import React, { useState,useEffect} from "react";
import { Container, Card,  Button, Form } from 'react-bootstrap'

export default function Home() {

  return (

    <main>
      <Container fluid className="grid grid-flow-col place-content-center font-mono text-black space-x-10"> 
        
        <Card  className="border-4 border-black rounded-lg p-8">
          <GameSearch/>
        </Card>
        
        {/* MAX 2 SEARCH cards? */}
        {/* <Card  className="border-4 border-black rounded-lg p-8">
          <GameSearch/>
        </Card> */}
        
      </Container>
    </main>
  );
}

