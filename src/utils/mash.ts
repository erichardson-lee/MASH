export type MashAnswer = {
  text: string;
  highlight?: boolean;
  state?: "crossed" | "selected";
};

export type MashTopic = {
  title: string;
  done?: boolean;
  answers: MashAnswer[];
};

export const delay = (timeout: number) =>
  new Promise((res) => setTimeout(res, timeout * 0.1));

export async function play(board: MashTopic[], jump: number): Promise<void> {
  const answers = board.flatMap((t) => t.answers);

  function removeAnswer(ans: MashAnswer) {
    answers.splice(
      answers.findIndex((a) => a == ans),
      1
    );
  }

  let ptr = 0;
  while (answers.length > 0) {
    // Check every topic to see if they have exactly one remaining
    topicCheck: for (const topic of board) {
      if (topic.done) continue;

      let unvisitedAnswer: MashAnswer | null = null;
      for (const answer of topic.answers) {
        if (answer.state) continue;

        // If there's already a non-visited value, then there's at least 2.
        if (unvisitedAnswer) continue topicCheck;
        unvisitedAnswer = answer;
      }

      // If there's exactly one left, make it selected and remove it
      if (unvisitedAnswer != null) {
        unvisitedAnswer.state = "selected";
        unvisitedAnswer.highlight = false;

        removeAnswer(unvisitedAnswer);
        topic.done = true;
      }
    }
    if (answers.length === 0) return;

    // Visit each cell and highlight it
    for (let i = 0; i < jump; i++) {
      if (answers?.[ptr]) answers[ptr].highlight = false;
      ptr++;
      if (ptr >= answers.length) ptr = 0;

      answers[ptr].highlight = true;
      await delay(500);
    }

    answers[ptr].state = "crossed";
    await delay(200);

    answers[ptr].highlight = false;
    removeAnswer(answers[ptr]);
    ptr--;

    console.error(answers);
  }
}

export function reset(board: MashTopic[]): void {
  for (const topic of board) {
    topic.done = undefined;
    for (const answer of topic.answers) {
      answer.highlight = undefined;
      answer.state = undefined;
    }
  }
}
