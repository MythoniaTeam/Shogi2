import logo from '../logo.svg';
import '../App.css';
import './main.css';
import { GameBoard } from './GameBoard';

export default function App() {
    return (
        <div id="App" className="App">
            <GameBoard width={9} height={9} winLength={3} rowNoType="number" columnNoType="chinese"/>
        </div>
    );
}







