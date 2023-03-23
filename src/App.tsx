import { useState, useEffect } from 'react';
import { getData } from './utils';
import type { ItemData } from './types';

function App() {
    const [temperature, setTemperature] = useState<ItemData[]>([]);
    const [precipitation, setPrecipitation] = useState<ItemData[]>([]);

    useEffect(() => {
        (async () => {
            setTemperature(await getData<ItemData>('../data/temperature.json'));
            setPrecipitation(await getData<ItemData>('../data/precipitation.json'));
        })();
    }, []);

    return (
        <div>
            <div>
                Temperature data length: {temperature.length}
                <details>
                    <summary>Temperature</summary>
                    {JSON.stringify(temperature)}
                </details>
            </div>
            <br />
            <div>
                Precipitation data length: {precipitation.length}
                <details>
                    <summary>Precipitation</summary>
                    {JSON.stringify(precipitation)}
                </details>
            </div>
        </div>
    );
}

export default App;
