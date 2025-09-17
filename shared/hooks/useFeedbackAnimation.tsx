import { useState } from "react";
import { FeedbackAnimationProps, FeedbackAnimation as FeedbackAnimationBase } from "../ui/FeedbackAnimation";

export function useFeedbackAnimation() {
  const [feedbackAnimation, setFeedbackAnimation] = useState<FeedbackAnimationProps | null>(null);

  const showFeedback = (name: 'success' | 'error') => {
    setFeedbackAnimation({ name });
  };

  const hideFeedback = () => {
    setFeedbackAnimation(null);
  };

  const FeedbackAnimation = () => !feedbackAnimation ? null : <FeedbackAnimationBase {...feedbackAnimation} onFinished={() => hideFeedback()}/>;

  return {
    showFeedback,
    hideFeedback,
    FeedbackAnimation,
  };
}