import "./App.css";
import RandomButton from "./components/RandomButton";
import View from "./components/view/View";

function App() {
  return (
    <>
      <div className="container">
        <View viewId={1} />
        <View viewId={2} />
      </div>
      <RandomButton />
    </>
  );
}

export default App;
