import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// GeoJSONファイルと対応する色を配列で管理
const geoFiles = [
    { file: 'AwaraCity.geojson', color: '#E60000', municipality: 'あわら市' },
    { file: 'EiheijiTown.geojson', color: '#FF9900', municipality: '永平寺町' },
    { file: 'EtizenCity.geojson', color: '#33CC33', municipality: '越前市' },
    { file: 'EtizenTown.geojson', color: '#0066CC', municipality: '越前町' },
    { file: 'FukuiCity.geojson', color: '#ffffcc', municipality: '福井市' },
    { file: 'IkedaTown.geojson', color: '#FFCC00', municipality: '池田町' },
    { file: 'KatuyamaCity.geojson', color: '#009999', municipality: '勝山市' },
    { file: 'MihamaTown.geojson', color: '#CC66CC', municipality: '美浜町' },
    { file: 'MinamietizenTown.geojson', color: '#663300', municipality: '南越前町' },
    { file: 'ObamaCity.geojson', color: '#800026', municipality: '小浜市' },
    { file: 'OhoiTown.geojson', color: '#FFCC66', municipality: 'おおい町' },
    { file: 'OnoCity.geojson', color: '#99FF99', municipality: '大野市' },
    { file: 'SabaeCity.geojson', color: '#66B2FF', municipality: '鯖江市' },
    { file: 'SakaiCity.geojson', color: '#CC99FF', municipality: '坂井市' },
    { file: 'TakahamaTown.geojson', color: '#FFFF99', municipality: '高浜町' },
    { file: 'TurugaCity.geojson', color: '#66CCCC', municipality: '敦賀市' },
    { file: 'WakasaTown.geojson', color: '#FF99FF', municipality: '若狭町' },
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
