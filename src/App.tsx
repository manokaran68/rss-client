import "./css/App.css";
import RSSClient from "./RSSClient";

function App() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <RSSClient />
        </div>
      </div>
    </div>
  );
}

export default App;
