
import './App.css';
import CsvToJson from './components/map/CsvToJson';
import ExcelToJson from './components/map/ExcelToJson';
import Map from './components/map/Map';

function App() {
  return (
    <div className="App">
      <Map />
      <CsvToJson />
      <ExcelToJson />
    </div>
  );
}

export default App;
