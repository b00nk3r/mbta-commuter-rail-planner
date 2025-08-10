import React, { useEffect, useState } from 'react';
import getUserInfo from '../utils/decodeJwt';

const Landingpage = () => {
    const [user, setUser] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    const getButtonStyle = (buttonType, isHovered) => {
        const baseStyles = {
            width: '450px',
            transition: 'all 0.2s ease'
        };

        switch (buttonType) {
            case 'signup':
                return {
                    ...baseStyles,
                    backgroundColor: isHovered ? 'rgb(140, 58, 108)' : 'rgb(160, 68, 118)',
                    color: 'rgb(255, 255, 255)'
                };
            case 'login':
                return {
                    ...baseStyles,
                    backgroundColor: isHovered ? 'rgb(139, 139, 139)' : 'rgb(159, 159, 159)',
                    color: 'rgb(46, 46, 46)'
                };
            case 'guest':
                return {
                    ...baseStyles,
                    backgroundColor: isHovered ? 'rgb(240, 240, 240)' : 'rgb(255, 255, 255)',
                    color: 'rgb(70, 70, 70)',
                    border: '2px solid rgb(100, 100, 100)'
                };
            default:
                return baseStyles;
        }
    };

    return (
        <div
            style={{
                background: 'linear-gradient(120deg, #F7F7F7 0%, #F7F7F7 100%)',
                minHeight: '100vh',
                fontFamily: 'Helvetica, Arial, sans-serif',
            }}
            className="flex flex-col justify-center items-center"
        >
            {/* Large Train Image */}
            <img
                src="/train.png"
                alt="MBTA Commuter Rail"
                style={{
                    width: '50%',
                    maxWidth: '600px',
                    margin: '2rem 0',
                }}
            />
            
            {/* Title and Subtitle */}
            <div className="text-center mb-8">
                <div
                    className="text-5xl font-bold mb-4"
                    style={{
                        color: 'rgb(46,46,46)', // Set text color here
                    }}
                >
                    MBTA COMMUTER RAIL EXPLORER
                </div>
                <div
                    className="text-3xl mb-8"
                    style={{
                        color: 'rgb(46,46,46)', // Set text color here
                    }}
                >
                    Discover Massachusetts on the commuter rail.
                </div>
            </div>

            {/* Navigation Links */}
            {!user && (
                <div className="flex flex-col items-center space-y-6">
                    <a 
                        href="/signup" 
                        className="text-2xl transition-colors py-4 px-8 rounded-2xl block text-center no-underline"
                        style={getButtonStyle('signup', hoveredButton === 'signup')}
                        onMouseEnter={() => setHoveredButton('signup')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Sign Up
                    </a>
                    <a 
                        href="/login" 
                        className="text-2xl transition-colors py-4 px-8 rounded-2xl block text-center no-underline"
                        style={getButtonStyle('login', hoveredButton === 'login')}
                        onMouseEnter={() => setHoveredButton('login')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Login
                    </a>
                    <a 
                        href="/tripPlannerPage" 
                        className="text-2xl transition-colors py-4 px-8 rounded-2xl block text-center no-underline"
                        style={getButtonStyle('guest', hoveredButton === 'guest')}
                        onMouseEnter={() => setHoveredButton('guest')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Continue as Guest
                    </a>
                </div>
            )}
        </div>
    );
};

export default Landingpage;