import "@/index.css";

import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function Magic8Ball() {
  const { input, output } = useToolInfo<"basic-answer">();
  if (!output) {
    return <div>Shaking...</div>;
  }

  return (
    <div className="p-4 space-y-2">
      <p className="text-body"><strong>Question:</strong> {input.question}</p>
      <p className="text-body"><strong>Answer:</strong> {output.answer}</p>
    </div>
  );
}

export default Magic8Ball;

mountWidget(<Magic8Ball />);
