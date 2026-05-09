import { Switch, Route, Router as WouterRouter } from "wouter";
import { StoreProvider } from "./context/StoreContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <StoreProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </StoreProvider>
  );
}

export default App;
