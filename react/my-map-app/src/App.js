import React from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import './App.css';

function App() {
    return (
        <div className='App'>
            <Header />
            <main>
                <MapComponent />
            </main>
        </div>
    );
}

export default App;