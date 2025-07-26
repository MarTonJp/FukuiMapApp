import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// GeoJSONファイルと対応する色を配列で管理
const geoFiles = [
    { file: 'data/AwaraCity.geojson', color: '#E60000' },
    { file: 'data/EiheijiTown.geojson', color: '#FF9900' },
    { file: 'data/EtizenCity.geojson', color: '#33CC33' },
    { file: 'data/EtizenTown.geojson', color: '#0066CC' },
    { file: 'data/FukuiCity.geojson', color: '#9933CC' },
    { file: 'data/IkedaTown.geojson', color: '#FFCC00' },
    { file: 'data/KatuyamaCity.geojson', color: '#009999' },
    { file: 'data/MihamaTown.geojson', color: '#CC66CC' },
    { file: 'data/MinamietizenTown.geojson', color: '#663300' },
    { file: 'data/ObamaCity.geojson', color: '#FF6666' },
    { file: 'data/OhoiTown.geojson', color: '#FFCC66' },
    { file: 'data/OnoCity.geojson', color: '#99FF99' },
    { file: 'data/SabaeCity.geojson', color: '#66B2FF' },
    { file: 'data/SakaiCity.geojson', color: '#CC99FF' },
    { file: 'data/TakahamaTown.geojson', color: '#FFFF99' },
    { file: 'data/TurugaCity.geojson', color: '#66CCCC' },
    { file: 'data/WakasaTown.geojson', color: '#FF99FF' },
];

function MapComponent() {
    const [geoDataList, setGeoDataList] = useState([]);

    useEffect(() => {
        Promise.all(
            geoFiles.map((item) =>
                fetch(process.env.PUBLIC_URL + `/${item.file}`).then((res) => res.json())
            )
        ).then((dataList) => {
            const combined = dataList.map((data, index) => ({
                data,
                style: {
                    color: 'black',
                    fillColor: geoFiles[index].color,
                    weight: 1.5,
                    fillOpacity: 0.5
                }
            }));
            setGeoDataList(combined);
        });
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
                center={[35.7655, 136.1870]}
                zoom={9}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
                />
                {geoDataList.map((item, index) => (
                    <GeoJSON key={index} data={item.data} style={item.style} />
                ))}
            </MapContainer>
        </div>
    );
}

export default MapComponent;
