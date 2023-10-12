import logo from '../logo.svg';
import '../App.css';
import './main.css';
import { GameBoard } from './GameBoard';
import {Game} from "./Game";

export default function App() {

    let game = new Game(9, 9, true);

    return (
        <div id="App" className="App">
            <GameBoard game={game} rowNoType="number" columnNoType="chinese"/>
        </div>
    );
}







