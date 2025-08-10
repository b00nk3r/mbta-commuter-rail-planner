import React, { useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function Alerts(){
    const[alerts, setAlerts] = useState([]);

    useEffect(() => {
        async function fetchData(){
            const result = await axios(

                'https://api-v3.mbta.com/lines?sort=long_name',
            );
            setAlerts(result.data.data);
        }
        fetchData();
    }, []);

    return (
        
        <div>
            <h1>Lines</h1>
            {alerts.map(alert => (
                <div key={alert.id}>
                    <h3>{alert.attributes.header}</h3>
                    <p>{alert.attributes.description}</p>
                </div>
             ))}
            {alerts.map(alert => (
                <Card
                    body
                    outline
                    color="success"
                    className = "mx-1 my -2"
                    style = {{width: "30rem", color : `#${alert.attributes.color}`}
                            }

                    >
                    <Card.Body>
                        <Card.Title>
                            Line
                        </Card.Title>

                        <Card.Text >{alert.attributes.header}
                        {alert.attributes.long_name}</Card.Text>
                    </Card.Body>
                    
                </Card>
            ))}

        </div>
    );
}

export default Alerts;

