import { createSignal } from "solid-js";
import "./home.css";
import BgImg from '/public/pages-img/planet-earth.jpg';

function Home() {
  const [image, setImage] = createSignal("");

  return (
    <div class="image-container">
      <img src={BgImg} alt="space" />
      <div class="text-container">
        <h1 class="title">Discover</h1>
        <h1 class="title">
          the <span class="wonders">wonders</span>
        </h1>
        <h1 class="title">of space.</h1>
        <p>
          Experience the captivating beauty and mysteries of the cosmos on our
          journey:
        </p>
      </div>
    </div>
  );
}

export default Home;