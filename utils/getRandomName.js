import nouns from "./nouns";
import adjectives from "./adjectives";

export default function randomName() {
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    " " +
    nouns[Math.floor(Math.random() * nouns.length)]
  ).replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase());
}
