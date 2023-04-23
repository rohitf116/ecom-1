import { Container } from "react-bootstrap";
import HomeScreen from "../screens/HomeScreen";

const Main = () => {
  return (
    <div>
      <main className="py-3">
        <Container className="text-center">
          <h1>Welcome to Ecom</h1>
          <HomeScreen />
        </Container>
      </main>
    </div>
  );
};

export default Main;
