import React from 'react'
import Card from 'react-bootstrap/Card';

const Landingpage = () => {
    
    return (
        <div className="bg-blue-500 text-white p-5 h-screen flex justify-center items-center">
            <Card style={{ width: '30rem', height: '30rem' }} className="mx-2 my-2">
                <Card.Body className="text-center">
                <div className="text-4xl font-bold mb-5">MBTA Commuter Rail Explorer</div>
                    <div className="text-2xl mb-10">Discover MA on the commuter rail!</div>
                    <div className='mb-4'>
                    <Card.Link href="/signup" className="flex justify-center items-center justify-center items-center  text-3xl">Sign Up</Card.Link>
                    </div>
                    <Card.Link href="/login" className="flex justify-center items-center justify-center items-center text-3xl text-blue-30" >Login</Card.Link>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Landingpage;
