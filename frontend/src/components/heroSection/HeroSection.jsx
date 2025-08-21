import AnimatedHeading from "./animatedHeading.jsx";
import GradientButton from "./gradientButton.jsx";


export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 space-y-8">
      <AnimatedHeading />
      <p className="text-lg md:text-xl text-gray-800 max-w-xl leading-relaxed font-medium">
        A conversational chatbot that remembers you, adapts to your tone, and feels genuinely human.
      </p>
      <GradientButton />
    </div>
  );
}