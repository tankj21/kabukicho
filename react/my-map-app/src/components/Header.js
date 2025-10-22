import React, { useState } from 'react';
import './Header.css';

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = (e) => {
        e.preventDefault();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <div className="headerbox">
                <div className="menu-container">
                    <a id="btn_menu" href="#" onClick={toggleMenu}>
                        <span></span>
                    </a>
                    <ul id="menu" className={`dropdown-menu ${isMenuOpen ? 'is-active' : ''}`}>
                        <li><a href="#">アイテム1</a></li>
                        <li><a href="#">アイテム2</a></li>
                        <li><a href="#">アイテム3</a></li>
                    </ul>
                </div>
                <img id="menu" src="/source/img/kabuki_title.png" alt="タイトル画像" />
            </div>
        </header>
    );
};

export default Header;