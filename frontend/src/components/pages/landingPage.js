import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import getUserInfo from '../../utilities/decodeJwt';

const Landingpage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    return (
        <div
            style={{
                backgroundImage: 'url("/74131098007-mbta-train-5.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
            }}
            className="text-white p-5 flex justify-center items-center"
        >
            <Card
                style={{
                    width: '30rem',
                    height: '30rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                }}
                className="mx-2 my-2"
            >
                <Card.Body className="text-center">
                    <div className="text-4xl font-bold mb-5">MBTA Commuter Rail Explorer</div>
                    <div className="text-2xl mb-10">Discover MA on the commuter rail!</div>

                    {!user && (
                        <>
                            <div className="mb-4">
                                <Card.Link href="/signup" className="text-3xl text-white">Sign Up</Card.Link>
                            </div>
                            <div className="mb-4">
                                <Card.Link href="/login" className="text-3xl text-white">Login</Card.Link>
                            </div>
                            <div>
                                <Card.Link href="/tripPlannerPage" className="text-3xl text-white">Continue as Guest</Card.Link>
                            </div>
                        </>
                    )}


                </Card.Body>
            </Card>
        </div>
    );
};

export default Landingpage;
