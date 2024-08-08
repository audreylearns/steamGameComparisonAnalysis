/*================================================================================================================================
Owner: Audrey Duzon
==================================================================================================================================*/

import { Container } from 'react-bootstrap'

export default function Layout(props){
    return (
        <>  
            <header className="py-4 fixed-top text-6xl font-bold text-black text-center border-y-4 border-black font-mono">
                STEAM SENTIMENT ANALYSIS
            </header>
            <br />
            <Container>
                {props.children}
            </Container>
            <br /><br /><br />
            
            <footer className="fixed bottom-0 inset-x-0 divide-x font-mono bg-white opacity-75">
                <hr className="h-1 bg-black"/>
                <p className="text-center text-black font-mono">Application developed by Audrey Duzon. </p>
                <p className="text-center text-black text-xs font-mono"><a href="https://github.com/audreylearns">https://github.com/audreylearns</a></p>
            </footer>

        </>
    )
}