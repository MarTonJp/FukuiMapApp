import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geoFiles = [
    // ...（この部分は元のまま）
];

function MapComponent() {
    const [geoDataList, setGeoDataList] = useState([]);
    const [year, setYear] = useState('2010');
    const [category, setCategory] = useState('all');

    useEffect(() => {
        async function loadData() {
            const fukuiPath = `/data/fukui-${year}-${category}.json`;
            const colorTablePath = '/data/color_table.json';

            const [fukuiRes, colorTableRes] = await Promise.all([
                fetch(process.env.PUBLIC_URL + fukuiPath),
                fetch(process.env.PUBLIC_URL + colorTablePath)
            ]);

            const fukuiData = await fukuiRes.json();
            const colorTable = await colorTableRes.json();

            const loadedDataList = await Promise.all(
                geoFiles.map(async (item) => {
                    const geojsonRes = await fetch(process.env.PUBLIC_URL + '/data/' + item.file);
                    const geojson = await geojsonRes.json();

                    const grade = fukuiData[item.municipality];
                    const fillColor = colorTable[String(grade)] || '#ccc';

                    return {
                        data: geojson,
                        style: {
                            color: 'black',
                            fillColor,
                            weight: 1.5,
                            fillOpacity: 0.7
                        }
                    };
                })
            );

            setGeoDataList(loadedDataList);
        }

        loadData();
    }, [year, category]); // ← 選択変更で再読み込み

    return (
        <div>
            {/* 選択UI */}
            <div style={{ padding: '10px' }}>
                <label>
                    年:
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="2010">2010</option>
                        <option value="2015">2015</option>
                        <option value="2020">2020</option>
                    </select>
                </label>
                &nbsp;&nbsp;
                <label>
                    区分:
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">総計</option>
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                    </select>
                </label>
            </div>

            {/* 地図表示 */}
            <div style={{ height: '90vh', width: '100%' }}>
                <MapContainer
                    center={[35.7655, 136.1870]}
                    zoom={9}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
                    />
                    {geoDataList.map((item, index) => (
                        <GeoJSON key={index} data={item.data} style={item.style} />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapComponent;
