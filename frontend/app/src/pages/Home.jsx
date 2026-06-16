import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    api
      .get("/protected") // example endpoint
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

export default Home;