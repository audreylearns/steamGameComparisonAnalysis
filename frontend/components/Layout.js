/*================================================================================================================================
Owner: Audrey Duzon
==================================================================================================================================*/

import { Container } from 'react-bootstrap'


export default function Layout(props){
    return (
        <>  
            <header className="py-4 fixed-top text-6xl font-bold text-black text-center border-4 border-black rounded-lg font-mono">
                STEAM SENTIMENT ANALYSIS
            </header>
            <br />
            <Container>
                {props.children}
            </Container>
            <br />
            
            <footer className="fixed bottom-0 inset-x-0 divide-x font-mono">
                <hr className="h-1 bg-black"/>
                <p className="text-center text-black font-mono">Web developed by Audrey Duzon. </p>
                <p className="text-center text-black text-xs font-mono">powered by React-Bootstrap-Tailwind </p>
            </footer>

        </>
    )
}