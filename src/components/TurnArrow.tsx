import { ReactComponent as Turn } from "../assets/turn.svg";
import styled from "styled-components";

type Props = {
  dir: "left" | "right";
};

export default (props: Props) => <TurnArrow dir={props.dir} />;

const TurnArrow = styled(Turn)`
  transform: scale(${({ dir }: Props) => `${dir === "right" ? 1 : -1}`}, -1);
`;
