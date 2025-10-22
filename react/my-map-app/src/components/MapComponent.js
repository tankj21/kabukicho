import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 100px)'
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
};

const PROXIMITY_THRESHOLD = 30;

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: ProcessingInstruction.env.REACT_APP_GOOGLE_MAPD_API_KEY,
        libraries: ['geometry'],
    });

    const [shops, setShops] = useState([
        {
            name: 'すずやさん',
            lat: 35.693832,
            lng: 139.701020,
            audioFile: '/source/audio/oo.mp3',
            triggered: false
        },
        {
            name: 'shops',
            lat: 1.0000,
            lng: 1.0000,
            audioFile: '/source/audio/oo.mp3',
            triggered: false
        }
    ]);


    const [currentPosition, setCurrentPosition] = useState(null);

    const checkProximity = useCallback((userPos) => {
        if (!window.google || !window,google.maps.geometry) return;

        const userLatLng = new window.google.maps.LatLng(userPos.lat, userPos.lng);
        
        shops.forEach((shop, index) => {
            const shopLatLng = new window.google.maps.LatLng(shop.lat, shop.lng);
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(userLatLng, shopLatLng);

            if (distance < PROXIMITY_THRESHOLD && !shop.triggered) {
                console.log(shop.name + "に近づきました!");

                const audio = new Audio(shop.audioFile);

                audio.play().catch(error => console.error("音声の再生に失敗しました:", error));

                alert(shop.name + "のガイドを開始します。");

                setShops(prevShops => {
                    const newShops = [...prevShops];
                    newShops[index].triggered = true;
                    return newShops;
                });
            }

        });
    }, [shops]);


    useEffect(() => {
        if (!navigator.geolocation) {
            alert('GPSに対応していないブラウザです');
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCurrentPosition(userPos);
                checkProximity(userPos);
            },
            () => {
                alert('GPS情報の取得に失敗しました。');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );


        return () => navigator.geolocation.clearWatch(watchId);
    }, [checkProximity]);

    const initialCenter = useMemo(() => ({
        lat: 35.693832,
        lng: 139.701020
    }), []);

    if (!isLoaded) return <div>地図を読み込んでいます。</div>;

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition || initialCenter}
                zoom={18}
                options={mapOptions}
            >
                {shops.map((shop, index) => (
                    <Marker
                        key={index}
                        position={{ lat: shop.lat, lng: shop.lng }}
                        title={shop.name}
                    />
                ))}
                
                {currentPosition && (
                    <Marker
                        position={currentPosition}
                        icon={'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
                    />
                )}
            </GoogleMap>
        </div>
    );

};

export default MapComponent;
