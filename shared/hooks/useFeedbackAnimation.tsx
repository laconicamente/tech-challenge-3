import { useState } from "react";
import { FeedbackAnimationProps, FeedbackAnimationType, FeedbackAnimation as FeedbackAnimationBase } from "../ui/FeedbackAnimation";

export function useFeedbackAnimation() {
  const [feedbackAnimation, setFeedbackAnimation] = useState<FeedbackAnimationProps | null>(null);

  const showFeedback = (name: FeedbackAnimationType) => {    
    setFeedbackAnimation({ name });
  };

  const hideFeedback = () => {
    setTimeout(() => {
      setFeedbackAnimation(null);
    }, 1500);
  };

  const FeedbackAnimation = () => !feedbackAnimation ? null : <FeedbackAnimationBase {...feedbackAnimation} onFinished={() => hideFeedback()} />;

  return {
    showFeedback,
    hideFeedback,
    FeedbackAnimation,
  };
}